module.exports = {

    collectCoverage: true,
    coverageDirectory: './codecov',
    coverageReporters: [
        'lcov',
        'text-summary'
    ],
    roots: [
        "<rootDir>/dist/src/",
        "<rootDir>/dist/test/"
    ],
    testEnvironment: 'node',
    coverageThreshold: {
		
		global: {
			
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90
			
		}
	}

};