export interface FetchResponse {
    response: Response;
    json: () => any;
    text: () => any;
}
