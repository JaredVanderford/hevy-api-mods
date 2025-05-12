
export const calculateWeight = (weight_kg, increment = 0) => {
    const { KG_MULTIPLIER: kgMultiplier, USE_LBS: useLbs } = process.env;
    const outWeight = weight_kg + (increment * (useLbs !== undefined ? kgMultiplier : 1));
    return Number((Math.round(outWeight * 100000) / 100000).toFixed(5));
};
export const warmupWeight = (weight) => weight * .5;
export const convertWeight = (weight) => {
    const { KG_MULTIPLIER: kgMultiplier, USE_LBS: useLbs } = process.env;
    return Number(Math.round((weight/(useLbs ? kgMultiplier : 1)*100)/100).toFixed(2));
};

export const formatWeight = (weight) => Number((Math.round(weight * 100000) / 100000).toFixed(5));