export const getDefaults = () => {
    const {
        DEFAULT_REP_MAX: repRangeMax, 
        DEFAULT_REP_MIN: repRangeMin, 
        DEFAULT_REST_SECONDS: rest_seconds,
        DEFAULT_WEIGHT_INCREMENT: weightIncrement
    } = process.env;
    
    return {
        repRangeMax: repRangeMax ?? 12, 
        repRangeMin: repRangeMin ?? 6, 
        rest_seconds: rest_seconds ?? 90, 
        weightIncrement: weightIncrement ?? 5
    };
};