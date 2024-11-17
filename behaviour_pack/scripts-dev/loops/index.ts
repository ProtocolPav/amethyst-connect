import load_elytra_mending_checker from "./elytra_no_mending";
import load_world_border from "./border";
import load_quest_loop from "./quests";

export default function load_loops() {
    load_elytra_mending_checker()
    load_world_border()
    load_quest_loop()
}