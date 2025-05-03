import { fetchLatestWorkout } from "./fetchLatestWorkout.js";
import { fetchNamedRoutine } from "./fetchNamedRoutine.js";
import { updateRoutineExercises } from "./updateRoutinexercises.js";
import { putRoutine } from "./putRoutine.js";

export const progressiveOverloadJob = async () => {

    const latestWorkout  = await fetchLatestWorkout();

    const routine = await fetchNamedRoutine(latestWorkout.title);
    const updatedRoutineExercises = updateRoutineExercises(routine, latestWorkout);

    const updatedRoutine = {
        ...routine,
        exercises: updatedRoutineExercises,
    };

    await putRoutine(updatedRoutine);
    console.log(`${updatedRoutine.title} routine updated.`);
};