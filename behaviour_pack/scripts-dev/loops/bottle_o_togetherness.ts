import {system, world, Player, EffectType, ItemStack, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { MinecraftEffectTypes,MinecraftItemTypes} from '@minecraft/vanilla-data';


const Bottle = "amethyst:totem_of_togetherness";
const healthboost = MinecraftEffectTypes.HealthBoost;
const range = 16;

function nearbyplayercount(player: Player, range: number): number {
    const position = player.location;
    return Array.from(world.getPlayers()).filter((p) => {
        if (p === player) return false;
        const distance = Math.sqrt(
            Math.pow(p.location.x - position.x, 2) +
            Math.pow(p.location.y - position.y, 2) +
            Math.pow(p.location.z - position.z, 2)
        );
        return distance <= range;
    }).length;
}


world.beforeEvents.worldInitialize.subscribe(() => {
    world.getPlayers().forEach((player) => {
        const inventory = player.getComponent("inventory");
        if (!inventory) return;

        const hasBottle = inventory.container?.any((item) => item?.typeId === Bottle);
        if (hasBottle) {
            const nearbyPlayers = nearbyplayercount(player, range);
            const togethernesslevel = Math.min(nearbyPlayers + 1, 10); 
            player.addEffect(healthboost, 20, togethernesslevel, false); 
        } else {
            player.removeEffect(healthboost); 
        }
    });
});

export default function load_bottle_o_together() {
    system.runInterval(() => {
        let playerlist = world.getPlayers();
    
        playerlist.forEach((player) => {
            nearbyplayercount(player)
        });
    }, 20)

    console.log('[Loops] Loaded Bottle Of Togetheness Loop') 
}
