import { system } from "@minecraft/server"

export default function load_script_event_handler() {

    system.afterEvents.scriptEventReceive.subscribe((script_event) => {
        // Send interaction to quest queue
        // and log interaction to NexusCore
    })

}