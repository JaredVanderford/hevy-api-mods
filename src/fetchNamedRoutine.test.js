import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchNamedRoutine } from './fetchNamedRoutine.js';
import * as apiCallModule from './hevyApiCall.js';

describe('fetchNamedRoutine', () => {
    let apiCallStub;

    beforeEach(() => {
        process.env.BASE_API = "test.com";
        apiCallStub = vi.spyOn(apiCallModule, 'apiCall')
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch and return the list of routines', async () => {
        const mockResponse = {
            status: 200,
            json: () => Promise.resolve({
                routines: [{
                    id: '123',
                    title: 'Test routine',
                    exercises: []
                },
                {
                    id: '1234',
                    title: 'Test routine2',
                    exercises: []
                }]
            })
        };

        apiCallStub.mockReturnValue(mockResponse);

        const result = await fetchNamedRoutine("Test routine");

        expect(apiCallStub).toHaveBeenCalledWith('routines?page=1&pageSize=5', null, 'GET');
        expect(result).toEqual({
            id: '123',
            title: 'Test routine',
            exercises: []
        });
    });

    it('should throw error when API call fails', async () => {
        const mockResponse = {
            status: 500
        };

        apiCallStub.mockResolvedValue(mockResponse);

        await expect(fetchNamedRoutine()).rejects.toThrow('Failed to get routine');
    });

    it('should throw error when routine not found'), async () => {
        const mockResponse = {
            status: 200,
            json: () => Promise.resolve({
                routines: [{
                    id: '123',
                    title: 'Test routine',
                    exercises: []
                },
                {
                    id: '1234',
                    title: 'Test routine2',
                    exercises: []
                }]
            })
        };

        apiCallStub.mockReturnValue(mockResponse);

        await expect(fetchNamedRoutine('Testing failed')).rejects.toThrow('Failed to get routine');
    }
});