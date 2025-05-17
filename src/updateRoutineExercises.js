import { log, logLevels } from "../log.js";
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

        
        if(shouldIncreaseWeight) routineExerciseOut.sets = increaseExerciseWeight(routineExercise, Math.max(lastSetWeight, routineTargetWeight), weightIncrement, repRangeMin);
        else if (shouldIncreaseReps) routineExerciseOut.sets = increaseExerciseReps(routineExercise, Math.max(lastSetReps, routineTargetReps), Math.max(lastSetWeight, routineTargetWeight));
        if(process.env.DEBUG && shouldOverload) {
            const message = `Exercise found to need overloading: ${routineExercise.title}
\tMin Reps: ${repRangeMin}\tMax Reps: ${repRangeMax}\tIncrement: ${weightIncrement}
\tOld Routine---- Reps: ${routineTargetReps}\tWeight: ${formatWeight(routineTargetWeight)}
\tWorkout ---- Reps: ${lastSetReps}\tWeight: ${lastSetWeight}
\tNew Routine ---- Reps: ${routineExerciseOut.sets[setCount-1].reps}\tWeight: ${formatWeight(routineExerciseOut.sets[setCount-1].weight_kg)}\n`;
            log(message,logLevels.DEBUG);
        }
        return routineExerciseOut;
    });

const getExerciseNotes = (routine, exercise) => 
    JSON.parse(routine.exercises.filter(routineExercise => routineExercise.title === exercise.title)[0].notes);

export const increaseExerciseWeight = (exercise, baseWeight, increment, repRangeMin) => {
    if(!process.env.DEBUG){
        log(`Increasing weight on ${exercise.title}`, logLevels.info);
    }
    return exercise.sets.map(set =>
        set.type === warmupSetType ?
            {
                ...set,
                weight_kg: warmupWeight(baseWeight)
            } :
            {
                ...set,
                reps: repRangeMin, 
                weight_kg: calculateWeight(baseWeight, increment),
            }
    );
}

export const increaseExerciseReps = (exercise, baseReps, baseWeight) => {
    if(!process.env.DEBUG){
        log(`Increasing reps on ${exercise.title}`, logLevels.info);
    }
    return exercise.sets.map(set => 
        set.type === warmupSetType ?
            set :
            {
                ...set,
                reps: baseReps+1,
                weight_kg: baseWeight,
            }
    );
}