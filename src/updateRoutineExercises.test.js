import { describe, it, expect, vi, afterEach, test } from "vitest";
import { updateRoutineExercises, getExerciseNotes } from "./updateRoutineExercises.js";
import { getDefaults } from './defaultOverload.js';

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
const modifyNotes = (notes) => {
  return {
    ...baseRoutine,
    exercises: [
      {
        ...baseRoutine.exercises[0],
        notes
      }
    ]
  };
};
describe("updateRoutineExercises", () => {
  afterEach(() => {
    process.env = {
      ...process.env,
      DEFAULT_REP_MAX:undefined,
      DEFAULT_REP_MIN: undefined, 
      DEFAULT_REST_SECONDS: undefined,
      DEFAULT_WEIGHT_INCREMENT: undefined  };
  });

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

  
  it.each([
    [modifyNotes(""), getDefaults()],
    [modifyNotes(JSON.stringify({repRangeMax: 15})), {...getDefaults(), repRangeMax: 15}],
    [modifyNotes(JSON.stringify({repRangeMin: 4})), {...getDefaults(), repRangeMin: 4}],
    [modifyNotes(JSON.stringify({rest_seconds: 180})), {...getDefaults(), rest_seconds: 180}],
    [modifyNotes(JSON.stringify({weightIncrement: 15})), {...getDefaults(), weightIncrement: 15}],
    [baseRoutine, JSON.parse(baseRoutine.exercises[0].notes)]
  ])(
    "returns default overload when notes missing values on exercise", (routine, result) => {
    const testExercise = {
      title: "Bench Press",
      sets: [
        { type: "warmup", reps: 10, weight_kg: 20 },
        { type: "work", reps: 8, weight_kg: 60 },
      ]
    };
    const notes = getExerciseNotes(routine, testExercise);
    expect(notes).toStrictEqual(result);
  })

  it('returns default overload from process.env when defined', () => {
    const testProcessValues = {
      DEFAULT_REP_MAX: 3,
      DEFAULT_REP_MIN: 1, 
      DEFAULT_REST_SECONDS: 10,
      DEFAULT_WEIGHT_INCREMENT: 20  };
    process.env = {
      ...process.env,
      ...testProcessValues
    };
    const expectedDefaults = {
      repRangeMax: 3,
      repRangeMin: 1,
      rest_seconds: 10,
      weightIncrement: 20
    };
    const testExercise = {
      title: "Bench Press",
      sets: [
        { type: "warmup", reps: 10, weight_kg: 20 },
        { type: "work", reps: 8, weight_kg: 60 },
      ]
    };
    const testRoutine = modifyNotes(undefined);

    const notes = getExerciseNotes(testRoutine, testExercise);

    expect(notes).toStrictEqual(expectedDefaults);
  })
});
