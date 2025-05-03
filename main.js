import { config } from 'dotenv';
import { progressiveOverloadJob } from './src/progressiveOverloadJob.js';
import cron from 'node-cron';
let isErrored = false;
if(process.env.API_KEY === undefined) {
    console.error('Your API_KEY is missing, please provide the Hevy API Key for you user to use this script.');
    isErrored = true;
}
if (process.env.BASE_URL === undefined) {
    console.error('Please specify the current Hevy API Base URL');
    isErrored = true;
}
if(isErrored){
    throw 'Failed to start check the console for errors';
}

const runJob = async () => {
    try {
        await progressiveOverloadJob();
        console.log('Progressive overload job completed successfully');
    } catch (error) {
        console.error('Error executing progressive overload job:', error);
    }
}

await config();
process.env.kgMultiplier = 0.45359237;
const { SCHEDULE: schedule } = process.env;
if( schedule !== undefined){
    cron.schedule('0 1 * * *', async () => {
        console.log(`Running progressive overload job at ${new Date().toISOString()}`);
        await runJob();
      });
      
      console.log(`Progressive overload cron job scheduled to run based on ${schedule}.`);
}
else {
    console.info('No schedule found in the environment file. Running once.');
    await runJob();
}