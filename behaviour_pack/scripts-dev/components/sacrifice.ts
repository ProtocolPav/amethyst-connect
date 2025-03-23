import {
    BlockComponentRandomTickEvent,
    Player,
    world,
    BlockComponentPlayerInteractEvent, MolangVariableMap
} from "@minecraft/server";
import utils from "../utils";

const molang = new MolangVariableMap();
molang.setColorRGB("variable.color", { red: 0, green: 0.619, blue: 0.376 });


export default function load_altar_component() {
    function sacrifice(event : BlockComponentPlayerInteractEvent) {
        if (Math.random() < 0.7 && event.player) {
            utils.commands.send_message(event.dimension.id, event.player?.name, 'You have Sacrificed')
            world.playSound("altar.sacrifice", event.block.location, {volume: 100})
        }
    }

    function particles(event : BlockComponentRandomTickEvent) {
        if (event.block.isValid()) {
            const location = event.block.location;
            const radius = 3;

            let random_location = {
                x: location.x + (Math.floor(Math.random() * radius) * (Math.random() < 0.5 ? -1 : 1)),
                y: location.y + Math.floor(Math.random() * 4),
                z: location.z + (Math.floor(Math.random() * radius) * (Math.random() < 0.5 ? -1 : 1))
            };

            if (event.block.dimension.getBlock(random_location)) {
                event.dimension.spawnParticle("minecraft:colored_flame_particle", random_location, molang)
                world.playSound("altar.ambient", event.block.location, {volume: 100})
            }
        }
    }

    world.beforeEvents.worldInitialize.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent('amethyst:sacrifice',
            {
                onRandomTick(event) {
                    particles(event)
                },
                onPlayerInteract(event) {
                    sacrifice(event)
                }
            }
        )
    })
}