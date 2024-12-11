import {BlockComponentRandomTickEvent, Player, world} from "@minecraft/server";
import utils from "../utils";


export default function load_glitch_component() {
    function glitch(event : BlockComponentRandomTickEvent) {
        const location = event.block.location;
        const radius = Math.floor(Math.random() * 10);

        let random_location = {
            x: location.x + Math.floor(Math.random() * radius),
            y: location.y + 3,
            z: location.z + Math.floor(Math.random() * radius)
        };

        event.dimension.spawnParticle("minecraft:eyeofender_death_explode_particle", random_location)
        if (Math.random() < 0.7) {
            const glitches_type = [
                utils.commands.noise_glitch,
                utils.commands.vision_block_glitch,
                utils.commands.vision_entity_glitch,
                utils.commands.effect_glitch
            ]

            const glitch = glitches_type[Math.floor(Math.random() * glitches_type.length)]

            event.block.dimension.getPlayers({location: event.block.location, maxDistance: radius})
                .forEach((player: Player) => {
                    glitch(player)
                })

        }
    }

    world.beforeEvents.worldInitialize.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent('amethyst:glitch',
            {
                onRandomTick(event) {
                    glitch(event)
                }
            }
        )
    })
}