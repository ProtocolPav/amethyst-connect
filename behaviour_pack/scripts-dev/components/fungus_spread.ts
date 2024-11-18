import { BlockComponentRandomTickEvent, world } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";


export default function load_fungus_spreading_component() {
    function fungus_spread(event : BlockComponentRandomTickEvent) {
        if (Math.random() < 0.5) {
            const adjacent_blocks = [event.block.above(), event.block.below(), event.block.south(), event.block.west(), event.block.north(), event.block.east()]

            const random_index = Math.floor(Math.random() * adjacent_blocks.length)
            const random_adjacent_block = adjacent_blocks[random_index]
    
            if (random_adjacent_block?.typeId == MinecraftBlockTypes.Air) {
                random_adjacent_block.setType("amethyst:fungus_block")
            }
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