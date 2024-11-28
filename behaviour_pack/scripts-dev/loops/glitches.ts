import {system, world, TicksPerSecond, PlayerSoundOptions, EntityComponentTypes} from "@minecraft/server";
import {MinecraftBlockTypes, MinecraftEntityTypes} from "@minecraft/vanilla-data";

function noise_glitch() {
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

    const all_players = world.getAllPlayers()

    for (const player of all_players) {
        const noise = noises[Math.floor(Math.random() * noises.length)]

        for (const noise_instance of noise) {
            system.waitTicks(5).then(
                () => player.playSound(noise_instance.name, noise_instance.options))
        }
    }
}

function vision_entity_glitch() {
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

    const all_players = world.getAllPlayers()

    for (const player of all_players) {
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
}

function vision_block_glitch() {
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
    const all_players = world.getAllPlayers()
    
    for (const player of all_players) {
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
}

function do_glitch() {
    const random = Math.random()
    const glitches_type = [
        "noise",
        "vision_entity",
        "vision_block",
        // "facing",
        // "effect"
    ]

    if (random <= 1) {
        const glitch = glitches_type[Math.floor(Math.random() * glitches_type.length)]
        console.log(`[Loops] Doing Glitches: ${glitch}`)
        switch (glitch) {
            case "noise":
                noise_glitch()
                break;

            case "vision_entity":
                vision_entity_glitch()
                break;

            case "vision_block":
                vision_block_glitch()
                break;

            case "facing":
                break;

            case "effect":
                break;
        }

        const all_players = world.getAllPlayers()
        for (const player of all_players) {
            player.sendMessage('§oWhat was that?')
            const facing = player.getViewDirection()
            player.sendMessage(`${facing.x}, ${facing.y}, ${facing.z}`)
        }
    }
}

export default function load_glitch_loop() {
    system.runInterval(() => {do_glitch()}, TicksPerSecond * 60 * 30)
    console.log('[Loops] Loaded Glitches Loop')
}