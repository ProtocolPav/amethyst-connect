import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';


interface IInteraction {
    thorny_id: number
    type: 'mine' | 'kill' | 'die' | 'place' | 'use'
    position_x: number
    position_y: number
    position_z: number
    reference: string
    mainhand: string | null
    dimension: string
}

export default class Interaction implements IInteraction {
    private static queue: Interaction[] = []
    private static processing: Boolean = false

    thorny_id: number
    type: 'mine' | 'kill' | 'die' | 'place' | 'use'
    position_x: number
    position_y: number
    position_z: number
    reference: string
    mainhand: string | null
    dimension: string
    time: Date

    constructor(data: IInteraction) {
        this.thorny_id = data.thorny_id
        this.type = data.type
        this.position_x = Math.round(data.position_x)
        this.position_y = Math.round(data.position_y)
        this.position_z = Math.round(data.position_z)
        this.reference = data.reference
        this.mainhand = data.mainhand
        this.dimension = data.dimension
        this.time = new Date()
    }

    /**
     * Post interaction to NexusCore
     */
    public async post_interaction() {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/events/interaction`);
        request.method = HttpRequestMethod.Post;
        request.body = JSON.stringify(this);
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
  
        await http.request(request);
    }

    public static set_processing(value: true | false) {
        Interaction.processing = value
    }

    public static is_processing(): Boolean {
        return Interaction.processing
    }

    public static enqueue(interaction: Interaction) {
        Interaction.queue.push(interaction)
    }

    public static dequeue() {
        return Interaction.queue.shift()
    }
}