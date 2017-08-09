angular.module('meuml.protected.migration-fix', [
  'meuml.services.migration',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.migration-fix', {
      url: '/migration/fix',
      controller: 'MigrationFixController as migrationFixCtrl',
      templateUrl: 'custom/protected/migration-fix/migration-fix.tpl.html',
      data: {
        pageTitle: 'Corretor de anúncios',
      },
    });
  }
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.fix', {
      url: '/fix',
      controller: 'FixController as fixCtrl',
      templateUrl: 'custom/protected/migration-fix/fix.tpl.html',
      data: {
        pageTitle: 'Resolver pendências',
      },
    });
  }
])

;
