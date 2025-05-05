import { describe, it, expect, vi } from 'vitest';
import { putRoutine } from "./putRoutine.js";
import * as hevyApiCall from "./hevyApiCall.js";

describe('putRoutine', () => {
    const mockRoutine = {
        id: 1,
        title: "Test Routine",
        notes: "Some notes",
        exercises: [
            {
                exercise_template_id: 10,
                superset_id: null,
                rest_seconds: 60,
                notes: "Exercise notes",
                sets: [
                    {
                        type: "warmup",
                        weight_kg: 20,
                        reps: 10,
                        distance_meters: null,
                        duration_seconds: null,
                        custom_metric: null
                    }
                ]
            }
        ]
    };

    it("calls apiCall with correct arguments and succeeds on 200", async () => {
        const apiCallMock = vi.spyOn(hevyApiCall, "apiCall").mockResolvedValue({ status: 200 });
        await expect(putRoutine(mockRoutine)).resolves.toBeUndefined();
        expect(apiCallMock).toHaveBeenCalledWith(
            `routines/${mockRoutine.id}`,
            {
                routine: {
                    title: mockRoutine.title,
                    notes: mockRoutine.notes,
                    exercises: [
                        {
                            exercise_template_id: 10,
                            superset_id: null,
                            rest_seconds: 60,
                            notes: "Exercise notes",
                            sets: [
                                {
                                    type: "warmup",
                                    weight_kg: 20,
                                    reps: 10,
                                    distance_meters: null,
                                    duration_seconds: null,
                                    custom_metric: null
                                }
                            ]
                        }
                    ]
                }
            },
            'PUT',
            { "Content-Type": 'application/json' }
        );
        apiCallMock.mockRestore();
    });

    it("throws if apiCall returns non-200 status", async () => {
        vi.spyOn(hevyApiCall, "apiCall").mockResolvedValue({ status: 500 });
        await expect(putRoutine(mockRoutine)).rejects.toBe("Failed to Update routine");
    });
});