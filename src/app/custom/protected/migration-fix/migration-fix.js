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
        pageTitle: 'Corretor de imagens duplicadas',
      },
    });
  }
])

;
