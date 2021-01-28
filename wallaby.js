module.exports = function (wallaby) {

    return {
        files: [
            'src/index.ts',
            'jest.config.js'
        ],
        tests: [
            'test/test.ts'
        ],
        env: {
            type: 'node'
        },
        lowCoverageThreshold: 90,
        testFramework: "jest",
        reportConsoleErrorAsErrors: true,
        reportUnhandledPromises: true,
        //Project root tsconfig.json transpiles to ES Modules which are not supported by Jest natively
        //We change only that option here to commonjs to allow test execution without hassle
        compilers: {
            '**/*.ts': wallaby.compilers.typeScript({
                module: 'commonjs',
            })
        },
        setup: function(wallaby) {

            const settings = require('./jest.config');

            //Project root jest.config.js points to the dist/ folder where the TypeScript output is
            //Because Wallaby.js changes the compilation output folder we have to reset the Jest roots
            //This allows test execution in the Wallaby.js env.
            settings.roots = [
                "<rootDir>/src/",
                "<rootDir>/test/"
            ];

            wallaby.testFramework.configure(settings);

        },
        runMode: 'onsave',
    };
};