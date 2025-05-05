import { calculateWeight, formatWeight, warmupWeight } from "./weightCalcs.js";

const warmupSetType = 'warmup';
const warmupExerciseTitle = 'Warm Up';

export const updateRoutineExercises = (routine, latestWorkout) => 
    routine.exercises.map(routineExercise => {
        const exerciseTilte = routineExercise.title;
        if(exerciseTilte === warmupExerciseTitle) return { ...routineExercise };
        
        const {repRangeMax, repRangeMin, rest_seconds, weightIncrement} = getExerciseNotes(routine, routineExercise);
        const routineExerciseOut = {...routineExercise, rest_seconds};    
        const latestWorkoutExercise = latestWorkout.exercises.filter(workoutExercise => workoutExercise.title === routineExercise.title)[0];
        const setCount = routineExercise.sets.length;
        const { reps: routineTargetReps, weight_kg: routineTargetWeight } = routineExercise.sets[setCount-1];
                
        if(latestWorkoutExercise === undefined) return routineExerciseOut;
        
        const { weight_kg: lastSetWeight, reps: lastSetReps} = latestWorkoutExercise.sets[latestWorkoutExercise.sets.length -1 ];
        const shouldOverload = (lastSetReps >= routineTargetReps && formatWeight(lastSetWeight) === formatWeight(routineTargetWeight)) || lastSetWeight > routineTargetWeight;
        const shouldIncreaseWeight = shouldOverload && lastSetReps >= repRangeMax;
        const shouldIncreaseReps = shouldOverload && lastSetReps < repRangeMax;

        if(shouldIncreaseWeight) 
            routineExerciseOut.sets = routineExerciseOut.sets.map(set => { 
               return set.type === warmupSetType ?
                    {
                        ...set,
                        weight_kg: warmupWeight(lastSetWeight)
                    } :
                    {
                        ...set,
                        reps: repRangeMin, 
                        weight_kg: calculateWeight(lastSetWeight, weightIncrement),
                    };
        });
        else if (shouldIncreaseReps)
            routineExerciseOut.sets = routineExerciseOut.sets.map(set => {
                return set.type === warmupSetType ?
                    set :
                    {
                        ...set,
                        reps: lastSetReps+1,
                        weight_kg: lastSetWeight,
                    };
        });

        return routineExerciseOut;
    });

const getExerciseNotes = (routine, exercise) => 
    JSON.parse(routine.exercises.filter(routineExercise => routineExercise.title === exercise.title)[0].notes);