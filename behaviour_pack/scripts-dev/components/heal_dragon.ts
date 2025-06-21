import {
    BlockComponentTickEvent,
    system,
    EntityComponentTypes, TicksPerSecond, BlockComponentPlayerBreakEvent
} from "@minecraft/server";
import {MinecraftEffectTypes, MinecraftEntityTypes} from "@minecraft/vanilla-data";
import utils from "../utils";


export default function load_heal_dragon_component() {
    function heal_dragon(event : BlockComponentTickEvent) {
        if (event.block.isValid) {
            const dragon = event.block.dimension.getEntities({type: MinecraftEntityTypes.EnderDragon})[0]

            if (dragon && dragon.isValid) {
                dragon.getComponent(EntityComponentTypes.Health)?.resetToMaxValue()
            }
        }
    }

    function heart_destroy(event : BlockComponentPlayerBreakEvent) {
        event.dimension.playSound('mob.enderdragon.growl', event.block.location)

        utils.commands.send_message(event.dimension.id, '@a', 'The Dragon has been weakened. Mine all Draconic Hearts.')

        event.dimension.spawnEntity(
            'amethyst:the_breath',
            event.block.location
        )
        event.dimension.spawnEntity(
            'amethyst:the_breath',
            event.block.location
        )
        event.dimension.spawnEntity(
            'amethyst:endstone_golem',
            event.block.location
        )
    }

    system.beforeEvents.startup.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent('amethyst:heal_dragon',
            {
                onTick(event) {
                    heal_dragon(event)
                },
                onPlayerBreak(event) {
                    heart_destroy(event)
                }
            }
        )
    })
}