module.exports = function (wallaby) {

    return {
        files: [
            'src/*.ts',
        ],
        tests: [
            'test/*.ts'
        ],
        env: {
            type: 'node'
        },
        lowCoverageThreshold: 90,
        testFramework: "jest",
        reportConsoleErrorAsErrors: true,
        reportUnhandledPromises: true,
        //Root project tsconfig.json transpiles to ES Modules which are not supported by Jest natively
        //We change only that option here to commonjs to allow test execution without hassle
        compilers: {
            '**/*.ts': wallaby.compilers.typeScript({
                module: 'commonjs'
            })
        },
        runMode: 'onsave'
    };
};