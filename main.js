import { config } from 'dotenv';

await config();
const { apikey: apiKey, baseUrl} = process.env;
const kgMultiplier = 0.45359237;

const apiCall = (route, body, method, headers) => {
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


const fetchNamedRoutine = async (name) => {
    var result = await apiCall( `routines?page=1&pageSize=5`, null, 'GET');
    if(result.status !== 200) throw 'Failed to get routine';
    const routineResults = await result.json();
    return routineResults.routines.filter(routine => routine.title === name)[0];    
};

const fetchLatestWorkout = async () => {
    var result = await apiCall(`workouts?page=1&pageSize=5`, null, 'GET');
    if(result.status !== 200) throw 'Failed to get latest workout';
    const workoutResults = await result.json();
    return workoutResults.workouts[0];
};

const putRoutine = async (routine) => {
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

const getExerciseNotes = (routine, exercise) => 
    JSON.parse(routine.exercises.filter(routineExercise => routineExercise.title === exercise.title)[0].notes);

const latestWorkout  = await fetchLatestWorkout();

const routine = await fetchNamedRoutine(latestWorkout.title);

const updatedRoutineExercises = routine.exercises.map(exercise => {
    if(exercise.title === 'Warm Up') return { ...exercise };
    const {repRangeMax, repRangeMin, rest_seconds, weightIncrement} = getExerciseNotes(routine, exercise);
    const exerciseOut = {...exercise, rest_seconds};    
    const workoutExercise = latestWorkout.exercises.filter(workoutExercise => workoutExercise.title === exercise.title)[0];
    if(workoutExercise === undefined) return {...exercise, rest_seconds};
    const lastSet = workoutExercise.sets[workoutExercise.sets.length -1 ];
    if(lastSet.reps >= repRangeMax) 
        exerciseOut.sets = exerciseOut.sets.map(set => { return {
            ...set,
            reps:repRangeMin, 
            weight_kg: lastSet.weight_kg + (weightIncrement * kgMultiplier)
        }});
    else if (lastSet.reps >= repRangeMin && lastSet.reps >= exercise.sets[0].reps)
        exerciseOut.sets = exerciseOut.sets.map(set => {
            return {
                ...set,
                reps: lastSet.reps+1
            };
        });
    return exerciseOut;
});

const updatedRoutine = {
    ...routine,
    exercises: updatedRoutineExercises,
};

await putRoutine(updatedRoutine);
console.log(`${updatedRoutine.title} routine updated.`)