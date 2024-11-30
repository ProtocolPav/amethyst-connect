import { world, system } from '@minecraft/server';
import { EntityComponentTypes, ItemStack } from '@minecraft/server';


function send_message(dimension: string, target: string, message: string) {
    const msg = {'rawtext': [{'text': message}]}
    world.getDimension(dimension).runCommand(`tellraw "${target}" ${JSON.stringify(msg)}`)
}

async function play_quest_progress_sound(gamertag: string) {
    let player = world.getPlayers({name: gamertag})[0]

    player.playSound(
        'note.pling',
        {pitch: 1.5, volume: 100, location: player.location}
    )

    system.runTimeout(() => {
        player.playSound(
            'note.pling',
            {pitch: 2, volume: 100, location: player.location}
        )
    }, 2)
}

function play_quest_complete_sound(gamertag: string) {
    let player = world.getPlayers({name: gamertag})[0]

    player.playSound(
        'mace.heavy_smash_ground',
        {volume: 100, location: player.location}
    )
    player.playSound(
        'random.totem',
        {volume: 100, location: player.location}
    )
    player.playSound(
        'random.levelup',
        {volume: 100, pitch: 1.5, location: player.location}
    )

    for (let i = 0; i < 5; i++) {
        system.runTimeout(() => {player.runCommand(`particle minecraft:totem_particle ~ ~2 ~`)}, 10)
    }
}

function play_objective_complete_sound(gamertag: string) {
    let player = world.getPlayers({name: gamertag})[0]

    player.playSound(
        'random.levelup',
        {volume: 100, pitch: 0.8, location: player.location}
    )
}

function send_title(dimension: string, target: string, type: 'title' | 'actionbar', message: string) {
    world.getDimension(dimension).runCommand(`title "${target}" ${type} ${message}`)
}

function give_item(gamertag: string, item: string, amount: number) {
    world.getPlayers({name: gamertag})[0]
         .getComponent(EntityComponentTypes.Inventory)
         ?.container
         ?.addItem(
            new ItemStack(item, amount)
         )
}

const commands = {
    send_message,
    play_quest_complete_sound,
    play_quest_progress_sound,
    send_title,
    play_objective_complete_sound,
    give_item
}

export default commands