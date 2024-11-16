import { world, system } from "@minecraft/server";
import { ThornyUser, Relay } from "../api";

export function load_chat_handler() {

    // Relay in-game chat and decorate chat
    world.beforeEvents.chatSend.subscribe((chat_event) => {
        const gamertag = chat_event.sender.name
        const thorny_user = ThornyUser.fetch_user(gamertag)

        world.sendMessage({
            rawtext: [
                {
                    text: `§l§8[§r${thorny_user?.get_role_display()}§l§8]§r §7${gamertag}:§r ${chat_event.message}`,
                },
            ],
        });

        chat_event.cancel = true;

        system.run(() => { Relay.message(gamertag, chat_event.message) });
    });

}