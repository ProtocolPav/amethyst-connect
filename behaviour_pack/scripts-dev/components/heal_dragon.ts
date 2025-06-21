import {
    BlockComponentTickEvent,
    system,
    EntityComponentTypes
} from "@minecraft/server";
import {MinecraftEntityTypes} from "@minecraft/vanilla-data";


export default function load_heal_dragon_component() {
    function heal_dragon(event : BlockComponentTickEvent) {
        if (event.block.isValid) {
            const dragon = event.block.dimension.getEntities({type: MinecraftEntityTypes.EnderDragon})[0]

            dragon.getComponent(EntityComponentTypes.Health)?.resetToMaxValue()
        }
    }

    system.beforeEvents.startup.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent('amethyst:heal_dragon',
            {
                onTick(event) {
                    heal_dragon(event)
                }
            }
        )
    })
}