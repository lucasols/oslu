import { cfgFlags, lsStackEslintCfg } from '@ls-stack/eslint-cfg';

const { OFF, WARN } = cfgFlags;

export default lsStackEslintCfg({
  tsconfigRootDir: import.meta.dirname, 
  rules: {
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-unsafe-assignment': OFF,
    'no-console': [WARN, { allow: ['info', 'clear', 'error'] }],
    '@typescript-eslint/require-await': OFF,
    '@typescript-eslint/no-unsafe-argument': OFF,
    '@typescript-eslint/no-unsafe-member-access': OFF,
    '@typescript-eslint/no-unsafe-return': OFF,
  },
});
