import { getUserState, setUserState } from "./state_manager.mjs";

describe("State Manager", () => {
    it("should get the default user state if the user state is not set", () => {
        const userPhone = "972587143224@c.us";
        const defaultState = { stage: "start" };
        const state = getUserState(userPhone);

        expect(state).toEqual(defaultState);
    });

    it("should set and get the user state correctly", () => {
        const userPhone = "972587143224@c.us";
        const newState = { stage: "product_selection", selectedProductId: "1" };

        setUserState(userPhone, newState);
        const state = getUserState(userPhone);

        expect(state).toEqual(newState);
    });

    it("should not affect other user states when setting a user state", () => {
        const userPhone1 = "972587143224@c.us";
        const userPhone2 = "972587210364@c.us";
        const newState1 = { stage: "product_selection", selectedProductId: "1" };
        const newState2 = { stage: "checkout", selectedProductId: "2" };

        setUserState(userPhone1, newState1);
        setUserState(userPhone2, newState2);

        const state1 = getUserState(userPhone1);
        const state2 = getUserState(userPhone2);

        expect(state1).toEqual(newState1);
        expect(state2).toEqual(newState2);
    });
});
