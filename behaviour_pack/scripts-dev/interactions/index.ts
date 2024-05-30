import * as utils from './utils'
import { Player, world, system } from '@minecraft/server';
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';
import {MinecraftEntityTypes, MinecraftBlockTypes} from "@minecraft/vanilla-data";

export function load(guild_id: string) {
    var thorny_id_map = {}

    world.afterEvents.playerSpawn.subscribe(({ initialSpawn: first_time_connecting, player: player }) => {
        if (first_time_connecting) {

            if (!(player.name in thorny_id_map)) {
                http.get(`http://nexuscore:8000/api/v0.1/users/guild/${guild_id}/${player.name}`).then(response => {
                    thorny_id_map[player.name] = JSON.parse(response.body)["user"]["thorny_id"]
                })
            }

            const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/events/connection`);
            request.method = HttpRequestMethod.Post;
            request.body = JSON.stringify({"type": "connect", "thorny_id": thorny_id_map[player.name]});
            request.headers = [
                new HttpHeader("Content-Type", "application/json"),
                new HttpHeader("auth", "my-auth-token"),
            ];

            console.log(`[Plugin] [Logs] Sending Connect to NexusCore for ${player.name}`);

            http.request(request);
    
            player.sendMessage(`§aWelcome to Everthorn, §l${player.name}§r\n| We've missed you so much!\n| Hop on noisechat to chat with the server!\n| Bored? Go and complete some quests!\n---------\n`)
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
        const dimension = player.dimension
    
        system.run(() => { utils.log_block_event('mine', dimension, player, block, block_id, thorny_id_map) })
    })
    
    world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
        const block_id = block.typeId
        const dimension = player.dimension
    
        system.run(() => { utils.log_block_event('place', dimension, player, block, block_id, thorny_id_map) })
    })
    
    world.afterEvents.playerInteractWithBlock.subscribe((data) => {
        const block_id = data.block.typeId
        const dimension = data.player.dimension
        
        // The block IDs that will be logged.
        const all_blocks = [
            MinecraftBlockTypes.Chest, MinecraftBlockTypes.Barrel, MinecraftBlockTypes.RedShulkerBox,
            MinecraftBlockTypes.BlueShulkerBox, MinecraftBlockTypes.CyanShulkerBox, MinecraftBlockTypes.GrayShulkerBox,
            MinecraftBlockTypes.LimeShulkerBox, MinecraftBlockTypes.PinkShulkerBox, MinecraftBlockTypes.BlackShulkerBox,
            MinecraftBlockTypes.BrownShulkerBox, MinecraftBlockTypes.GreenShulkerBox, MinecraftBlockTypes.WhiteShulkerBox,
            MinecraftBlockTypes.OrangeShulkerBox, MinecraftBlockTypes.PurpleShulkerBox, MinecraftBlockTypes.UndyedShulkerBox,
            MinecraftBlockTypes.YellowShulkerBox, MinecraftBlockTypes.MagentaShulkerBox, MinecraftBlockTypes.LightBlueShulkerBox,
            MinecraftBlockTypes.LightGrayShulkerBox
        ]
    
        if (block_id in all_blocks) {
            system.run(() => { utils.log_block_event('use', dimension, data.player, data.block, block_id, thorny_id_map) })
        }
    })
    
    
    world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
        // Case when the player kills something
        if (damageSource.damagingEntity instanceof Player) {
            const player = damageSource.damagingEntity
    
            // Case when the player kills a player
            if (deadEntity instanceof Player) {
                const dead_player = deadEntity
    
                utils.log_player_death_event(dead_player, player, guild_id)
            }
            // Case when the player kills an entity
            else {
                utils.log_kill_event(player, deadEntity, guild_id)
            }
        }
        // Case when an entity kills a player
        else if (deadEntity instanceof Player && damageSource.damagingEntity) {
            const killer = damageSource.damagingEntity
            const player = deadEntity
    
            utils.log_death_event(player, killer, guild_id)
        }
        // Case when player suicides
        else if (deadEntity instanceof Player && !damageSource.damagingEntity) {
            const player = deadEntity
    
            utils.log_self_death_event(player, damageSource.cause, guild_id)
        }
    })
}