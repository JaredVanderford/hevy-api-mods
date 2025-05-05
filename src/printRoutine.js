import { log, logLevels } from "../log.js";
import { convertWeight } from "./weightCalcs.js";

export const printRoutine = ({exercises: oldRoutineExercises}, {exercises: workoutExercises}, newRoutine) => {
    let message = `Routine Name: ${newRoutine.title}\n`;
    newRoutine.exercises.map(newExercise => {
        message += `\t${newExercise.title}\n`;
        const oldRoutineExerciseFind = oldRoutineExercises.filter(exercise => exercise.title === newExercise.title);
        const workoutExerciseFind = workoutExercises.filter(exercise => exercise.title === newExercise.title);
        const workoutExercise = workoutExerciseFind[0];
        newExercise.sets.forEach(({reps: newReps, weight_kg: newWeight }, index) => {
            message += `\t\tSet ${index+1}\n`;
            if(oldRoutineExerciseFind.length > 0) {
                const {reps: oldReps, weight_kg: oldWeight } = oldRoutineExerciseFind[0].sets[index];
                message += `\t\t\tOld Weight: ${convertWeight(oldWeight)}\t\tOld Reps: ${oldReps}\n`;
            }
            if(workoutExerciseFind.length > 0) {
                const {reps: workoutReps, weight_kg: workoutWeight} = workoutExercise.sets[index];
                message += `\t\t\tWorkout Weight: ${convertWeight(workoutWeight)}\tWorkout Reps: ${workoutReps}\n`;
            }
            message += `\t\t\tNew Weight: ${convertWeight(newWeight)}\t\tNew Reps: ${newReps}\n`;
        });
    })
    log(message, logLevels.info);
};