import {EntityComponentTypes, EquipmentSlot, system, world} from "@minecraft/server";
import api from "../api";

export default function load_chat_handler() {

    // Relay in-game chat and decorate chat
    world.beforeEvents.chatSend.subscribe((chat_event) => {
        const gamertag = chat_event.sender.name
        const thorny_user = api.ThornyUser.fetch_user(gamertag)

        if (chat_event.message.startsWith('!lore')) {
            const equippable = chat_event.sender.getComponent(EntityComponentTypes.Equippable)
            const mainhand = equippable?.getEquipment(EquipmentSlot.Mainhand)
            system.run(() => {
                switch (chat_event.message.split(' ')[1].toLowerCase()) {
                    case 'add':
                        if (mainhand) {
                            const lore = mainhand.getLore()
                            lore.push(chat_event.message.split(' ')[2])
                            mainhand.setLore(lore)
                            equippable?.setEquipment(EquipmentSlot.Mainhand, mainhand)
                        }
                        break;

                    case 'remove':
                        if (mainhand) {
                            mainhand.setLore([])
                            equippable?.setEquipment(EquipmentSlot.Mainhand, mainhand)
                        }
                        break;

                    default:
                        chat_event.sender.sendMessage('The command is !lore [add|remove] [your_lore]')
                }
            })
        }
        else {
            world.sendMessage({
                rawtext: [{text: `§l§8[§r${thorny_user?.get_role_display()}§l§8]§r §7${gamertag}:§r ${chat_event.message}`}],
            });

            system.run(() => { api.Relay.message(gamertag, chat_event.message) });
        }

        chat_event.cancel = true;
    });

}