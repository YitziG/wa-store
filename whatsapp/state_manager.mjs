const userStates = new Map();

function getUserState(userPhone) {
    return userStates.get(userPhone) || {stage: 'start'};
}

function setUserState(userPhone, state) {
    userStates.set(userPhone, state);
}

export {getUserState, setUserState};
