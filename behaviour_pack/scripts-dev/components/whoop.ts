import {
    world,
    BlockComponentTickEvent,
    Dimension,
    Vector3,
    BlockEvent
} from "@minecraft/server";


export default function load_whoop_component() {
    function play_fart(dimension: Dimension, location: Vector3) {
        dimension.playSound('fart', location, {volume: 100, pitch: Math.random() * 1.5})
    }

    function on_interact(event : BlockEvent) {
        play_fart(event.dimension, event.block.location)
    }

    function on_redstone(event : BlockComponentTickEvent) {
        if (event.block.isValid() && event.block.getRedstonePower()) {
            play_fart(event.dimension, event.block.location)
        }
    }

    world.beforeEvents.worldInitialize.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent('amethyst:whoop',
            {
                onTick(event) {
                    on_redstone(event)
                },
                onPlayerInteract(event) {
                    on_interact(event)
                },
                onStepOn(event) {
                    on_interact(event)
                },
                beforeOnPlayerPlace(event) {
                    on_interact(event)
                }
            }
        )
    })
}