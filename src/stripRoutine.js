export const stripRoutine = (routine) => {
    return {
        title: routine.title,
        notes: routine.notes,
        exercises: routine.exercises.map(exercise => stripExercise(exercise))
    };
};