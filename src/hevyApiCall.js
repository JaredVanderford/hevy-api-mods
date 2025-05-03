export const apiCall = (route, body, method, headers) => {
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
    return fetch(`${baseUrl}${route}`, options,
    );
};