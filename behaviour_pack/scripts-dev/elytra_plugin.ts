import { EquipmentSlot, ItemStack, Player, world, system, EntityDamageCause, EntityComponentTypes, EnchantmentTypes } from '@minecraft/server';
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';


export function elytraCheck(player: Player) {
    const equipmentCompPlayer = player.getComponent(EntityComponentTypes.Equippable);

    if (equipmentCompPlayer.getEquipment(EquipmentSlot.Chest)) {
        const item = equipmentCompPlayer.getEquipment(EquipmentSlot.Chest).clone();
        const enchantments = item.getComponent("minecraft:enchantable");
        const hasMending = enchantments.hasEnchantment("mending");

        if (hasMending && item.typeId == 'minecraft:elytra') {
            if (!enchantments.hasEnchantment("vanishing")) {
                enchantments.addEnchantment({ type: EnchantmentTypes.get('vanishing'), level: 1 });
            }
            enchantments.removeEnchantment("mending");

            item.getComponent("minecraft:durability").damage = item.getComponent("minecraft:durability").maxDurability

            item.setLore([`\n§o"My wings are cursed!"`])

            world.getDimension("overworld").runCommand(`title "${player.name}" actionbar §o§iMy Elytra feels different...`)

            equipmentCompPlayer.setEquipment(EquipmentSlot.Chest, item);

            console.log(`[ElytraCheck] Player ${player.name} has elytra with mending. Removing Mending.`);
        }
    }
}