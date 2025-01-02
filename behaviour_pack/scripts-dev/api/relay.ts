import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';


export default class Relay {
    public static message(nametag: string, content: string) {
        const request = new HttpRequest('http://nexuscore:8000/api/v0.1/events/relay');
        request.method = HttpRequestMethod.Post;
        request.body = JSON.stringify({
            'type': 'message',
            'content': content,
            'embed_title': '',
            'embed_content': '',
            'name': nametag
          });
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
    
        http.request(request);
    }

    public static event(title: string, content: string, event_type: 'join' | 'leave' | 'other') {
        const request = new HttpRequest('http://nexuscore:8000/api/v0.1/events/relay');
        request.method = HttpRequestMethod.Post;
        request.body = JSON.stringify({
            'type': event_type,
            'content': '',
            'embed_title': title,
            'embed_content': content,
            'name': 'Server'
          });
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];
    
        http.request(request);
    }

    public static location(locations: {gamertag: string, location: number[], hidden: boolean}[]) {
        const request = new HttpRequest('http://nexuscore:8000/api/v0.1/server/players');
        request.method = HttpRequestMethod.Post;
        request.body = JSON.stringify(locations.map(location => ({
            'gamertag': location.gamertag,
            'location': location.location,
            'hidden': location.hidden,
        })))
        request.headers = [
            new HttpHeader("Content-Type", "application/json"),
            new HttpHeader("auth", "my-auth-token"),
        ];

        http.request(request);
    }
}