const userStates = new Map();

function getUserState(userPhone) {
    return userStates.get(userPhone) || {stage: 'catalogView'};
}

function setUserState(userPhone, state) {
    userStates.set(userPhone, state);
}

function removeUserState(userPhone) {
    userStates.delete(userPhone);
}

export {getUserState, setUserState, removeUserState};
