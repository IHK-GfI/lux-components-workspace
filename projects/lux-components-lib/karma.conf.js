// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'viewport'],
    viewport: {
      breakpoints: [
        {
          name: 'mobile',
          size: {
            width: 320,
            height: 480
          }
        },
        {
          name: 'tablet',
          size: {
            width: 768,
            height: 1024
          }
        },
        {
          name: 'screen',
          size: {
            width: 1440,
            height: 900
          }
        }
      ]
    },
    captureTimeout: 30000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout: 30000,
    browserNoActivityTimeout: 30000,
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('@chiragrupani/karma-chromium-edge-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-viewport'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    files: [
      '../../dist/theme/prebuilt-themes/luxtheme-authentic.css',
      '../../dist/theme/prebuilt-themes/luxtheme-authentic-min.css',
      '../../dist/theme/prebuilt-themes/luxtheme-green.css',
      '../../dist/theme/prebuilt-themes/luxtheme-green-min.css'
    ],
    viewport: {
      breakpoints: [
        {
          name: 'mobile',
          size: {
            width: 320,
            height: 480
          }
        },
        {
          name: 'tablet',
          size: {
            width: 768,
            height: 1024
          }
        },
        {
          name: 'desktop',
          size: {
            width: 1440,
            height: 900
          }
        }
      ]
    },
    types: ['karma-viewport'],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './../../dist/lux-components-lib-coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
      check: {
        global: {
          statements: 60,
          branches: 50,
          functions: 60,
          lines: 60
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // Für die Karmatests stehen die folgenden Browser zur Verfügung:
    // browsers: ['Chrome', 'Firefox', 'Edge', 'Safari'],
    browsers: ['Chrome'],
    singleRun: false
  });
};
