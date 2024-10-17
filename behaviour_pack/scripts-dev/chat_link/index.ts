import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';
import { world, system, Player } from '@minecraft/server';


function relay_message(nametag: string, content: string) {
    const request = new HttpRequest('http://nexuscore:8000/api/v0.1/events/relay');
    request.method = HttpRequestMethod.Post;
    request.body = JSON.stringify({
        'type': 'message',
        'content': content,
        'embed_title': '',
        'embed_content': '',
        'name': nametag
      });
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);
}


function relay_event(content: string, event_type: string) {
    const request = new HttpRequest('http://nexuscore:8000/api/v0.1/events/relay');
    request.method = HttpRequestMethod.Post;
    request.body = JSON.stringify({
        'type': event_type,
        'content': '',
        'embed_title': content,
        'embed_content': '',
        'name': 'Server'
      });
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);
}


export function load(guild_id: string, webhook_url: string) {
    
    console.log('[Plugin] [ChatLink] Loading Chat Link Plugin...')

    var user_role_map = {}

    world.afterEvents.playerJoin.subscribe(({ playerName }) => {
        http.get(`http://nexuscore:8000/api/v0.1/users/guild/${guild_id}/${playerName.replace(" ", "%20")}`)
        .then(response => {
            var role = JSON.parse(response.body)["role"]
            
            if (JSON.parse(response.body)["patron"] == true) {
                role = 'Patron'
            }
            
            if (JSON.parse(response.body)["role"] == "Community Manager") {
                role = 'CM'
            }

            var colour = '§b'

            switch (role) {
                case 'Patron':
                    colour = '§c'
                    break;
                case 'Owner':
                    colour = '§a'
                    break;
                case 'CM':
                    colour = '§e'
                    break;
            }

            user_role_map[playerName] = colour + role
        })
    })
    
    // Relay in-game chat and decorate chat
    world.beforeEvents.chatSend.subscribe((data) => {
        const gamertag = data.sender.name

        world.sendMessage({
            rawtext: [
                {
                    text: `§l§8[§r${user_role_map[gamertag]}§l§8]§r §7${gamertag}:§r ${data.message}`,
                },
            ],
        });

        data.cancel = true;

        system.run(() => { relay_message(data.sender.nameTag, data.message) });
    });
    
    // Relay Player deaths
    world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
        // Case when the player kills player
        if (damageSource.damagingEntity instanceof Player && deadEntity instanceof Player) {
            const player = damageSource.damagingEntity
            const dead_player = deadEntity
            system.run(() => { relay_event(`${dead_player.name} died by ${player.name}'s wrath`, 'other') })
        }
        
        // Case when an entity kills a player
        else if (deadEntity instanceof Player && damageSource.damagingEntity) {
            const player = deadEntity

            system.run(() => { relay_event(`${player.name} died`, 'other') })
        }
        
        // Case when player suicides
        else if (deadEntity instanceof Player && !damageSource.damagingEntity) {
            const player = deadEntity

            system.run(() => { relay_event(`${player.name}'s master plan ended in failure...`, 'other') })
        }
    })
    
    // Relay Player Joins
    world.afterEvents.playerSpawn.subscribe(({ initialSpawn: first_spawn, player: player }) => {
        if (first_spawn) {
            system.run(() => { relay_event(`${player.name} has joined the server`, 'join') })
        }
    })
    
    // Relay Player Leaves
    world.afterEvents.playerLeave.subscribe(({ playerName: player_name }) => {
        system.run(() => { relay_event(`${player_name} has left the server`, 'leave') })
    })
    
    console.log('[Plugin] [ChatLink] Successfully loaded!')
}