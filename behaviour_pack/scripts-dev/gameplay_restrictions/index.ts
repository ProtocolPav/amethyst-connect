import { load_elytra_mending_checker } from "./elytra_no_mending";
import { load_world_border } from "./border";

export function load_gameplay_restrictions() {
    load_elytra_mending_checker()
    load_world_border()
}