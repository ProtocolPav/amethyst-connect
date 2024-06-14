import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';
import { Block, Dimension, Entity, world } from '@minecraft/server';
import { parse, format, differenceInSeconds } from 'date-fns';
import { MinecraftDimensionTypes } from '@minecraft/vanilla-data';

class Reward {
    reward_id: number
    balance: number | null
    item: string | null
    count: number | null

    constructor (
        id: number, 
        balance: number | null,
        item: string | null,
        count: number | null) {
            this.reward_id = id
            this.balance = balance
            this.item = item
            this.count = count
    }
}

class Objective {

    objective_id: number
    start: string
    end: string
    completion: number
    status: 'in_progress' | 'completed' | 'failed'
    objective: string
    objective_count: number
    objective_type: 'kill' | 'mine'
    objective_timer: number | null
    required_mainhand: string | null
    required_location: [number, number] | null
    location_radius: number
    rewards: Reward[]

    constructor (
        objective_id: number,
        start: string,
        end: string,
        completion: number,
        status: 'in_progress' | 'completed' | 'failed',
        objective: string,
        objective_count: number,
        objective_type: 'kill' | 'mine',
        objective_timer: number | null,
        required_mainhand: string | null,
        required_location: [number, number] | null,
        location_radius: number,
        rewards: Reward[]
    ) {
            this.objective_id = objective_id
            this.start = start
            this.end = end
            this.completion = completion
            this.status = status
            this.objective = objective
            this.objective_count = objective_count
            this.objective_type = objective_type
            this.objective_timer = objective_timer
            this.required_mainhand = required_mainhand
            this.required_location = required_location
            this.location_radius = location_radius
            this.rewards = rewards
    }

    increment_completion(target_id: string, target_location: number[], mainhand: string | null): void {
        if (target_id === this.objective && this.status === 'in_progress' && this.check_requirements(target_location, mainhand)) {

            this.completion++

            if (this.completion === this.objective_count) {
                this.status = 'completed'
                this.end = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            }
        }
    }

    sync_to_nexuscore(thorny_id: number, quest_id: number): void {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/users/thorny-id/${thorny_id}/quest/${quest_id}/${this.objective_id}`);
        request.method = HttpRequestMethod.Put;
        request.body = JSON.stringify({
            "start": null,
            "end": this.end,
            "completion": this.completion,
            "status": this.status
        })
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];

        world.sendMessage(`Syncing ${this.completion}, ${this.status}`)
    
        http.request(request);
    }

    check_requirements(target_location: number[], mainhand: string | null): boolean {
        // Check mainhand
        if (this.required_mainhand && mainhand !== this.required_mainhand) {
            return false
        }

        // Check location
        if (this.required_location && !this.distance_check(this.required_location[0], target_location[0], this.required_location[1], target_location[1])) {
            return false
        }

        // Check timer
        if (this.objective_timer && !this.timer_check(this.objective_timer)) {
            // Include some lines to mark the whole quest as FAILED!
            return false
        }

        return true
    }

    distance_check(x1: number, z1: number, x2: number, z2: number): boolean {
        const distance = Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2)

        if (distance <= this.location_radius) {
            return true
        }

        return false
    }

    timer_check(timer: number): boolean {
        const now = new Date()
        const start = parse(this.start, "yyyy-MM-dd HH:mm:ss", new Date())

        if (differenceInSeconds(now, start) < timer) {
            return true
        }

        return false
    }
}


export class Quest {
    
    quest_id: number
    title: string
    status: 'in_progress' | 'completed' | 'failed'
    objectives: Objective[]

    constructor(
        quest_id: number,
        title: string,
        status: 'in_progress' | 'completed' | 'failed',
        objectives: Objective[]
    ) {
        this.quest_id = quest_id
        this.title = title
        this.status = status
        this.objectives = objectives
    }

    increment_active_objective(thorny_id: number, target_id: string, target_location: number[], mainhand: string | null): void {
        const active_object = this.objectives.find(objective => objective.status === 'in_progress')
        
        // Increment & Sync only the active objective
        if (active_object) {

            // Increment only if there is no timer, or if the timer is valid
            if (!active_object.objective_timer || (active_object.objective_timer && active_object.timer_check(active_object.objective_timer))) {
                active_object.increment_completion(target_id, target_location, mainhand);
                active_object.sync_to_nexuscore(thorny_id, this.quest_id);
            }
            // The timer is invalid. Fail entire quest
            else if (active_object.objective_timer) {
                this.fail_quest(thorny_id);
                // Inform user of this change
            }

            if (active_object.status === 'completed') {
                this.complete_quest(thorny_id)
                world.getDimension(MinecraftDimensionTypes.Overworld).runCommand(`title @a title ${this.title} COMPLETE!`)
                // Inform user
            }
        }
    }

    fail_quest(thorny_id: number) {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/users/thorny-id/${thorny_id}/quest/active`);
        request.method = HttpRequestMethod.Delete;
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
    
        http.request(request);

        this.status = 'failed'

        for (const obj of this.objectives) {
            obj.status = 'failed'
        }
    }

    complete_quest(thorny_id: number) {
        this.status = 'completed'

        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/users/thorny-id/${thorny_id}/quest/${this.quest_id}`);
        request.method = HttpRequestMethod.Put;
        request.body = JSON.stringify({
            "accepted_on": null,
            "started_on": null,
            "objectives_completed": null,
            "status": this.status
        })
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
    
        http.request(request);
    }
}

export interface QuestCache {
    [thorny_id: number]: Quest;
}

interface Interaction {
    thorny_id: number
    time: Date
    target_id: string
    target_location: number[]
    mainhand: string | null
}

export class InteractionQueue {
    items: Interaction[]
    is_processing: boolean

    constructor () {
        this.items = []
        this.is_processing = false
    }

    enqueue (interaction: Interaction) {
        this.items.push(interaction)
    }

    dequeue(): Interaction | undefined {
        return this.items.shift()
    }

    is_empty(): boolean {
        if (this.items.length === 0) {
            return true
        }

        return false
    }
}

async function fetch_active_quest(thorny_id: number, quest_cache: QuestCache): Promise<Quest | null> {
    // If there is already an in_progress quest in the cache, return it
    if (thorny_id in quest_cache && quest_cache[thorny_id].status === 'in_progress') {
        world.sendMessage("Getting from CACHE")
    }
    // Otherwise, if the cached quest is failed or completed, 
    // check the API if a new active quest exists
    else {
        world.sendMessage("Getting UserQuest from API")
        const quest_response = JSON.parse((await http.get(`http://nexuscore:8000/api/v0.1/users/thorny-id/${thorny_id}/quest/active`)).body)

        // Only continue fetching if an active quest exists
        if (quest_response['quest']) {
            world.sendMessage("Getting Quest from API")
            const quest_data = JSON.parse((await http.get(`http://nexuscore:8000/api/v0.1/quests/${quest_response['quest']['quest_id']}`)).body)

            var objectives: Objective[] = []

            for (const obj of quest_data['objectives']) {
                var rewards: Reward[] = []
                const objective_progress = quest_response['objectives'].find(objective => objective['objective_id'] === obj['objective_id'])

                for (const rew of quest_data['rewards']) {
                    if (rew['objective_id'] === obj['objective_id']) {
                        rewards.push(new Reward(rew['reward_id'], rew['balance'], rew['item'], rew['count']))
                    }
                }

                objectives.push(new Objective(
                    obj['objective_id'],
                    objective_progress['start'],
                    objective_progress['end'],
                    objective_progress['completion'],
                    objective_progress['status'],
                    obj['objective'],
                    obj['objective_count'],
                    obj['objective_type'],
                    obj['objective_timer'],
                    obj['required_mainhand'],
                    obj['required_location'],
                    obj['location_radius'],
                    rewards
                ))
            }

            quest_cache[thorny_id] = new Quest(
                quest_data['quest']['quest_id'],
                quest_data['quest']['title'],
                quest_response['quest']['status'],
                objectives
            )
        }
    }

    return quest_cache[thorny_id];
}

export async function process_interactions(interaction_queue: InteractionQueue, cached_quests: QuestCache) {
    if (!interaction_queue.is_processing) {
        while (!interaction_queue.is_empty()) {
            interaction_queue.is_processing = true
            var interaction = interaction_queue.dequeue()

            if (interaction) {
                const quest = await fetch_active_quest(interaction?.thorny_id, cached_quests)
                quest?.increment_active_objective(interaction?.thorny_id, interaction?.target_id, interaction?.target_location, interaction?.mainhand)
            }
        }
        interaction_queue.is_processing = false
    }
}