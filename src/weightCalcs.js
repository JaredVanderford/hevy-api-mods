
export const calculateWeight = (weight_kg, increment = 0) => {
    const { KG_MULTIPLIER: kgMultiplier, USE_LBS: useLbs } = process.env;
    return weight_kg + (increment * (useLbs !== undefined ? kgMultiplier : 1));
};
export const warmupWeight = (weight) => weight * .5;