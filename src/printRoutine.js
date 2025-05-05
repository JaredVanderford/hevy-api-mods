import { log, logLevels } from "../log.js";
import { calculateWeight } from "./weightCalcs.js";

export const printRoutine = (oldRoutine, newRoutine) => {
    let message = `Routine Name: ${newRoutine.title}\n`;
    newRoutine.exercises.map(newExercise => {
        message += `\t${newExercise.title}`;
        const oldExerciseFind = oldRoutine.exercises.filter(exercise => exercise.title === newExercise.title);
        if(oldExerciseFind.length > 0){
            log(`Exercise not found in old routine: ${newExercise.title}`, logLevels.warn)
            oldRoutine.exercises.forEach(exercise => console.log(exercise.title));
        }else {
            const oldExercise = oldExerciseFind[0];
            newExercise.sets.forEach(({reps: newReps, weight_kg: newWeight }, index) => {
                const {reps: oldReps, weight_kg: oldWeight} = oldExercise.set[index]
                message += `\t\tOld Weight: ${calculateWeight(oldWeight)}
\t\tNew Weight: ${newWeight}
\t\tOld Reps: ${oldReps}
\t\tNew Reps: ${newReps}`
            });
        }
    })
    log(message, logLevels.info);
};