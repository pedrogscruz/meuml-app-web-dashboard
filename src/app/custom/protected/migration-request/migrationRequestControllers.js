angular.module('meuml.protected.migration-request')

.controller('MigrationRequestController', ['$window', 'NotificationService', 'MigrationService',
  'OAuthService', 'migrations',
  
  function($window, NotificationService, MigrationService, OAuthService, migrations) {
    var self = this;

    self.migrations = migrations;

    self.start = function(migration) {
      OAuthService.getToken(function(response) {
        var parameters = {
          access_token: response.accessToken,
          refresh_token: response.refreshToken,
          migration_id: migration.id,
        };

        MigrationService.processRequest(parameters).then(function(response) {
          migration.status = response.status;
        }, function(error) {
          NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };
  }
])

;
