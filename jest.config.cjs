// jest.config.cjs
module.exports = {
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)",
        "**/?(*.)+(spec|test).mjs",
    ],
    moduleFileExtensions: ["js", "mjs"],
    transform: {
        "^.+\\.(js|mjs)$": "babel-jest",
    },
};
