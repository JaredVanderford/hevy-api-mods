import { describe, it, expect, vi } from "vitest";
import { updateRoutineExercises } from "./updateRoutineExercises.js";

// Mock the weightCalcs functions
vi.mock("./weightCalcs.js", () => ({
  calculateWeight: (w, inc) => w + inc,
  formatWeight: (w) => Math.round(w * 100) / 100,
  warmupWeight: (w) => w * 0.5,
}));

const baseRoutine = {
  exercises: [
    {
      title: "Bench Press",
      notes: JSON.stringify({
        repRangeMax: 8,
        repRangeMin: 5,
        rest_seconds: 120,
        weightIncrement: 2.5,
      }),
      sets: [
        { type: "work", reps: 5, weight_kg: 60 },
        { type: "work", reps: 5, weight_kg: 60 },
        { type: "work", reps: 5, weight_kg: 60 },
      ],
      rest_seconds: 120,
    },
    {
      title: "Warm Up",
      notes: "{}",
      sets: [
        { type: "warmup", reps: 10, weight_kg: 20 },
      ],
      rest_seconds: 60,
    },
  ],
};

describe("updateRoutineExercises", () => {
  it("returns routine exercise unchanged if not in latest workout", () => {
    const latestWorkout = { exercises: [] };
    const updated = updateRoutineExercises(baseRoutine, latestWorkout);
    expect(updated[0].sets).toEqual(baseRoutine.exercises[0].sets);
  });

  it("returns warmup exercise unchanged", () => {
    const latestWorkout = { exercises: [] };
    const updated = updateRoutineExercises(baseRoutine, latestWorkout);
    expect(updated[1]).toEqual(baseRoutine.exercises[1]);
  });

  it("increases weight and resets reps if last set reps >= repRangeMax", () => {
    const latestWorkout = {
      exercises: [
        {
          title: "Bench Press",
          sets: [
            { type: "work", reps: 8, weight_kg: 60 },
            { type: "work", reps: 8, weight_kg: 60 },
            { type: "work", reps: 8, weight_kg: 60 },
          ],
        },
      ],
    };
    const updated = updateRoutineExercises(baseRoutine, latestWorkout);
    // All work sets should have reps = 5 and weight = 62.5
    updated[0].sets.forEach(set => {
      if (set.type === "work") {
        expect(set.reps).toBe(5);
        expect(set.weight_kg).toBe(62.5);
      }
    });
  });

  it("increases reps if last set reps < repRangeMax", () => {
    const latestWorkout = {
      exercises: [
        {
          title: "Bench Press",
          sets: [
            { type: "work", reps: 7, weight_kg: 60 },
            { type: "work", reps: 7, weight_kg: 60 },
            { type: "work", reps: 7, weight_kg: 60 },
          ],
        },
      ],
    };
    const updated = updateRoutineExercises(baseRoutine, latestWorkout);
    // All work sets should have reps = 8 and weight = 60
    updated[0].sets.forEach(set => {
      if (set.type === "work") {
        expect(set.reps).toBe(8);
        expect(set.weight_kg).toBe(60);
      }
    });
  });

  it("does not change sets if overload conditions are not met", () => {
    const latestWorkout = {
      exercises: [
        {
          title: "Bench Press",
          sets: [
            { type: "work", reps: 4, weight_kg: 60 },
            { type: "work", reps: 4, weight_kg: 60 },
            { type: "work", reps: 4, weight_kg: 60 },
          ],
        },
      ],
    };
    const updated = updateRoutineExercises(baseRoutine, latestWorkout);
    expect(updated[0].sets).toEqual(baseRoutine.exercises[0].sets);
  });

  it("updates warmup set weight when increasing weight", () => {
    const routine = {
      exercises: [
        {
          title: "Bench Press",
          notes: JSON.stringify({
            repRangeMax: 8,
            repRangeMin: 5,
            rest_seconds: 120,
            weightIncrement: 2.5,
          }),
          sets: [
            { type: "warmup", reps: 10, weight_kg: 20 },
            { type: "work", reps: 5, weight_kg: 60 },
          ],
          rest_seconds: 120,
        },
      ],
    };
    const latestWorkout = {
      exercises: [
        {
          title: "Bench Press",
          sets: [
            { type: "warmup", reps: 10, weight_kg: 20 },
            { type: "work", reps: 8, weight_kg: 60 },
          ],
        },
      ],
    };
    const updated = updateRoutineExercises(routine, latestWorkout);
    expect(updated[0].sets[0].weight_kg).toBe(30); // warmupWeight(60) = 60 * 0.5 = 30
    expect(updated[0].sets[1].weight_kg).toBe(62.5);
    expect(updated[0].sets[1].reps).toBe(5);
  });
});
