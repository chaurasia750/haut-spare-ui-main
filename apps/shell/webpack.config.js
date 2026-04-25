import tsconfig from '../../../tsconfig.json';

module.exports = async () => {
  // Dynamically require the @nx/angular/webpack configuration function
  const withModuleFederation = (await import('@nx/angular/module-federation')).withModuleFederation;
  const config = await withModuleFederation(require('./module-federation.config.js'));

  return config;
};
