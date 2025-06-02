import DeathMessage from './death_messages'
import checks from './checks'
import send_motd from './motd'
import commands from './commands'
import AltarMessage from "./altar_messages";

function convert_seconds_to_hms(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

function combine(list1: { [key: string]: any }[], list2: { [key: string]: any }[], id: string) {
    let combined_list = []

    for (let item of list1) {
        combined_list.push({...item, ...list2.find(item2 => item2[id] === item[id])})
    }

    return combined_list
}

function clean_id(id: string) {
    return id.replace(/^[^:]+:/, "") // Remove the "XXXX:" prefix
        .replace(/_/g, " ")        // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}

const utils = {
    DeathMessage,
    AltarMessage,
    send_motd,
    checks,
    commands,
    convert_seconds_to_hms,
    clean_id,
    combine
}

export default utils