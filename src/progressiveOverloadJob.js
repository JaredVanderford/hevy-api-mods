import { log } from "../log.js";
import { fetchLatestWorkout } from "./fetchLatestWorkout.js";
import { fetchNamedRoutine } from "./fetchNamedRoutine.js";
import { printRoutine } from "./printRoutine.js";
import { putRoutine } from "./putRoutine.js";
import { updateRoutineExercises } from "./updateRoutineExercises.js";

export const progressiveOverloadJob = async () => {

    const latestWorkout  = await fetchLatestWorkout();

    const routine = await fetchNamedRoutine(latestWorkout.title);
    const updatedRoutineExercises = updateRoutineExercises(routine, latestWorkout);

    const updatedRoutine = {
        ...routine,
        exercises: updatedRoutineExercises,
    };

    if(process.env.DEBUG === undefined) {
        await putRoutine(updatedRoutine);
    }
    else {
        printRoutine(routine, latestWorkout, updatedRoutine);
    }
    log(`${updatedRoutine.title} routine updated.`);
};

