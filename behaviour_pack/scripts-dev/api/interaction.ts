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
    thorny_id: number
    type: 'mine' | 'kill' | 'die' | 'place' | 'use'
    position_x: number
    position_y: number
    position_z: number
    reference: string
    mainhand: string | null
    dimension: string

    constructor(data: IInteraction) {
        this.thorny_id = data.thorny_id
        this.type = data.type
        this.position_x = data.position_x
        this.position_y = data.position_y
        this.position_z = data.position_z
        this.reference = data.reference
        this.mainhand = data.mainhand
        this.dimension = data.dimension
    }

    /**
     * Post interaction to NexusCore
     */
    public post_interaction() {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/events/interaction`);
        request.method = HttpRequestMethod.Post;
        request.body = JSON.stringify(this);
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
  
        http.request(request);
    }
}