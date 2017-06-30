angular.module('meuml.protected.migration', [
  'meuml.services.migration',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.migration', {
      url: '/tools',
      controller: 'MigrationController as migrationCtrl',
      templateUrl: 'custom/protected/migration/migration.tpl.html',
      data: {
        pageTitle: 'Ferramentas',
      },
      resolve: {
        lastMigration: ['MigrationSearchService', function (MigrationSearchService) {
          var parameters = {
            q: {
              order_by: [{
                field: 'created_at',
                direction: 'desc',
              }],
            },
            results_per_page: 1,
          };

          return MigrationSearchService.search(parameters).then(function(response) {
            if (response.result.length) {
              return response.result[0];
            }

            return null;
          });
        }],
      },
    });
  }
])

;
