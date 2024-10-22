import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';

export interface ThornyUser {
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

export async function get_user(guild_id: string, player_gamertag: string): Promise<ThornyUser> {
    return http.get(`http://nexuscore:8000/api/v0.1/users/guild/${guild_id}/${player_gamertag.replace(" ", "%20")}`)
        .then(response => {
            return JSON.parse(response.body) as ThornyUser
        });
}

export async function update_user(thorny_user: ThornyUser) {
    const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/users/${thorny_user.thorny_id}`);
    request.method = HttpRequestMethod.Put;
    request.body = JSON.stringify(thorny_user)
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    await http.request(request);
}