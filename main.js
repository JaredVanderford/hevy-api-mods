import { config } from 'dotenv';
import { progressiveOverloadJob } from './src/progressiveOverloadJob.js';
import cron from 'node-cron';
import { log, logLevels } from './log.js';

await config();
let isErrored = false;
let errorMessage = undefined;
if(process.env.API_KEY === undefined) {
    errorMessage = 'Your API_KEY is missing, please provide the Hevy API Key for you user to use this script.';
    isErrored = true;
}
if (process.env.BASE_URL === undefined) {
    errorMessage  = `${errorMessage ?? ''}\nPlease specify the current Hevy API Base URL`;
    isErrored = true;
}
if(isErrored){
    log(errorMessage, logLevels.error);
}

const runJob = async () => {
    try {
        await progressiveOverloadJob();
        log('Progressive overload job completed successfully');
    } catch (error) {
        log(`Error executing progressive overload job:\n ${error}`, logLevels.error);
    }
}

process.env.kgMultiplier = 0.45359237;
const { SCHEDULE: schedule } = process.env;
if( schedule !== undefined){
    cron.schedule('0 1 * * *', async () => {
       log(`Running progressive overload job at ${new Date().toISOString()}`);
        await runJob();
      });
      
      log(`Progressive overload cron job scheduled to run based on ${schedule}.`);
}
else {
    log('No schedule found in the environment file. Running once.', logLevels.info);
    await runJob();
}