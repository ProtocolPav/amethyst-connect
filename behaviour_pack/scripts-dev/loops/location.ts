import {EntityComponentTypes, EquipmentSlot, Player, system, world} from "@minecraft/server";
import {MinecraftItemTypes} from "@minecraft/vanilla-data";
import api from "../api";

function location_log(player: Player) {
    const head_gear = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Head)
    const check_list = ['minecraft:skeleton_skull', 'minecraft:wither_skeleton_skull', "minecraft:carved_pumpkin"]
    let hidden = false

    hidden = head_gear?.typeId ? check_list.includes(head_gear.typeId) : false

    const location = [Math.round(player.location.x), Math.round(player.location.y), Math.round(player.location.z)];

    return {'gamertag': player.name, 'location': location, 'hidden': hidden}
}

export default function load_location_logger() {
    system.runInterval(() => {
        let playerlist = world.getPlayers();
        let log: {gamertag: string, location: number[], hidden: boolean}[] = []

        playerlist.forEach((player) => {
            log.push(location_log(player))
        });

        api.Relay.location(log)
    }, 20)

    console.log('[Loops] Loaded Location Loop')
}