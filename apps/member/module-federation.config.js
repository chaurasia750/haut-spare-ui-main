module.exports = {
  name: 'member',
  filename: 'remoteEntry.js',
  exposes: {
    './Module': 'apps/member/src/app/module.ts',
  },
  remotes: {},
  shared: {
    '@angular/core': {
      singleton: true,
      strictVersion: false,
      requiredVersion: '^15.0.0',
    },
    '@angular/common': {
      singleton: true,
      strictVersion: false,
      requiredVersion: '^15.0.0',
    },
    '@angular/router': {
      singleton: true,
      strictVersion: false,
      requiredVersion: '^15.0.0',
    },
    rxjs: {
      singleton: true,
      strictVersion: false,
      requiredVersion: '^7.0.0',
    },
    '@haut-spare/shared-ui': { singleton: true, strictVersion: false },
    '@haut-spare/shared-auth': { singleton: true, strictVersion: false },
    '@haut-spare/data-access-api': { singleton: true, strictVersion: false },
  },
};
