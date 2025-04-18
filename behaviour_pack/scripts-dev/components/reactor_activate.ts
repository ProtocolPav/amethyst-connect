import {
    BlockComponentPlayerInteractEvent,
    BlockPermutation,
    EntityComponentTypes,
    EquipmentSlot,
    system
} from "@minecraft/server";

export default function load_reactor_activate_component() {
    function on_interact(event: BlockComponentPlayerInteractEvent) {
        const mainhand = event.player?.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
        if (mainhand?.typeId == 'amethyst:glitch_core') {
            // @ts-ignore
            const active: boolean = event.block.permutation.getState('amethyst:reactor_active_state')

            if (event.block.isValid && !active) {
                event.block.setPermutation(BlockPermutation.resolve('amethyst:reactor', {'amethyst:reactor_active_state': true}))
                event.player?.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Mainhand)
                event.dimension.playSound('beacon.activate', event.block.center())
            }
        }
    }

    system.beforeEvents.startup.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent('amethyst:reactor_activate',
            {
                onPlayerInteract(event) {
                    on_interact(event)
                }
            }
        )
    })
}