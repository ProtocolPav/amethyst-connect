import { http } from "@minecraft/server-net"
import { parse } from "date-fns"
import utils from "../utils"
import ThornyUser from "./user"
import Interaction from "./interaction"

export interface IItem {
    item_id: string
    value: number
    max_uses: number
    depreciation: number
    current_uses: number
}

export interface IObjective {
    objective_id: number
    objective: string
    order: number
    description: string
    display: string | null
    objective_count: number
    objective_type: 'kill' | 'mine' | 'encounter'
    natural_block: boolean
    objective_timer: number | null
    required_mainhand: string | null
    required_location: [number, number] | null
    location_radius: number
}

export interface IQuest {
    quest_id: number
    start_time: string
    end_time: string
    title: string
    description: string
}

interface RequirementCheck {
    check: boolean
    fail_objective: boolean
}

export class Item {
    item_id: string
    value: number
    max_uses: number
    depreciation: number
    current_uses: number

    constructor(data: IItem) {
        this.item_id = data.item_id
        this.value = data.value
        this.max_uses = data.max_uses
        this.depreciation = data.depreciation
        this.current_uses = data.current_uses
    }

    public static async get_item(item_id: string) {
        try {
            const item_response = await http.get(`http://nexuscore:8000/api/v0.1/server/items/${item_id}`);
            const item_data = JSON.parse(item_response.body) as IItem;

            return new Item(item_data);

        } catch (error) {
            console.error("Error fetching item:", error);
            throw error;
        }
    }
}

export class World {
    quest_id: number
    start_time: Date
    end_time: Date
    title: string
    description: string
    objectives: Objective[]

    constructor(data: IQuest, objectives: Objective[]) {
        this.quest_id = data.quest_id
        this.start_time = parse(data.start_time, 'yyyy-MM-dd HH:mm:ss.SSSSSS', new Date())
        this.end_time = parse(data.end_time, 'yyyy-MM-dd HH:mm:ss.SSSSSS', new Date())
        this.title = data.title
        this.description = data.description

        this.objectives = objectives
    }

    public static async get_quest(quest_id: number): Promise<Quest> {
        try {
            // Fetch the main quest data.
            const quest_response = await http.get(`http://nexuscore:8000/api/v0.1/quests/${quest_id}`);
            const quest_data = JSON.parse(quest_response.body) as IQuest;

            // Fetch the objectives for the quest.
            const objectives_response = await http.get(`http://nexuscore:8000/api/v0.1/quests/${quest_id}/objectives`);
            const objectives_data = JSON.parse(objectives_response.body) as IObjective[];
            const objectives: Objective[] = []

            // For each objective, fetch its rewards.
            for (let objective of objectives_data) {
                const rewards_response = await http.get(`http://nexuscore:8000/api/v0.1/quests/${quest_id}/objectives/${objective.order}/rewards`);
                const rewards_data = JSON.parse(rewards_response.body) as IReward[];
                let rewards: Reward[] = []

                for (let reward of rewards_data) {
                    rewards.push(new Reward(reward))
                }

                objectives.push(new Objective(objective, rewards))
            }

            return new Quest(quest_data, objectives);

        } catch (error) {
            console.error("Error fetching quest:", error);
            throw error;
        }
    }
}