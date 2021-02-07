module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.spec.json',
        },
    },
    transform: {
        '\\.ts$': '<rootDir>/lib/index.js',
    },
    testEnvironment: 'node',
    rootDir: '.',
    // setupFilesAfterEnv: ['<rootDir>/src/__helpers__/setup.ts'],
    testMatch: ['<rootDir>/source/**/*.spec.ts'],
    // testPathIgnorePatterns: ['<rootDir>/src/__mocks__/*'],
    collectCoverageFrom: [
        '<rootDir>/source/**/*.ts',
        '!<rootDir>/source/**/*.d.ts',
        '!<rootDir>/source/**/*.spec.ts',
        '!<rootDir>/source/**/*.test.ts',
        '!<rootDir>/source/**/__*__/*'
    ],
    // snapshotSerializers: ['<rootDir>/source/__serializers__/processed-source.ts'],
    cacheDirectory: '<rootDir>/.cache/unit',
};
