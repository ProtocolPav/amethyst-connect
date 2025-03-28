import {system, world, TicksPerSecond, PlayerSoundOptions, EntityComponentTypes, Player} from "@minecraft/server";
import utils from "../utils";

function do_glitch() {
    const random = Math.random()
    const glitches_type = [
        utils.commands.vision_block_glitch,
        utils.commands.vision_entity_glitch,
        utils.commands.noise_glitch,
        utils.commands.effect_glitch
    ]

    if (random <= 0.2) {
        const glitch = glitches_type[Math.floor(Math.random() * glitches_type.length)]
        console.log(`[Loops] Doing Glitches: ${glitch}`)
        for (const player of world.getAllPlayers()) {
            glitch(player)
            player.sendMessage('§oWhat was that?')
        }
    }
}

export default function load_glitch_loop() {
    system.runInterval(() => {do_glitch()}, TicksPerSecond * 60 * 30)
    console.log('[Loops] Loaded Glitches Loop')
}