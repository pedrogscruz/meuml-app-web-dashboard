angular.module('meuml.services.migration', [
  'meuml.resources.migration'
])

.factory('MigrationService', ['Migration', 'MigrationFix', 'MigrationRestart',
  function(Migration, MigrationFix, MigrationRestart) {
    var service = {
      save: function(migration) {
        if (migration.id) {
          return Migration.patch(migration).$promise;
        } else {
          return Migration.save(migration).$promise;
        }
      },
      fix: function(parameters) {
        return MigrationFix.save(parameters).$promise;
      },
      restart: function(migration) {
        return MigrationRestart.save(migration).$promise;
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
      getLastMigration: function() {
        var parameters = {
          q: {
            order_by: [{
              field: 'created_at',
              direction: 'desc',
            }],
          },
          results_per_page: 1,
        };

        return Migration.query(parameters).$promise.then(function(response) {
          return response.result.length ? response.result[0] : null;
        });
      },
    };

    return service;
  }
])

;