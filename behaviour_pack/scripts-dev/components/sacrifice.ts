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

type playerName = string;
type timeoutID = number;

export default function load_altar_component(guild_id: string) {
    const sacrificeTimers: Map<playerName, timeoutID> = new Map();
    const sacrificeTotals: Map<playerName, {val: number, orig: number}> = new Map();

    const banned_gamertags = [
        'MarsOfSoa',
        'lumilime',
        'bellissensei',
        'Gamingwarrior65',
        'Eziofilm65',
        // 'ProtocolPav',
    ]

    async function sacrifice(event: BlockComponentPlayerInteractEvent) {
        if (event.player) {
            const playerName = event.player.name;
            const mainhand = event.player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand);

            const border = await api.World.get_world(guild_id)

            if (mainhand && !banned_gamertags.includes(playerName)) {
                if (mainhand.amount == 1) {
                    event.player.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Mainhand);
                } else {
                    mainhand.amount -= 1
                    event.player.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Mainhand, mainhand);
                }

                try {
                    const sacrificial_item = await api.Item.get_item(mainhand.typeId)
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
                    const original_block_value = sacrificial_item.value * (1 + modifier)

                    // Depreciate Block Value
                    const log = Math.exp(-sacrificial_item.depreciation * 0.5 * Math.log(sacrificial_item.current_uses))
                    const weight = sacrificial_item.current_uses / sacrificial_item.max_uses
                    const linear = 1 - weight

                    const block_value = original_block_value * ((1 - weight) * log + weight * linear)

                    // Update APIs
                    sacrificial_item.current_uses += 1
                    await sacrificial_item.update_item()
                    border.end_border += block_value
                    await border.update_world()
                    // Call function to re-fetch border sizes into cache

                    const total_value = sacrificeTotals.get(playerName)?.val
                    const total_original_value = sacrificeTotals.get(playerName)?.orig

                    if (total_value && total_original_value) {
                        sacrificeTotals.set(playerName, {val: block_value + total_value, orig: original_block_value + total_original_value})
                    } else {
                        sacrificeTotals.set(playerName, {val: block_value, orig: original_block_value})
                    }
                    event.dimension.playSound("random.pop", event.player.location, {volume: 0.5})

                    // Cancel any existing timeout
                    if (sacrificeTimers.has(playerName)) {
                        system.clearRun(sacrificeTimers.get(playerName)!);
                    }

                    const timeoutId = system.runTimeout(() => {
                        ambient(event);
                        event.dimension.playSound("altar.sacrifice", event.block.center(), { volume: 8 });

                        const total_value = Math.round(sacrificeTotals.get(playerName)?.val!)
                        const total_original = Math.round(sacrificeTotals.get(playerName)?.orig!)
                        const message = utils.AltarMessage.random_sacrifice(total_value, total_original)
                        utils.commands.send_message(
                            event.dimension.id,
                            playerName,
                            `[§l§aAltar§r] ${message}`
                        );

                        const valueRemaining = total_value / total_original

                        if (valueRemaining < 0.3) {
                            // Do an evil act to punish the player
                        }

                        sacrificeTimers.delete(playerName) // Clean up timers
                        sacrificeTotals.delete(playerName)
                    }, TicksPerSecond*0.5);

                    sacrificeTimers.set(playerName, timeoutId);
                } catch (e) {
                    ambient(event);

                    const spawned_item = mainhand.clone()
                    spawned_item.amount = 1

                    const spawned_location = event.block.center()
                    spawned_location.y += 0.7

                    event.dimension.spawnItem(spawned_item, spawned_location)

                    const message = utils.AltarMessage.random_not_sacrificial()
                    utils.commands.send_message(
                        event.dimension.id,
                        playerName,
                        `[§l§aAltar§r] ${message}`
                    )
                }
            }
            else {
                ambient(event);

                const message = utils.AltarMessage.random_info(Math.round(border.end_border))
                utils.commands.send_message(
                    event.dimension.id,
                    playerName,
                    `[§l§aAltar§r] ${message}`
                )
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