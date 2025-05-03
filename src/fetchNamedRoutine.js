import { apiCall } from "./hevyApiCall.js";

export const fetchNamedRoutine = async (name) => {
    var result = await apiCall( `routines?page=1&pageSize=5`, null, 'GET');
    if(result.status !== 200) throw 'Failed to get routine';
    const routineResults = await result.json();
    return routineResults.routines.filter(routine => routine.title === name)[0];    
};