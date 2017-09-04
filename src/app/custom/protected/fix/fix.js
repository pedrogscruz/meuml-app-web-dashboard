angular.module('meuml.protected.fix', [
  'meuml.services.migration',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.fix', {
      url: '/fix',
      controller: 'FixController as fixCtrl',
      templateUrl: 'custom/protected/fix/fix.tpl.html',
      data: {
        pageTitle: 'Pendências para resolver',
      },
      resolve: {
        migrations: ['MigrationSearchService', function(MigrationSearchService) {
          var parameters = {
            q: {
              filters: [{
                name: 'status',
                op: '==',
                val: 'REQUEST',
              }],
            },
            results_per_page: 10,
          };

          return MigrationSearchService.search(parameters);
        }],
      },
    });
  }
])

;
