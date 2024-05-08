import { world, EntityDamageCause } from '@minecraft/server';
// List that holds all the players that are 100 blocks away from the border.
// Used primarily to send a single message at 100 blocks out
var playerlist = [];
// List that holds all players outside the border. Used to log console messages only once and not repeat.
var borderplayerlist = [];
export function worldBorderCheck(player) {
    const position = player.location;
    const distance_2d = Math.sqrt(position.x ** 2 + position.z ** 2);
    const border_size = 2050;
    if (border_size < distance_2d && borderplayerlist.indexOf(player.name) == -1) {
        borderplayerlist.push(player.name);
        console.log(`[WorldBorder] Player ${player.name} is outside of the border.`);
    }
    else if (border_size > distance_2d && borderplayerlist.indexOf(player.name) != -1) {
        borderplayerlist.splice(borderplayerlist.indexOf(player.name), 1);
        console.log(`[WorldBorder] Player ${player.name} has re-entered the world border.`);
    }
    ;
    if (border_size < distance_2d) {
        world.getDimension("overworld").runCommand(`title "${player.name}" actionbar §o§iI shouldn't go any further. It's too dangerous here.`);
        world.getDimension("overworld").runCommand(`effect "${player.name}" blindness 4 2`);
        player.applyDamage(1.3, { cause: EntityDamageCause.void });
    }
    else if (border_size - 20 < distance_2d) {
        world.getDimension("overworld").runCommand(`title "${player.name}" actionbar §o§iThe Monolith's protection is wearing off. I can feel it...`);
    }
    ;
    if (border_size - 100 < distance_2d && playerlist.indexOf(player.name) == -1) {
        playerlist.push(player.name);
        world.getDimension("overworld").runCommand(`title "${player.name}" actionbar §o§iMaybe I should start heading back now...`);
    }
    else if (border_size - 100 > distance_2d && playerlist.indexOf(player.name) != -1) {
        playerlist.splice(playerlist.indexOf(player.name), 1);
    }
    ;
}
