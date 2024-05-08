import { EquipmentSlot, ItemStack, Player, world, system, EntityDamageCause, EntityComponentTypes } from '@minecraft/server';
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';
import { worldBorderCheck } from './world_border';
import { elytraCheck } from './elytra_plugin';
import { log_block_event, log_kill_event, log_death_event, log_self_death_event, log_player_death_event } from './stats_log_plugin';
import { relay_message, relay_event } from './chat_plugin';

const guild_id = '611008530077712395'
// Main guild 611008530077712395
// Test guild 1023300252805103626


// Runs certain functions every second. 1 second = 20 ticks
system.runInterval(() => {
    var playerlist = world.getPlayers();

    playerlist.forEach((player) => {
        elytraCheck(player)
        worldBorderCheck(player)
    });
}, 20)


world.afterEvents.playerSpawn.subscribe(({ initialSpawn: first_time_connecting, player: player }) => {
    if (first_time_connecting) {
        const request = new HttpRequest(`http://thorny-wbs:8000/connect?guild_id=${guild_id}&gamertag=${player.name.replace(' ', '%20')}`);
        request.setTimeout(2)
        request.method = HttpRequestMethod.Post;
        request.body = 'body';
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];

        console.log(`Sending HTTP Request for connect for ${player.name}`)

        http.request(request);
        system.run(() => { relay_event(`${player.name} has joined the server`, 'green') })

        player.sendMessage(`§aWelcome to Everthorn, §l${player.name}§r\n| We've missed you so much!\n| Hop on noisechat to chat with the server!\n| WBored? Go and complete some quests!\n---------\n`)
    }
})


world.afterEvents.playerLeave.subscribe(({ playerName: player_name }) => {
    const request = new HttpRequest(`http://thorny-wbs:8000/disconnect?guild_id=${guild_id}&gamertag=${player_name.replace(' ', '%20')}`);
    request.setTimeout(2)
    request.method = HttpRequestMethod.Post;
    request.body = 'body';
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    console.log(`Sending HTTP Request for disconnect for ${player_name}`)

    http.request(request);
    system.run(() => { relay_event(`${player_name} has left the server`, 'red') })
})


world.beforeEvents.playerBreakBlock.subscribe(({ player, block }) => {
    const block_id = block.typeId
    const dimension = player.dimension

    system.run(() => { log_block_event('mine', player, block, block_id, guild_id) })
}
)


world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    const block_id = block.typeId
    const dimension = player.dimension

    system.run(() => { log_block_event('place', player, block, block_id, guild_id) })
})


world.afterEvents.playerInteractWithBlock.subscribe((data) => {
    const block_id = data.block.typeId
    const dimension = data.player.dimension

    console.log(`Dimension of Chest: ${dimension}`)

    if (block_id == 'minecraft:chest') {
        system.run(() => { log_block_event('interact', data.player, data.block, block_id, guild_id) })
    }
})


world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
    // Case when the player kills something
    if (damageSource.damagingEntity instanceof Player) {
        const player = damageSource.damagingEntity

        // Case when the player kills a player
        if (deadEntity instanceof Player) {
            const dead_player = deadEntity

            log_player_death_event(dead_player, player, guild_id)
            system.run(() => { relay_event(`${dead_player.name} died by ${player.name}'s wrath`, 'yellow') })
        }
        // Case when the player kills an entity
        else {
            log_kill_event(player, deadEntity, guild_id)
        }
    }
    // Case when an entity kills a player
    else if (deadEntity instanceof Player && damageSource.damagingEntity) {
        const killer = damageSource.damagingEntity
        const player = deadEntity

        log_death_event(player, killer, guild_id)
        system.run(() => { relay_event(`${player.name} died`, 'yellow') })
    }
    // Case when player suicides
    else if (deadEntity instanceof Player && !damageSource.damagingEntity) {
        const player = deadEntity

        log_self_death_event(player, damageSource.cause, guild_id)
        system.run(() => { relay_event(`${player.name} decided to die...`, 'yellow') })
    }
})


world.beforeEvents.chatSend.subscribe((data) => {
    world.sendMessage({
        rawtext: [
            {
                text:
                    "§l§8[§r" +
                    (data.sender
                        .getTags()
                        .find((tag) => tag.startsWith("rank:"))
                        ?.substring(5)
                        ?.replaceAll("--", "§r§l§8][§r") ?? "§bMember") +
                    `§l§8]§r §7${data.sender.nameTag}:§r ${data.message}`,
            },
        ],
    });
    data.cancel = true;

    system.run(() => { relay_message(data.sender.nameTag, data.message) });
});