import {EntityComponentTypes, ItemStack, Player, PlayerSoundOptions, system, TicksPerSecond, world} from '@minecraft/server';
import {MinecraftBlockTypes, MinecraftEffectTypes, MinecraftEntityTypes} from "@minecraft/vanilla-data";


function send_message(dimension: string, target: string, message: string) {
    const msg = {'rawtext': [{'text': message}]}
    if (!target.startsWith('@')) {
        target = `"${target}"`;
    }
    world.getDimension(dimension).runCommand(`tellraw ${target} ${JSON.stringify(msg)}`)
}

function play_quest_progress_sound(gamertag: string) {
    let player = world.getPlayers({name: gamertag})[0]

    player.playSound(
        'quest.objective.progress',
        {volume: 100, location: player.location}
    )
}

function play_quest_complete_sound(gamertag: string) {
    let player = world.getPlayers({name: gamertag})[0]

    player.playSound(
        'quest.complete',
        {volume: 100, location: player.location}
    )

    for (let i = 0; i < 5; i++) {
        system.runTimeout(() => {player.runCommand(`particle minecraft:totem_particle ~ ~2 ~`)}, 10)
    }
}

function play_objective_complete_sound(gamertag: string) {
    let player = world.getPlayers({name: gamertag})[0]

    player.playSound(
        'quest.objective.complete',
        {volume: 100, location: player.location}
    )
}

function play_quest_fail_sound(gamertag: string) {
    let player = world.getPlayers({name: gamertag})[0]

    player.playSound(
        'quest.fail',
        {volume: 100, location: player.location}
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

function noise_glitch(player: Player) {
    const noises: {name: string, options: PlayerSoundOptions}[][] = [
        [{"name": "mob.villager.yes", "options": { "volume": 100, "pitch": 1}}],
        [
            {"name": "block.bell.hit", "options": { "volume": 100, "pitch": 0.3}},
            {"name": "block.bell.hit", "options": { "volume": 100, "pitch": 0.5}},
            {"name": "block.bell.hit", "options": { "volume": 100, "pitch": 0.8}},
            {"name": "block.bell.hit", "options": { "volume": 100, "pitch": 0.4}},
        ],
        [{"name": "random.fuse", "options": { "volume": 100, "pitch": 1}}],
        [{"name": "mob.llama.idle", "options": { "volume": 100, "pitch": 1}}],
        [{"name": "random.anvil_land", "options": { "volume": 100, "pitch": 1}}],
        [{"name": "block.end_portal.spawn", "options": { "volume": 100, "pitch": 1}}],
        [
            {"name": "mob.shulker.ambient", "options": { "volume": 100, "pitch": 0.75}},
            {"name": "mob.shulker.ambient", "options": { "volume": 100, "pitch": 1.25}}
        ],
        [{"name": "mob.cat.meow", "options": { "volume": 100, "pitch": 1}}],
    ]

    const noise = noises[Math.floor(Math.random() * noises.length)]

    for (const noise_instance of noise) {
        system.runTimeout(
            () => {player.playSound(noise_instance.name, noise_instance.options)},
            5)
    }
}

function vision_entity_glitch(player: Player) {
    const entities = [
        MinecraftEntityTypes.Enderman,
        MinecraftEntityTypes.Panda,
        MinecraftEntityTypes.Rabbit,
        MinecraftEntityTypes.ZombieHorse,
        MinecraftEntityTypes.Breeze,
        MinecraftEntityTypes.Camel,
        MinecraftEntityTypes.Sheep,
        MinecraftEntityTypes.Stray
    ]

    const entity = entities[Math.floor(Math.random() * entities.length)]

    let location = player.location
    let facing = player.getViewDirection()

    location.x -= facing.x * 2
    location.z -= facing.z * 2

    let current_entity = player.dimension.spawnEntity(entity, location)

    let sysid = system.runInterval(() => {
        if (current_entity.isValid()) {
            current_entity.teleport(location);
            current_entity.getComponent(EntityComponentTypes.Health)?.resetToMaxValue()
        } else {
            system.clearRun(sysid)
            current_entity.remove();
        }
    })

    system.waitTicks(TicksPerSecond*15).then(() => {
        system.clearRun(sysid)
        current_entity.remove();
    })
}

function vision_block_glitch(player: Player) {
    const blocks = [
        MinecraftBlockTypes.Bedrock,
        MinecraftBlockTypes.LightBlock15,
        MinecraftBlockTypes.BambooStairs,
        MinecraftBlockTypes.Dispenser,
        MinecraftBlockTypes.DarkOakFence,
        MinecraftBlockTypes.EnchantingTable,
        MinecraftBlockTypes.Campfire
    ]

    const block = blocks[Math.floor(Math.random() * blocks.length)]

    let location = player.location
    let facing = player.getViewDirection()

    location.x += facing.x * 2
    location.z += facing.z * 2

    let random_block = player.dimension.getBlock(location)

    if (random_block?.typeId === MinecraftBlockTypes.Air
        && player.dimension.getEntitiesAtBlockLocation(location).length === 0) {
        random_block.setType(block)

        system.waitTicks(TicksPerSecond).then(() => {random_block.setType(MinecraftBlockTypes.Air)})
    }
}

function effect_glitch(player: Player) {
    const effects: MinecraftEffectTypes[] = [
        MinecraftEffectTypes.Haste,
        MinecraftEffectTypes.MiningFatigue,
        MinecraftEffectTypes.SlowFalling,
        MinecraftEffectTypes.JumpBoost,
        MinecraftEffectTypes.HealthBoost,
        MinecraftEffectTypes.Hunger
    ]

    const effect = effects[Math.floor(Math.random() * effects.length)]


    system.run(
        () => {player.addEffect(effect, TicksPerSecond*20)}
    )
}

const commands = {
    send_message,
    play_quest_complete_sound,
    play_quest_progress_sound,
    send_title,
    play_objective_complete_sound,
    play_quest_fail_sound,
    give_item,
    noise_glitch,
    vision_block_glitch,
    vision_entity_glitch,
    effect_glitch
}

export default commands