import { apiCall } from "./hevyApiCall.js";
import { stripRoutine } from "./stripObjects.js";

export const putRoutine = async (routine) => {
    var result = await apiCall(`routines/${routine.id}`, {routine: stripRoutine(routine)}, 'PUT', {"Content-Type": 'application/json'});
    if(result.status !== 200) throw "Failed to Update routine";
};