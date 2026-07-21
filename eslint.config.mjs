import pluginVue from 'eslint-plugin-vue';

export default [
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      'test/unit/coverage/*',
    ],
  },
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        __dirname: false,
        afterAll: false,
        afterEach: false,
        beforeAll: false,
        beforeEach: false,
        console: false,
        describe: false,
        document: false,
        expect: false,
        exports: false,
        google: false,
        it: false,
        jest: false,
        module: false,
        process: false,
        require: false,
        sinon: false,
        test: false,
        window: false,
      },
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          modules: true,
        },
      },
    },
    rules: {
      'array-bracket-spacing': [ 2, 'always' ],
      'comma-dangle': [ 2, 'always-multiline' ],
      'comma-spacing': [ 2, {
        before: false,
        after: true,
      } ],
      curly: [ 0, 'multi' ],
      'eol-last': 2,
      indent: [ 2, 2 ],
      'new-cap': 1,
      'no-caller': 2,
      'no-console': 1,
      'no-cond-assign': 0,
      'no-debugger': 2,
      'no-new': 0,
      'no-return-assign': 0,
      'no-underscore-dangle': 0,
      'no-use-before-define': 0,
      'object-curly-spacing': [ 2, 'always' ],
      quotes: [ 2, 'single', {
        allowTemplateLiterals: true,
      } ],
      semi: 2,
      strict: 0,
      'valid-typeof': 2,
      'vue/require-default-prop': 0,
      'wrap-iife': [ 2, 'inside' ],
    },
  },
];
