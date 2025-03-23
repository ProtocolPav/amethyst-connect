import {
    world,
    BlockComponentTickEvent,
    Dimension,
    Vector3,
    BlockEvent, BlockPermutation
} from "@minecraft/server";


export default function load_whoop_component() {
    function play_fart(dimension: Dimension, location: Vector3) {
        dimension.playSound('fart', location, {volume: 20, pitch: Math.max(0.45, Math.random() * 1.5)})
    }

    function on_interact(event : BlockEvent) {
        play_fart(event.dimension, event.block.location)
    }

    function on_redstone(event : BlockComponentTickEvent) {
        // @ts-ignore
        const powered = event.block.permutation.getState('amethyst:powered_bit')

        if (event.block.isValid() && event.block.getRedstonePower() && !powered) {
            event.block.setPermutation(BlockPermutation.resolve('amethyst:whoopee_cushion', {'amethyst:powered_bit': true}))
            play_fart(event.dimension, event.block.location)
        }
        else if (event.block.isValid() && !event.block.getRedstonePower() && powered) {
            event.block.setPermutation(BlockPermutation.resolve('amethyst:whoopee_cushion', {'amethyst:powered_bit': false}))
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