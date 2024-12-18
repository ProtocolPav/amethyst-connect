import api from "../api";
import { system } from "@minecraft/server";

async function check_quests() {
    if (!api.Interaction.is_processing()) {
        api.Interaction.set_processing(true)
        let interaction = api.Interaction.dequeue()

        while (interaction) {
            let thorny_user = api.ThornyUser.fetch_user_by_id(interaction.thorny_id)
            let quest = await api.QuestWithProgress.get_active_quest(thorny_user)
            if (quest && await quest.increment_active_objective(interaction)) {
                await quest.update_user_quest()
                await thorny_user.update()

                if (quest.status == 'completed') {
                    api.Relay.event(
                        `${thorny_user.gamertag} has completed *${quest.title}!*`,
                        'Run `/quests view` to start it and reap the rewards!',
                        'other')

                    api.QuestWithProgress.clear_cache(thorny_user)
                }
            } else if (quest && quest.status == 'failed') {
                api.Relay.event(
                    `${thorny_user.gamertag} has failed *${quest.title}!*`,
                    'Better luck next time!',
                    'other')

                await quest.fail_quest(thorny_user.thorny_id)
                api.QuestWithProgress.clear_cache(thorny_user)
            }

            interaction = api.Interaction.dequeue()
        }

        api.Interaction.set_processing(false)
    }
}

export default function load_quest_loop() {
    system.runInterval(async () => {await check_quests()}, 1)
    console.log('[Loops] Loaded Quests Loop') 
}