import * as utils from './utils'
import { QuestCache, InteractionQueue, process_interactions } from './quest';
import { Player, world, system, EntityComponentTypes, EquipmentSlot } from '@minecraft/server';
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

function send_connect_request(thorny_id_map:object, player: Player) {
    const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/events/connection`);
    request.method = HttpRequestMethod.Post;
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];
    request.body = JSON.stringify({"type": "connect", "thorny_id": thorny_id_map[player.name]});
    console.log(`[Plugin] [Logs] Sending Connect to NexusCore for ${player.name}`);

    http.request(request);

    player.sendMessage(`§aWelcome to Everthorn, §l${player.name}§r\n| We've missed you so much!\n| Hop on noisechat to chat with the server!\n| Bored? Go and complete some quests!\n---------\n`)
}

export function load(guild_id: string) {

    console.log('[Plugin] [Interactions] Loading Interactions Plugin...')

    var thorny_id_map = {}
    var cached_quests: QuestCache = {}
    var interaction_queue: InteractionQueue = new InteractionQueue()

    system.runInterval(() => {
        process_interactions(interaction_queue, cached_quests)
    }, 1)

    world.afterEvents.playerSpawn.subscribe(({ initialSpawn: first_time_connecting, player: player }) => {
        if (first_time_connecting) {
            if (!(player.name in thorny_id_map)) {
                http.get(`http://nexuscore:8000/api/v0.1/users/guild/${guild_id}/${player.name}`)
                    .then(response => {
                        thorny_id_map[player.name] = JSON.parse(response.body)["user"]["thorny_id"]

                        send_connect_request(thorny_id_map, player)
                    });
            }
            else {
                send_connect_request(thorny_id_map, player)
            }
            
        }
    })
    
    world.afterEvents.playerLeave.subscribe(({ playerName: player_name }) => {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/events/connection`);
        request.method = HttpRequestMethod.Post;
        request.body = JSON.stringify({"type": "disconnect", "thorny_id": thorny_id_map[player_name]});
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];

        console.log(`[Plugin] [Logs] Sending Disonnect to NexusCore for ${player_name}`);

        http.request(request);
    })
    
    world.beforeEvents.playerBreakBlock.subscribe(({ player, block }) => {
        const block_id = block.typeId
        const block_location = [block.x, block.y]
        const dimension = player.dimension
    
        system.run(() => {
            // Log Interaction to NexusCore
            utils.log_block_event('mine', dimension, player, block, block_id, thorny_id_map)

            // Add Interaction to Queue for processing
            interaction_queue.enqueue({
                thorny_id: thorny_id_map[player.name],
                time: new Date(),
                target_id: block_id,
                target_location: block_location,
                mainhand: player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? null
            })
        })
    })
    
    world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
        const block_id = block.typeId
        const dimension = player.dimension
    
        system.run(() => { utils.log_block_event('place', dimension, player, block, block_id, thorny_id_map) })
    })
    
    world.afterEvents.playerInteractWithBlock.subscribe((data) => {
        const block_id = data.block.typeId
        const dimension = data.player.dimension
        
        // List of all block IDs that the system will log.
        // Anything that isn't these will not be logged.
        const all_blocks: string[] = [
            MinecraftBlockTypes.Chest, MinecraftBlockTypes.Barrel, MinecraftBlockTypes.RedShulkerBox,
            MinecraftBlockTypes.BlueShulkerBox, MinecraftBlockTypes.CyanShulkerBox, MinecraftBlockTypes.GrayShulkerBox,
            MinecraftBlockTypes.LimeShulkerBox, MinecraftBlockTypes.PinkShulkerBox, MinecraftBlockTypes.BlackShulkerBox,
            MinecraftBlockTypes.BrownShulkerBox, MinecraftBlockTypes.GreenShulkerBox, MinecraftBlockTypes.WhiteShulkerBox,
            MinecraftBlockTypes.OrangeShulkerBox, MinecraftBlockTypes.PurpleShulkerBox, MinecraftBlockTypes.UndyedShulkerBox,
            MinecraftBlockTypes.YellowShulkerBox, MinecraftBlockTypes.MagentaShulkerBox, MinecraftBlockTypes.LightBlueShulkerBox,
            MinecraftBlockTypes.LightGrayShulkerBox
        ]
    
        if (all_blocks.includes(block_id)) {
            system.run(() => { utils.log_block_event('use', dimension, data.player, data.block, block_id, thorny_id_map) })
        }
    })
    
    
    world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
        // Case when the player kills something
        if (damageSource.damagingEntity instanceof Player) {
            const player = damageSource.damagingEntity
            const dimension = player.dimension
    
            // Case when the player kills a player
            if (deadEntity instanceof Player) {
                const dead_player = deadEntity
    
                utils.log_player_death_event(dimension, dead_player, player, thorny_id_map)
            }
            // Case when the player kills an entity
            else {
                utils.log_kill_event(dimension, player, deadEntity, thorny_id_map)
            }
        }
        // Case when an entity kills a player
        else if (deadEntity instanceof Player && damageSource.damagingEntity) {
            const killer = damageSource.damagingEntity
            const player = deadEntity

            const dimension = player.dimension
    
            utils.log_death_event(dimension, player, killer, thorny_id_map)
        }
        // Case when player suicides
        else if (deadEntity instanceof Player && !damageSource.damagingEntity) {
            const player = deadEntity
            const dimension = player.dimension
    
            utils.log_self_death_event(dimension, player, damageSource.cause, thorny_id_map)
        }
    })

    console.log('[Plugin] [Interactions] Successfully loaded!')
}