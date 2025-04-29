import load_fungus_spreading_component from "./fungus_spread";
import load_glitch_component from "./glitch";
import load_altar_component from "./sacrifice";
import load_whoop_component from "./whoop";

export default function load_custom_components(guild_id: string) {
    load_fungus_spreading_component()
    load_glitch_component()
    load_whoop_component()
    load_altar_component(guild_id)
}