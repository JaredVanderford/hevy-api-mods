import { afterEach, assert, beforeAll, beforeEach, describe, it, vi } from "vitest";
import { calculateWeight, warmupWeight } from "./weightCalcs";

const kgMultiplier = 0.45359237

describe('weightCalcs', () => {
    beforeEach(() => {
        vi.stubEnv('KG_MULTIPLIER', kgMultiplier)
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    })

    describe("calculateWeight", () => {
        it("adds the expected increment in lbs when USE_LBS is set", () => {
            vi.stubEnv('USE_LBS', true);
            assert.equal(calculateWeight(1,1), 1+kgMultiplier);
        });

        it("adds the expected increment in kgs when USE_LBS is not set", () => {
            assert.equal(calculateWeight(1,1), 2);
        });
    });

    describe("warmupWeight", () =>{
        it("Returns half the weight for warm up weight", () => {
            assert.equal(warmupWeight(2),1);
        })
    });
});