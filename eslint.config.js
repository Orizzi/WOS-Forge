// ESLint flat config (v9+) for WOS Calculator
// Enforces IIFE pattern, browser globals, and project conventions

export default [
  {
    files: ['src/Scripts/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        requestAnimationFrame: 'readonly',
        getComputedStyle: 'readonly',
        location: 'readonly',
        module: 'readonly',
        
        // Known module globals (IIFE pattern exposes these)
        CalculatorModule: 'readonly',
        ChiefGearCalculator: 'readonly',
        FireCrystalsCalculator: 'readonly',
        PetsCalculator: 'readonly',
        ProfilesModule: 'readonly',
        ThemeModule: 'readonly',
        TableSortModule: 'readonly',
        IconHelper: 'readonly',
        DataLoader: 'readonly',
        I18n: 'readonly',
        ErrorHandler: 'readonly',
        InputValidation: 'readonly',
        WarLabProfile: 'readonly',
        WOSCalcCore: 'readonly'
      }
    },
    rules: {
      // Code quality
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-const-assign': 'error',
      'prefer-const': 'warn',
      
      // Best practices
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      'no-var': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-alert': 'warn',
      
      // Style (relaxed to match existing codebase)
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'no-trailing-spaces': 'warn',
      'comma-dangle': ['warn', 'never'],
      'no-multiple-empty-lines': ['warn', { max: 2 }],
      
      // Accessibility helpers
      'no-console': 'off' // We use console for debugging
    }
  },
  {
    // Node.js scripts (build/extract)
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly'
      }
    }
  },
  {
    // Ignore patterns
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/service-worker.min.js',
      '**/*.min.js'
    ]
  }
];
