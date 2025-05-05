import { calculateWeight, warmupWeight } from "./weightCalcs.js";

const warmupSetType = 'warmup';
const warmupExerciseTitle = 'Warm Up';

export const updateRoutineExercises = (routine, latestWorkout) => 
    routine.exercises.map(routineExercise => {
        const exerciseTilte = routineExercise.title;
        if(exerciseTilte === warmupExerciseTitle) return { ...routineExercise };

        const {repRangeMax, repRangeMin, rest_seconds, weightIncrement} = getExerciseNotes(routine, routineExercise);
        const routineExerciseOut = {...routineExercise, rest_seconds};    
        const latestWorkoutExercise = latestWorkout.exercises.filter(workoutExercise => workoutExercise.title === routineExercise.title)[0];
        const routineTargetWeight = routineExercise.sets[0].weight_kg;
        const routineTargetReps = routineExercise.sets.filter(set => set.type !== warmupSetType)[0].reps;
        
        if(latestWorkoutExercise === undefined) return {...routineExercise, rest_seconds};
        
        const { weight_kg: maxWeight, reps} = latestWorkoutExercise.sets[latestWorkoutExercise.sets.length -1 ];
        const shouldIncreaseWeight = reps >= repRangeMax && maxWeight >= routineTargetWeight;
        const shouldIncreaseReps = reps >= repRangeMin && 
            (reps >= routineTargetReps || maxWeight > routineTargetWeight);

        if(shouldIncreaseWeight) 
            routineExerciseOut.sets = routineExerciseOut.sets.map(set => { 
               return set.type === warmupSetType ?
                    {
                        ...set,
                        weight_kg: warmupWeight(maxWeight)
                    } :
                    {
                        ...set,
                        reps, 
                        weight_kg: calculateWeight(maxWeight, weightIncrement),
                    };
        });
        else if (shouldIncreaseReps)
            routineExerciseOut.sets = routineExerciseOut.sets.map(set => {
                return set.type === warmupSetType ?
                    set :
                    {
                        ...set,
                        reps: reps+1,
                        weight_kg: maxWeight,
                    };
        });

        return routineExerciseOut;
    });

const getExerciseNotes = (routine, exercise) => 
    JSON.parse(routine.exercises.filter(routineExercise => routineExercise.title === exercise.title)[0].notes);