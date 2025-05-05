import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchLatestWorkout } from './fetchLatestWorkout.js';
import * as apiCallModule from './hevyApiCall.js';

describe('fetchLatestWorkout', () => {
    let apiCallStub;

    beforeEach(() => {
        process.env.BASE_API = "test.com";
        apiCallStub = vi.spyOn(apiCallModule, 'apiCall')
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch and return the latest workout', async () => {
        const mockResponse = {
            status: 200,
            json: () => Promise.resolve({
                workouts: [{
                    id: '123',
                    title: 'Test Workout',
                    exercises: []
                }]
            })
        };

        apiCallStub.mockReturnValue(mockResponse);

        const result = await fetchLatestWorkout();

        expect(apiCallStub).toHaveBeenCalledWith('workouts?page=1&pageSize=5', null, 'GET');
        expect(result).toEqual({
            id: '123',
            title: 'Test Workout',
            exercises: []
        });
    });

    it('should throw error when API call fails', async () => {
        const mockResponse = {
            status: 500
        };

        apiCallStub.mockResolvedValue(mockResponse);

        await expect(fetchLatestWorkout()).rejects.toThrow('Failed to get latest workout');
    });
});