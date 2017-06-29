angular.module('meuml.services.migration', [
  'meuml.resources.migration'
])

.factory('MigrationService', ['Migration',
  function(Migration) {
    var service = {
      save: function(migration) {
        if (migration.id) {
          return Migration.patch(migration).$promise;
        } else {
          return Migration.save(migration).$promise;
        }
      },
    };

    return service;
  }
])

.factory('MigrationSearchService', ['Migration',
  function(Migration) {
    var service = {
      search: function(parameters) {
        return Migration.query(parameters).$promise;
      },
    };

    return service;
  }
])

;