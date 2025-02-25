module.exports = {
    testEnvironment: "jsdom", // For React DOM testing
    setupFilesAfterEnv: [ "<rootDir>/jest.setup.js" ],
    moduleFileExtensions: [ "js", "jsx" ],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest", // Use Babel to transform JS/JSX files
    },
    // Ensure Next.js files are processed correctly
    transformIgnorePatterns: [
        "/node_modules/",
        "^.+\\.module\\.(css|sass|scss)$",
    ],
};