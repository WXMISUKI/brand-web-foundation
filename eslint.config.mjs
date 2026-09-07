import baseConfig from '@brand/config/eslint';

export default [
  ...baseConfig,
  {
    ignores: [
      'apps/cms/data/',
      'apps/cms/media/',
      'content/',
      'public/',
      '**/next-env.d.ts',
    ],
  },
];
