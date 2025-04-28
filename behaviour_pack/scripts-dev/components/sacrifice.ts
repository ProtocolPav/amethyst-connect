import {
    BlockComponentRandomTickEvent,
    BlockComponentPlayerInteractEvent, system, EntityComponentTypes, EquipmentSlot, TicksPerSecond, ItemComponentTypes
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
                    mainhand.amount -= 1
                    if (mainhand.amount <= 0) {
                        event.player.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Mainhand);
                    } else {
                        event.player.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Mainhand, mainhand);
                    }

                    let enchantments = 0
                    mainhand.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().forEach(enchantment => {
                        enchantments += enchantment.level
                    })

                    console.log(enchantments, mainhand.nameTag, mainhand.getComponent(ItemComponentTypes.Durability)?.damage)
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