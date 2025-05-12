import fs from 'fs/promises';
import path from 'path';

const levels = {
    "info": console.info,
    "log": console.log,
    "warn": console.warn,
    "error": (message) => {
        console.error(message);
        throw message;
    }
}

export const logLevels = {
    "info": "info",
    "log": "log",
    "warn": "warn",
    "error": "error"
};

export const fileLog = async (route, body, method) => {
    const logsDir = './logs';
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `${today}.json`);
    
    try {
        // Ensure logs directory exists
        await fs.mkdir(logsDir, { recursive: true });
        
        // Read existing logs or initialize empty array
        let logs = [];
        try {
            const existingData = await fs.readFile(logFile, 'utf-8');
            logs = JSON.parse(existingData);
        } catch (error) {
            // File doesn't exist or is invalid JSON, start with empty array
        }
        
        // Add new log entry
        logs.push({
            timestamp: new Date().toISOString(),
            route,
            body,
            method
        });
        
        // Write back to file
        await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error('Failed to write log:', error);
    }
}
export const log = (message, level="log") => message !== undefined ?
        levels[level](message) :
        null;


        