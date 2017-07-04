angular.module('meuml.resources.migration', [
  'gorillascode.resource',
])

.factory('Migration', ['configuration', 'ResourceFactory',
  function (configuration, ResourceFactory) {
    return new ResourceFactory(configuration.apiUrl, 'seller/migration');
  }]
)

;