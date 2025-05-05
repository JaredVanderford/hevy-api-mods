import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as fetchWorkoutModule from './fetchLatestWorkout.js';
import * as fetchRoutineModule from './fetchNamedRoutine.js';
import * as printRoutineModule from './printRoutine.js';
import * as testModule from "./progressiveOverloadJob.js";
import * as updateRoutineModule from './updateRoutineExercises.js';
import * as putRoutineModule from './putRoutine.js';
import * as logModule from "../log.js";

const { progressiveOverloadJob } = testModule;

describe('progressiveOverloadJob', async () => {
    let fetchRoutineSpy, 
        fetchWorkoutSpy, 
        logSpy,
        printRoutineSpy, 
        putRoutineSpy, 
        updatedRoutineSpy;
    const mockRoutine = { title: 'Test routine', exercises: [{ title: 'OldTest' }]};
    const mockWorkout = { title: 'Test routine', exercises: [] };
    const mockUpdatedRoutineExercises = [{ title: "Test" }];
    const mockUpdatedRoutine = { ...mockRoutine, exercises: mockUpdatedRoutineExercises};

    beforeEach(() => {
        fetchRoutineSpy = vi.spyOn(fetchRoutineModule, 'fetchNamedRoutine');
        fetchWorkoutSpy = vi.spyOn(fetchWorkoutModule, 'fetchLatestWorkout');
        logSpy = vi.spyOn(logModule, 'log').mockImplementationOnce(() => {});
        printRoutineSpy = vi.spyOn(printRoutineModule, 'printRoutine');
        printRoutineSpy.mockImplementationOnce(() => {});
        putRoutineSpy = vi.spyOn(putRoutineModule, 'putRoutine');
        updatedRoutineSpy = vi.spyOn(updateRoutineModule, 'updateRoutineExercises');
        fetchRoutineSpy.mockReturnValue(mockRoutine);
        fetchWorkoutSpy.mockReturnValue(mockWorkout);
        updatedRoutineSpy.mockReturnValue(mockUpdatedRoutineExercises);
        putRoutineSpy.mockResolvedValue();

    })
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    })

    it("calls putRoutine when DEBUG env var is not set", async () => {
        vi.unstubAllEnvs();

        await progressiveOverloadJob();

        expect(putRoutineSpy).toHaveBeenCalledWith(mockUpdatedRoutine);
        expect(printRoutineSpy).not.toHaveBeenCalled();
    });

    it("calls printRoutine when DEBUG env var is set", async () => {
        vi.stubEnv('DEBUG', true);

        await progressiveOverloadJob();

        expect(printRoutineSpy).toHaveBeenCalledWith(mockRoutine, mockUpdatedRoutine);
        expect(putRoutineSpy).not.toHaveBeenCalled();
    });

    it("logs the update message", async () => {
        vi.unstubAllEnvs();

        await progressiveOverloadJob();

        expect(logSpy).toHaveBeenCalled();
    });

    it("calls updateRoutineExercises with correct arguments", async () => {
        vi.unstubAllEnvs();

        fetchRoutineSpy.mockReturnValue(mockRoutine);
        fetchWorkoutSpy.mockReturnValue(mockWorkout);
        updatedRoutineSpy.mockReturnValue(mockUpdatedRoutine);
        putRoutineSpy.mockResolvedValue();

        await progressiveOverloadJob();

        expect(updatedRoutineSpy).toHaveBeenCalledWith(mockRoutine, mockWorkout);
    });
})