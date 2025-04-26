import {
    BlockComponentRandomTickEvent,
    BlockComponentPlayerInteractEvent, system, EntityComponentTypes, EquipmentSlot, TicksPerSecond
} from "@minecraft/server";
import utils from "../utils";
import api from "../api";


export default function load_altar_component() {
    const sacrificeTimers: Map<string, number> = new Map();

    async function sacrifice(event: BlockComponentPlayerInteractEvent) {
        if (event.player) {
            const playerName = event.player.name;
            const mainhand = event.player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand);

            if (mainhand) {
                try {
                    const sacrificial_item = await api.Item.get_item(mainhand.typeId);
                    utils.commands.send_message(event.dimension.id, playerName, `This item is sacrificial. +${sacrificial_item.value} blocks`);
                    event.dimension.playSound("random.pop", event.player.location, {volume: 0.5})

                    // Cancel any existing timeout
                    if (sacrificeTimers.has(playerName)) {
                        system.clearRun(sacrificeTimers.get(playerName)!);
                    }

                    const timeoutId = system.runTimeout(() => {
                        event.dimension.playSound("altar.sacrifice", event.block.center(), { volume: 8 });
                        ambient(event);
                        sacrificeTimers.delete(playerName); // Clean up after playing sound
                    }, TicksPerSecond*0.5);

                    sacrificeTimers.set(playerName, timeoutId);
                } catch (e) {
                    utils.commands.send_message(event.dimension.id, playerName, 'This item is not sacrificial.');
                    return;
                }
            }
        }
    }

    function ambient(event : BlockComponentRandomTickEvent) {
        if (event.block.isValid) {
            const location = event.block.center();
            event.dimension.playSound("altar.ambient", location, {volume: 3})
        }
    }

    system.beforeEvents.startup.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent('amethyst:sacrifice',
            {
                onRandomTick(event) {
                    ambient(event)
                },
                onPlayerInteract(event) {
                    sacrifice(event).then()
                }
            }
        )
    })
}