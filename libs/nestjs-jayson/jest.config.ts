/* eslint-disable */
const nxPreset = require('@nx/jest/preset').default;

export default {
  displayName: 'nestjs-jayson',
  preset: nxPreset,
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage/',
};
