import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';
import { world, system, Player } from '@minecraft/server';


function relay_message(nametag: string, content: string) {
    const request = new HttpRequest(`http://thorny-wbs:8000/chat/message`,);
    request.method = HttpRequestMethod.Post;
    request.body = JSON.stringify({
        'content': content,
        'name': nametag
    });
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);
}


function choose_colour(colour: string) {
    switch (colour) {
        case 'green':
            return 3596384
        case 'red':
            return 14693967
        case 'yellow':
            return 14734646
    }
}


function relay_event(content: string, colour: 'red' | 'green' | 'yellow') {
    const request = new HttpRequest(`http://thorny-wbs:8000/chat/event`,);
    request.method = HttpRequestMethod.Post;
    request.body = JSON.stringify({
        'content': content,
        'colour': choose_colour(colour)
    });
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);
}


export function load() {
    
    console.log('[Plugin] [ChatLink] Loading Chat Link Plugin...')
    
    // Relay in-game chat and decorate chat
    world.beforeEvents.chatSend.subscribe((data) => {
        const gamertag = data.sender.nameTag
        
        // Role should be gotten from NexusCore. Right now
        // this is not implemented, but it should be in future
        const role = "§bDweller"
        
        world.sendMessage({
            rawtext: [
                {
                    text: `§l§8[§r${role}§l§8]§r §7${gamertag}:§r ${data.message}`,
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
            system.run(() => { relay_event(`${dead_player.name} died by ${player.name}'s wrath`, 'yellow') })
        }
        
        // Case when an entity kills a player
        else if (deadEntity instanceof Player && damageSource.damagingEntity) {
            const player = deadEntity

            system.run(() => { relay_event(`${player.name} died`, 'yellow') })
        }
        
        // Case when player suicides
        else if (deadEntity instanceof Player && !damageSource.damagingEntity) {
            const player = deadEntity

            system.run(() => { relay_event(`${player.name}'s master plan ended in failure...`, 'yellow') })
        }
    })
    
    // Relay Player Joins
    world.afterEvents.playerSpawn.subscribe(({ initialSpawn: first_spawn, player: player }) => {
        if (first_spawn) {
            system.run(() => { relay_event(`${player.name} has joined the server`, 'green') })
        }
    })
    
    // Relay Player Leaves
    world.afterEvents.playerLeave.subscribe(({ playerName: player_name }) => {
        system.run(() => { relay_event(`${player_name} has left the server`, 'red') })
    })
    
    console.log('[Plugin] [ChatLink] Successfully loaded!')
}