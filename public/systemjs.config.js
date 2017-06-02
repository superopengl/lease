/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    defaultJSExtensions: true,
    //use typescript for compilation
    transpiler: 'typescript',
    meta: {
      typescript: {
        format: 'global'
      }
    },
    //typescript compiler options
    typescriptOptions: {
      emitDecoratorMetadata: true
    },
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/',
      'unpkg:': 'https://unpkg.com/'
    },
    map: {
      // our app is within the app folder
      'app': './app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'ng2-cookies': 'npm:ng2-cookies',
      'angular2-qrcode': 'npm:angular2-qrcode/lib/angular2-qrcode.umd.js',
      'qrious': 'npm:qrious/dist/umd/qrious.js',
      'moment': 'npm:moment/min/moment.min.js',
      'angular2-qrscanner': 'npm:angular2-qrscanner/dist/index.js',
      '@ng-bootstrap/ng-bootstrap': 'node_modules/@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
      'typescript': 'npm:typescript/lib/typescript.js',
      'ng-bootstrap-form-generator': 'unpkg:ng-bootstrap-form-generator@0.1.1/src/index.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        defaultExtension: 'js',
        meta: {
          './*.js': {
            loader: 'systemjs-angular-loader.js'
          }
        }
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'ng2-cookies': {main: 'index', defaultExtension: 'js'},
    }
  });
})(this);
