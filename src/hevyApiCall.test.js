import { afterAll, assert, beforeAll, describe, expect, it, vi } from "vitest";
import { apiCall } from "./hevyApiCall";

describe ('heavyApiCall', async () => {
    const testBaseUrl = 'testurl';
    const testAPIKey = 'testApiKey';
    let fetchSpy;

    beforeAll(() => {
        vi.stubEnv('BASE_URL', testBaseUrl);
        vi.stubEnv('API_KEY', testAPIKey);
    });
    afterAll(() => {
        vi.unstubAllEnvs();
    })

    it("returns result from fetch call", async() => {
        const testRoute = 'testRoute';
        const mockResult = {
            success: true
        };
        fetchSpy = vi.fn(() => mockResult);
        global.fetch = fetchSpy;
        const result = await apiCall('testRoute', );
        assert.equal(result, mockResult);
    });

    it("calls fetch with specified values and route appended to base URL", async() => {
        const testRoute = 'testRoute';
        const testBody = {
            test: "test"
        };
        const mockResult = {
            success: true
        };
        const testMethod = 'GET';
        const expectedOptions = {
            body: JSON.stringify(testBody),
            headers: {
                'api-key': testAPIKey,
                Accept: 'application/json'
            },
            method: testMethod
        };
        fetchSpy = vi.fn(() => mockResult);
        global.fetch = fetchSpy;
        const result = await apiCall(testRoute, testBody, testMethod);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(`${testBaseUrl}${testRoute}`, expectedOptions);
    })
})