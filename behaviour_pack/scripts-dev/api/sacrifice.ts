import {http, HttpHeader, HttpRequest, HttpRequestMethod} from "@minecraft/server-net"
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

export interface IWorld {
    guild_id: string
    overworld_border: number
    nether_border: number
    end_border: number
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
            const item_response = await http.get(`http://nexuscore:8000/api/v0.2/server/items/${item_id}`);
            const item_data = JSON.parse(item_response.body) as IItem;

            return new Item(item_data);

        } catch (error) {
            console.error("Error fetching item:", error);
            throw error;
        }
    }

    public async update_item() {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.2/server/items/${this.item_id}`);
        request.method = HttpRequestMethod.Put;
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];

        request.body = JSON.stringify({
            current_uses: this.current_uses
        });

        await http.request(request);
    }
}

export class World {
    guild_id: string
    overworld_border: number
    nether_border: number
    end_border: number

    constructor(data: IWorld) {
        this.guild_id = data.guild_id
        this.overworld_border = data.overworld_border
        this.nether_border = data.nether_border
        this.end_border = data.end_border
    }

    public static async get_world(guild_id: string) {
        try {
            const world_response = await http.get(`http://nexuscore:8000/api/v0.2/server/world/${guild_id}`);
            const world_data = JSON.parse(world_response.body) as IWorld;
            world_data.guild_id = guild_id;

            return new World(world_data);

        } catch (error) {
            console.error("Error fetching world:", error);
            throw error;
        }
    }

    public async update_world() {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.2/server/world/${this.guild_id}`);
        request.method = HttpRequestMethod.Put;
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];

        request.body = JSON.stringify({
            overworld_border: this.overworld_border,
            nether_border: this.nether_border,
            end_border: this.end_border
        });

        await http.request(request);
    }
}

export class WorldCache {
    static world: World

    public static async load_world(guild_id: string) {
        WorldCache.world = await World.get_world(guild_id)
    }
}