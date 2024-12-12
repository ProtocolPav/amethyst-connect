import {EntityComponentTypes, EquipmentSlot, Player, system, world} from "@minecraft/server";
import {MinecraftEffectTypes} from '@minecraft/vanilla-data';


const healthboost = MinecraftEffectTypes.HealthBoost;


function togetherness(player: Player): void {
    const position = player.location;
    const equippable = player.getComponent(EntityComponentTypes.Equippable)
    const offhand = equippable?.getEquipment(EquipmentSlot.Offhand)
    const mainhand = equippable?.getEquipment(EquipmentSlot.Mainhand)

    if (offhand?.hasComponent("amethyst:togetherness") || mainhand?.hasComponent("amethyst:togetherness") ) {
        const uniqueplayerslist = player.dimension.getPlayers({location: position, maxDistance: 16 })
        player.addEffect(healthboost, 1, {amplifier: uniqueplayerslist.length, showParticles: false})
    }

    if (offhand?.typeId === 'amethyst:totem_of_togetherness' && offhand.getLore().length === 0) {
        offhand.setLore(['§r§qEverthorn Christmas 2024', '\n§r§9+1 per nearby player'])
        equippable?.setEquipment(EquipmentSlot.Offhand, offhand)
    } else if (mainhand?.typeId === 'amethyst:totem_of_togetherness' && mainhand.getLore().length === 0) {
        mainhand.setLore(['§r§qEverthorn Christmas 2024', '\n§r§9+1 per nearby player'])
        equippable?.setEquipment(EquipmentSlot.Mainhand, mainhand)
    }
}

export default function load_totem_o_togetherness() {
    system.runInterval(() => {
        let playerlist = world.getPlayers();
    
        playerlist.forEach((player) => {
            togetherness(player)
        });
    }, 1)

    console.log('[Loops] Loaded Bottle Of Togetheness Loop') 
}
