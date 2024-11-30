import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';

interface IThornyUser {
    thorny_id: number
    user_id: number
    guild_id: number
    username: string | null
    join_date: Date
    birthday: Date | null
    balance: number
    active: boolean
    role: string
    patron: boolean
    level: number
    xp: number
    required_xp: number
    last_message: Date
    gamertag: string
    whitelist: string
}

export default class ThornyUser implements IThornyUser {
    private static thorny_user_map: {[gamertag: string]: ThornyUser} = {}
    private static thorny_id_map: {[thorny_id: number]: ThornyUser} = {}

    thorny_id: number
    user_id: number
    guild_id: number
    username: string | null
    join_date: Date
    birthday: Date | null
    balance: number
    active: boolean
    role: string
    patron: boolean
    level: number
    xp: number
    required_xp: number
    last_message: Date
    gamertag: string
    whitelist: string

    constructor(api_data: IThornyUser) {
        this.thorny_id = api_data.thorny_id
        this.user_id = api_data.user_id
        this.guild_id = api_data.guild_id
        this.username = api_data.username
        this.join_date = api_data.join_date
        this.birthday = api_data.birthday
        this.balance = api_data.balance
        this.active = api_data.active
        this.role = api_data.role
        this.patron = api_data.patron
        this.level = api_data.level
        this.xp = api_data.xp
        this.required_xp = api_data.required_xp
        this.last_message = api_data.last_message
        this.gamertag = api_data.gamertag
        this.whitelist = api_data.whitelist
    }

    public static async get_user_from_api(guild_id: string, gamertag: string): Promise<ThornyUser> {
        try {
            return http.get(`http://nexuscore:8000/api/v0.1/users/guild/${guild_id}/${gamertag.replace(" ", "%20")}`)
                .then(response => {
                    try {
                        console.log(response.body, response.status)
                        const thorny_user = new ThornyUser(JSON.parse(response.body) as IThornyUser)

                        // Adds user to map for quick fetching
                        ThornyUser.thorny_user_map[gamertag] = thorny_user
                        ThornyUser.thorny_id_map[thorny_user.thorny_id] = thorny_user
                        thorny_user.gamertag = gamertag

                        return thorny_user
                    }
                    catch (e) {
                        console.error("Failed to parse JSON:", e);
                        throw e;
                    }

                });
        }
        catch (e) {
            console.error(`Big error in getting ThornyUser for ${gamertag}`, e);
            throw e;
        }
    }

    public static fetch_user(gamertag: string): ThornyUser | undefined {
        return ThornyUser.thorny_user_map[gamertag]
    }

    public static fetch_user_by_id(thorny_id: number): ThornyUser {
        return ThornyUser.thorny_id_map[thorny_id]
    }
    
    /**
     * Update this user in NexusCore
     */
    public async update() {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/users/${this.thorny_id}`);
        request.method = HttpRequestMethod.Put;
        request.body = JSON.stringify(this)
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
        // modify this to not update every field
        await http.request(request);
    }

    /**
     * Send a connection event to NexusCore, either
     * connect or disconnect
     */
    public send_connect_event(event_type: "connect" | "disconnect") {
        const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/events/connection`);
        request.method = HttpRequestMethod.Post;
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
        request.body = JSON.stringify({"type": event_type, "thorny_id": this.thorny_id});
        console.log(`[CONNECTION] Sending ${event_type} to NexusCore for ThornyID ${this.thorny_id} (${this.whitelist} / ${this.gamertag})`);
    
        http.request(request);
    }

    /**
     * Returns a decorated role string for chat decoration
     */
    public get_role_display(): string {
        let role = this.role
        let colour = '§b'

        if (this.patron) {
            role = 'Patron'
            colour = '§c'
        }
        
        if (this.role == 'Community Manager') {
            role = 'Manager'
            colour = '§e'
        }

        if (this.role == 'Owner') {
            colour = '§l§a'
        }

        return colour + role
    }
}