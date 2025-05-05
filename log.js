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

export const log = (message, level="log") => message !== undefined ?
        levels[level](message) :
        null;