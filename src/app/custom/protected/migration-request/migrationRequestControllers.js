angular.module('meuml.protected.migration-request')

.controller('MigrationRequestController', ['$window', 'NotificationService', 'MigrationService',
  'OAuthService', 'SellerAccountService', 'migrations',
  
  function($window, NotificationService, MigrationService, OAuthService, SellerAccountService,
           migrations) {

    var self = this;

    self.migrations = migrations;

    self.start = function(migration) {
      OAuthService.getCode(function(code) {
        SellerAccountService.add(code).then(function(account) {
          var parameters = {
            account_id: account.id,
            migration_id: migration.id,
          };

          MigrationService.processRequest(parameters).then(function(response) {
            migration.status = response.status;
          }, function(error) {
            NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
                'tarde.', error);
          });
        }, function(error) {
          NotificationService.error('Não foi possível adicionar a conta. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };
  }
])

;
