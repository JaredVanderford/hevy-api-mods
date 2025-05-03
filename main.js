import { config } from 'dotenv';
import { progressiveOverloadJob } from './src/progressiveOverloadJob.js';
import cron from 'node-cron';

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