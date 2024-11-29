import { BlockComponentRandomTickEvent, world } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import utils from "../utils";


export default function load_glitch_component() {
    function glitch(event : BlockComponentRandomTickEvent) {
        const location = event.block.location;
        const radius = Math.floor(Math.random() * 10);
        let random_location = {x: location.x + 20, y: location.y + 20, z: location.z + 20};

        while (!utils.checks.distance_check([location.x, location.z], [random_location.x, random_location.z], radius)) {
            let random_location = {
                x: location.x + Math.floor(Math.random() * radius),
                y: location.y + Math.floor(Math.random() * 3),
                z: location.z + Math.floor(Math.random() * radius)
            };
        }

        event.dimension.spawnParticle("minecraft:minecraft:eyeofender_death_explode_particle")
        if (Math.random() < 0.1) {

        }
    }

    world.beforeEvents.worldInitialize.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent('amethyst:fungus_spread',
            {
                onRandomTick(event) {
                    fungus_spread(event)
                }
            }
        )
    })
}