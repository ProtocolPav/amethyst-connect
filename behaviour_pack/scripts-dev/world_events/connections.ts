import { ThornyUser, Relay } from '../api'
import * as utils from '../utils'
import { world } from '@minecraft/server';

export function load_connections_handler(guild_id) {

    // Handle Player Join Event
    world.afterEvents.playerSpawn.subscribe((spawn_event) => {
        if (spawn_event.initialSpawn) {
            ThornyUser.get_user_from_api(guild_id, spawn_event.player.name)
            .then(thorny_user => {
                thorny_user.send_connect_event('connect')
                Relay.event(`${spawn_event.player.name} has joined the server`, 'join')
                utils.send_motd(spawn_event.player)

                if (thorny_user.patron) {
                    spawn_event.player.nameTag = `§l§c${spawn_event.player.nameTag}`
                }
            });
        }
    })

    // Handle Player Leave Event
    world.afterEvents.playerLeave.subscribe((leave_event) => {
        const thorny_user = ThornyUser.fetch_user(leave_event.playerName)
        thorny_user?.send_connect_event('disconnect')
        Relay.event(`${leave_event.playerName} has left the server`, 'leave')
    })

}