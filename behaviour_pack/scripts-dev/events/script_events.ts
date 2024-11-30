import { system } from "@minecraft/server"
import api from "../api";
import {MinecraftDimensionTypes} from "@minecraft/vanilla-data";

export default function load_script_event_handler() {

    system.afterEvents.scriptEventReceive.subscribe((script_event) => {
        const thorny_user = api.ThornyUser.fetch_user(script_event.message)

        if (thorny_user) {
            const interaction = new api.Interaction(
                {
                    thorny_id: thorny_user.thorny_id,
                    type: 'scriptevent',
                    position_x: 0,
                    position_y: 0,
                    position_z: 0,
                    reference: script_event.id,
                    mainhand: null,
                    dimension: MinecraftDimensionTypes.Overworld,
                }
            )

            api.Interaction.enqueue(interaction)
            interaction.post_interaction().then()
        }
    })

}