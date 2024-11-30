import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "@minecraft/server-net"
import { Objective, IQuest, IObjective, Reward, IReward } from "./quest"
import Quest from "./quest"
import Interaction from "./interaction"
import utils from "../utils"
import ThornyUser from "./user"
import { parse, format } from "date-fns"

interface IObjectiveWithProgress extends IObjective {
    start: string | null
    end: string | null
    completion: number
    status: 'in_progress' | 'completed' | 'failed'
}

interface IQuestWithProgress extends IQuest {
    accepted_on: string
    started_on: string | null
    status: 'in_progress' | 'completed' | 'failed'
}

class ObjectiveWithProgress extends Objective {
    thorny_user: ThornyUser
    start: Date | null
    end: Date | null
    completion: number
    status: 'in_progress' | 'completed' | 'failed'

    constructor(data: IObjectiveWithProgress, rewards: Reward[], thorny_user: ThornyUser) {
        super(data, rewards)
        this.thorny_user = thorny_user
        this.start = data.start ? parse(data.start, 'yyyy-MM-dd HH:mm:ss.SSSSSS', new Date()) : null
        this.end = data.end ? parse(data.end, 'yyyy-MM-dd HH:mm:ss.SSSSSS', new Date()) : null
        this.completion = data.completion
        this.status = data.status
    }

    private async complete_objective(interaction: Interaction, quest: QuestWithProgress) {
        const index = quest.objectives.indexOf(this)

        utils.commands.play_objective_complete_sound(this.thorny_user.gamertag)

        utils.commands.send_title(
            interaction.dimension, 
            this.thorny_user.gamertag, 
            'actionbar',
            `§l§a${quest.title} Progress:§r §7${index+1}§r/${quest.objectives.length}`
        )

        utils.commands.send_message(
            interaction.dimension,
            this.thorny_user.gamertag,
            quest.objectives[index+1].generate_objective_string(index+1, quest.objectives.length, quest.title)
        )
    }

    public async update_user_objective(quest: QuestWithProgress) {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/users/${this.thorny_user.thorny_id}/quest/${quest.quest_id}/${this.objective_id}`);
        request.method = HttpRequestMethod.Put;
        request.body = JSON.stringify({
            "start": this.start ? format(this.start, 'yyyy-MM-dd HH:mm:ss.SSSSSS') : null,
            "end": this.end ? format(this.end, 'yyyy-MM-dd HH:mm:ss.SSSSSS') : null,
            "completion": this.completion,
            "status": this.status
        })
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
    
        await http.request(request);
    }

    /**
     * @returns a Boolean representing if completion was incremented
     */
    public async increment_completion(interaction: Interaction, quest: QuestWithProgress): Promise<Boolean> {
        if (await this.check_requirements(interaction, this.start ?? new Date())) {
            this.completion++

            utils.commands.play_quest_progress_sound(this.thorny_user.gamertag)

            utils.commands.send_title(
                interaction.dimension, 
                this.thorny_user.gamertag,
                'actionbar',
                `§l§s${utils.clean_id(this.objective)}:§r §7${this.completion}§r/${this.objective_count}`
            )
            
            if (this.completion === this.objective_count) {
                this.status = 'completed'
                this.end = new Date()

                const index = quest.objectives.indexOf(this)

                if (index < quest.objectives.length) {
                    this.complete_objective(interaction, quest)
                }

                this.give_rewards(interaction, this.thorny_user)
            }
            else if (this.completion === 1) {
                this.start = new Date()
            }

            return true;
        }

        return false;
    }
}

export default class QuestWithProgress extends Quest {
    public static quest_cache: {[thorny_id: number]: QuestWithProgress} = {}

    thorny_user: ThornyUser
    accepted_on: Date
    started_on: Date | null
    status: 'in_progress' | 'completed' | 'failed'
    objectives: ObjectiveWithProgress[]

    constructor(data: IQuestWithProgress, objectives: ObjectiveWithProgress[], thorny_user: ThornyUser) {
        super(data, objectives)
        this.thorny_user = thorny_user
        this.accepted_on = parse(data.accepted_on, 'yyyy-MM-dd HH:mm:ss.SSSSSSS', new Date())
        this.started_on = data.started_on ? parse(data.started_on, 'yyyy-MM-dd HH:mm:ss.SSSSSS', new Date()) : null
        this.status = data.status
        
        this.objectives = objectives
    }

    public static clear_cache(thorny_user: ThornyUser) {
        delete this.quest_cache[thorny_user.thorny_id]
    }

    public static async get_active_quest(thorny_user: ThornyUser): Promise<QuestWithProgress | null> {

        if (this.quest_cache[thorny_user.thorny_id]) {
            return this.quest_cache[thorny_user.thorny_id]
        }

        try {
            const active_quest = await http.get(`http://nexuscore:8000/api/v0.1/users/${thorny_user.thorny_id}/quest/active`);

            if (active_quest.status === 200) {
                const active_quest_data = JSON.parse(active_quest.body)
                const quest_id = active_quest_data['quest_id']

                // Merge active quest data
                const quest_response = await http.get(`http://nexuscore:8000/api/v0.1/quests/${quest_id}`);
                const quest_data = {...JSON.parse(quest_response.body), ...active_quest_data} as IQuestWithProgress;
    
                // Fetch the objectives for the quest.
                const objectives_response = await http.get(`http://nexuscore:8000/api/v0.1/quests/${quest_id}/objectives`);
                const objectives_data = utils.combine(JSON.parse(objectives_response.body), active_quest_data['objectives'], 'objective_id') as IObjectiveWithProgress[];

                const objectives: ObjectiveWithProgress[] = []
    
                // For each objective, fetch its rewards.
                for (let objective of objectives_data) {
                    const rewards_response = await http.get(`http://nexuscore:8000/api/v0.1/quests/${quest_id}/objectives/${objective.objective_id}/rewards`);
                    const rewards_data = JSON.parse(rewards_response.body) as IReward[];
                    let rewards: Reward[] = []
                    
                    for (let reward of rewards_data) {
                        rewards.push(new Reward(reward))
                    }

                    objectives.push(new ObjectiveWithProgress(objective, rewards, thorny_user))
                }

                const quest_object = new QuestWithProgress(quest_data, objectives, thorny_user)
                this.quest_cache[thorny_user.thorny_id] = quest_object
                return quest_object
            } else {
                return null
            }
 
        } catch (error) {
            console.error("Error fetching quest:", error);
            throw error;
        }
    }

    private get_active_objective(): ObjectiveWithProgress | null {
        return this.objectives.find(objective => objective.status === 'in_progress') ?? null
    }

    public async update_user_quest() {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/users/${this.thorny_user.thorny_id}/quest/${this.quest_id}`);
        request.method = HttpRequestMethod.Put;
        request.body = JSON.stringify({
            "accepted_on": null,
            "started_on": this.started_on ? format(this.started_on, 'yyyy-MM-dd HH:mm:ss.SSSSSS') : null,
            "status": this.status == 'completed' ? this.status : null
        })
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
    
        await http.request(request);

        for (let objective of this.objectives) {
            await objective.update_user_objective(this)
        }
    }

    /**
     * @returns
     * A boolean representing if the objective has been incremented or not
     */
    public async increment_active_objective(interaction: Interaction): Promise<Boolean> {
        const active_objective = this.get_active_objective()

        if (active_objective) {
            if (active_objective.completion == 0 && this.objectives.indexOf(active_objective) == 0) {
                this.started_on = new Date()
            }

            const incremented = await active_objective.increment_completion(interaction, this)

            const next_objective = this.get_active_objective()

            if (!next_objective) {
                this.status = 'completed'
                this.end_time = new Date()

                utils.commands.play_quest_complete_sound(this.thorny_user.gamertag)

                utils.commands.send_title(
                    interaction.dimension,
                    this.thorny_user.gamertag,
                    'title',
                    `§l§eQ§du§se§as§tt §uC§io§mm§pp§9l§ee§nt§be!`
                )

                utils.commands.send_message(
                    interaction.dimension,
                    '@a',
                    `§a+=+=+=+=+=+=+ Quest Completed! +=+=+=+=+=+=+§r\n` +
                    `${this.thorny_user.gamertag} has just completed §l§n${this.title}§r!\n` +
                    `Run §5/quests view§r on Discord to start it!`
                )
            }

            return incremented;
        }
        
        return false;
    }
}