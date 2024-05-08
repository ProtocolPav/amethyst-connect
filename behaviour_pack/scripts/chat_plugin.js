import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';
export function relay_message(nametag, content) {
    const request = new HttpRequest(`http://thorny-wbs:8000/chat/message`);
    request.method = HttpRequestMethod.Post;
    request.body = JSON.stringify({
        'content': content,
        'name': nametag
    });
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];
    http.request(request);
}
function choose_colour(colour) {
    switch (colour) {
        case 'green':
            return 3596384;
        case 'red':
            return 14693967;
        case 'yellow':
            return 14734646;
    }
}
export function relay_event(content, colour) {
    const request = new HttpRequest(`http://thorny-wbs:8000/chat/event`);
    request.method = HttpRequestMethod.Post;
    request.body = JSON.stringify({
        'content': content,
        'colour': choose_colour(colour)
    });
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];
    http.request(request);
}
