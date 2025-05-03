export const updateRoutineExercises = (routine, latestWorkout) => 
    routine.exercises.map(exercise => {
        const { kgMultiplier, useLbs } = process.env;
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
                weight_kg: lastSet.weight_kg + (weightIncrement * (useLbs !== undefined ? kgMultiplier : 1))
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

const getExerciseNotes = (routine, exercise) => 
    JSON.parse(routine.exercises.filter(routineExercise => routineExercise.title === exercise.title)[0].notes);