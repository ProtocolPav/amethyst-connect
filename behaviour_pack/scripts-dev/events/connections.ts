import api from '../api'
import utils from '../utils';
import { world } from '@minecraft/server';

export default function load_connections_handler(guild_id: string) {

    // Handle Player Join Event
    world.afterEvents.playerSpawn.subscribe((spawn_event) => {
        if (spawn_event.initialSpawn) {
            try {
                api.ThornyUser.get_user_from_api(guild_id, spawn_event.player.name)
                    .then(thorny_user => {
                        thorny_user.send_connect_event('connect')
                        api.Relay.event(`${spawn_event.player.name} has joined the server`, '', 'join')
                        utils.send_motd(spawn_event.player)

                        if (thorny_user.patron) {
                            spawn_event.player.nameTag = `§l§c${spawn_event.player.nameTag}`
                        }
                    });
            }
            catch (e) {
                console.error(e);
            }
        }
    })

    // Handle Player Leave Event
    world.afterEvents.playerLeave.subscribe((leave_event) => {
        const thorny_user = api.ThornyUser.fetch_user(leave_event.playerName)
        if (thorny_user) { api.QuestWithProgress.clear_cache(thorny_user) }
        thorny_user?.send_connect_event('disconnect')
        api.Relay.event(`${leave_event.playerName} has left the server`, '', 'leave')
    })

}