import load_elytra_mending_checker from "./elytra_no_mending";
import load_world_border from "./border";
import load_quest_loop from "./quests";
import load_glitch_loop from "./glitches";

export default function load_loops() {
    load_elytra_mending_checker()
    load_world_border()
    load_quest_loop()
    load_glitch_loop()
}