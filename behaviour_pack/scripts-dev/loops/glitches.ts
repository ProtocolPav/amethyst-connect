import {system, world, TicksPerSecond, PlayerSoundOptions, EntityComponentTypes, Player} from "@minecraft/server";
import utils from "../utils";

function do_glitch() {
    const random = Math.random()
    const glitches_type = [
        "noise",
        "vision_entity",
        "vision_block",
        // "facing",
        // "effect"
    ]

    if (random <= 0.2) {
        const glitch = glitches_type[Math.floor(Math.random() * glitches_type.length)]
        console.log(`[Loops] Doing Glitches: ${glitch}`)
        switch (glitch) {
            case "noise":
                for (const player of world.getAllPlayers()) {
                    utils.commands.noise_glitch(player)
                }
                break;

            case "vision_entity":
                for (const player of world.getAllPlayers()) {
                    utils.commands.vision_entity_glitch(player)
                }
                break;

            case "vision_block":
                for (const player of world.getAllPlayers()) {
                    utils.commands.vision_block_glitch(player)
                }
                break;

            case "facing":
                break;

            case "effect":
                break;
        }

        const all_players = world.getAllPlayers()
        for (const player of all_players) {
            player.sendMessage('§oWhat was that?')
            const facing = player.getViewDirection()
        }
    }
}

export default function load_glitch_loop() {
    system.runInterval(() => {do_glitch()}, TicksPerSecond * 60 * 30)
    console.log('[Loops] Loaded Glitches Loop')
}