angular.module('meuml.resources.migration', [
  'gorillascode.resource',
])

.factory('Migration', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/migration');
  }]
)

.factory('MigrationFix', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/migration/_fix');
  }]
)

.factory('MigrationRestart', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/migration/_restart');
  }]
)

;