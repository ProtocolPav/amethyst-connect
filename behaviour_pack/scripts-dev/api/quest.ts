
interface IReward {
    display_name: string
    balance: number
    item: string
    count: number
}

interface IObjective {
    objective: string
    order: number
    description: string
    display: string | null
    objective_count: number
    objective_type: 'kill' | 'mine' | 'encounter'
    natural_block: boolean
    objective_timer: number | null
    required_mainhand: string | null
    required_location: number[] | null
    location_radius: number
    rewards: IReward[]
}

interface IQuest {
    start_time: Date
    end_time: Date
    title: string
    description: string
    objectives: IObjective[]
}

class Reward implements IReward {
    display_name: string
    balance: number
    item: string
    count: number

    constructor(data: IReward) {
        this.display_name = data.display_name
        this.balance = data.balance
        this.item = data.item
        this.count = data.count
    }
}

class Objective implements IObjective{
    objective: string
    order: number
    description: string
    display: string | null
    objective_count: number
    objective_type: 'kill' | 'mine' | 'encounter'
    natural_block: boolean
    objective_timer: number | null
    required_mainhand: string | null
    required_location: number[] | null
    location_radius: number
    rewards: Reward[]

    constructor(data: IObjective) {
        this.objective = data.objective
        this.order = data.order
        this.description = data.description
        this.display = data.display
        this.objective_count = data.objective_count
        this.objective_type = data.objective_type
        this.natural_block = data.natural_block
        this.objective_timer = data.objective_timer
        this.required_mainhand = data.required_mainhand
        this.required_location = data.required_location
        this.location_radius = data.location_radius

        this.rewards = []
        for (let reward_data of data.rewards) {
            this.rewards.push(new Reward(reward_data))
        }
    }
}

class Quest implements IQuest {
    start_time: Date
    end_time: Date
    title: string
    description: string
    objectives: Objective[]

    constructor(data: IQuest) {
        this.start_time = data.start_time
        this.end_time = data.end_time
        this.title = data.title
        this.description = data.description
        
        this.objectives = []
        for (let objective_data of data.objectives) {
            this.objectives.push(new Objective(objective_data))
        }
    }
}