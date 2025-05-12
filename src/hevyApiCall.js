import { fileLog } from '../log.js';

export const apiCall = async (route, body, method, headers) => {
    const { API_KEY: apiKey, BASE_URL: baseUrl} = process.env;
    const options = {
        headers: {
            'api-key': apiKey,
            Accept: 'application/json'
        },
        method
    };
    if(headers !== null && headers !== undefined)
        options.headers = {
            ...options.headers,
            ...headers
        };
    if(body !== null)
        options.body = JSON.stringify(body);

    await fileLog(route, body, method);
    return fetch(`${baseUrl}${route}`, options);
};