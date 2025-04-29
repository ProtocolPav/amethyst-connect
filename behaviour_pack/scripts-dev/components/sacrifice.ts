import {
    BlockComponentRandomTickEvent,
    BlockComponentPlayerInteractEvent,
    system,
    EntityComponentTypes,
    EquipmentSlot,
    TicksPerSecond,
    ItemComponentTypes,
    world
} from "@minecraft/server";
import utils from "../utils";
import api from "../api";


export default function load_altar_component(guild_id: string) {
    const sacrificeTimers: Map<string, number> = new Map();

    async function sacrifice(event: BlockComponentPlayerInteractEvent) {
        if (event.player) {
            const playerName = event.player.name;
            const mainhand = event.player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand);

            if (mainhand) {
                try {
                    const sacrificial_item = await api.Item.get_item(mainhand.typeId)
                    const border = await api.World.get_world(guild_id)
                    sacrificial_item.current_uses += 1
                    let modifier = 0

                    // Enchantment Modifier
                    let enchantment_levels = 0
                    let enchantments = 0
                    mainhand.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().forEach(enchantment => {
                        enchantment_levels += enchantment.level
                        enchantments += 1
                    })

                    modifier += enchantment_levels * enchantments * 0.3 + (mainhand.nameTag ? 0.1 : 0)

                    // Damage Modifier
                    const durability = mainhand.getComponent(ItemComponentTypes.Durability)
                    if (durability) {
                        modifier -= durability.damage / durability.maxDurability
                    }

                    // Compute New Block Value
                    let block_value = sacrificial_item.value * (1 + modifier)

                    // Depreciate Block Value
                    const log = Math.exp(-sacrificial_item.depreciation * 0.5 * Math.log(sacrificial_item.current_uses))
                    const weight = sacrificial_item.current_uses / sacrificial_item.max_uses
                    const linear = 1 - weight

                    block_value = block_value * ((1 - weight) * log + weight * linear)

                    // Update APIs
                    await sacrificial_item.update_item()
                    border.end_border += block_value
                    await border.update_world()
                    // Call function to re-fetch border sizes into cache

                    mainhand.amount -= 1
                    if (mainhand.amount == 0) {
                        event.player.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Mainhand);
                    } else {
                        event.player.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Mainhand, mainhand);
                    }

                    utils.commands.send_message(event.dimension.id, playerName, `This item is sacrificial. +${block_value} blocks`);
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