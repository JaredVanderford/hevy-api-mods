import { apiCall } from "./hevyApiCall.js";

export const putRoutine = async (routine) => {
    var result = await apiCall(`routines/${routine.id}`, {routine: stripRoutine(routine)}, 'PUT', {"Content-Type": 'application/json'});
    if(result.status !== 200) throw "Failed to Update routine";
};

const stripRoutine = (routine) => {
    return {
        title: routine.title,
        notes: routine.notes,
        exercises: routine.exercises.map(exercise => stripExercise(exercise))
    };
};

const stripExercise = (exercise) => {
    return {
        exercise_template_id: exercise.exercise_template_id,
        superset_id: exercise.superset_id,
        rest_seconds: exercise.rest_seconds,
        notes: exercise.notes,
        sets: exercise.sets.map(set => stripSet(set))
    };
};

const stripSet = (set) => {
    return {
        type: set.type,
        weight_kg: set.weight_kg,
        reps: set.reps,
        distance_meters: set.distance_meters,
        duration_seconds: set.duration_seconds,
        custom_metric: set.custom_metric
    };
};