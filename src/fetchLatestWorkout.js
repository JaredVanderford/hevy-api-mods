import { apiCall } from "./hevyApiCall.js";

export const fetchLatestWorkout = async () => {
    var result = await apiCall(`workouts?page=1&pageSize=5`, null, 'GET');
    if(result.status !== 200) throw 'Failed to get latest workout';
    const workoutResults = await result.json();
    return workoutResults.workouts[0];
};