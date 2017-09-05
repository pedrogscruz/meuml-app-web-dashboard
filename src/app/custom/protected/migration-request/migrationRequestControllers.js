angular.module('meuml.protected.migration-request')

.controller('MigrationRequestController', ['$window', 'NotificationService', 'MigrationService',
  'configuration', 'migrations',
  
  function($window, NotificationService, MigrationService, configuration, migrations) {
    var self = this;

    self.migrations = migrations;

    self.start = function(migration) {
      // Função que será chamada quando a pop-up aberta for fechada
      $window.oauthCallback = function(accessToken, refreshToken) {
        var parameters = {
          access_token: accessToken,
          refresh_token: refreshToken,
          migration_id: migration.id,
        };

        MigrationService.processRequest(parameters).then(function(response) {
          migration.status = response.status;
        }, function(error) {
          NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
              'tarde.', error);
        });
      };
      
      var authorizeUrl = configuration.apiUrl + '/_oauth/authorize';
      var height = 510;
      var width = 830;
      var left = parseInt((screen.availWidth - width) / 2);
      var top = parseInt((screen.availHeight - height) / 2);

      window.open(authorizeUrl, '', 'toolbar=no,status=no,location=yes,menubar=no,resizable=no,' +
          'scrollbars=no,width=' + width + ',height=' + height + ',left=' + left+ ',top=' + top +
          'screenX=' + left+ ',screenY=' + top);
    };
  }
])

;
