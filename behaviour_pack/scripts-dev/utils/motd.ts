import { Player, world } from '@minecraft/server';
import { MinecraftDimensionTypes } from '@minecraft/vanilla-data';

export default function send_motd(player: Player) {
    const motd_short = 'Hope you have fun!'
    const motd = '§oHey... Do you even pay attention to these?'
    world.getDimension(MinecraftDimensionTypes.Overworld).runCommand(`title "${player.name}" actionbar §a§lWelcome to Everthorn!§r ${motd_short}`)

    player.sendMessage(`§aWelcome to Everthorn, §l${player.name}§r\n| ${motd_short}§r\n| ${motd}§r\n---------\n`)
}