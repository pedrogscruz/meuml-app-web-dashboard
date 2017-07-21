angular.module('meuml.protected.migration-fix')

.controller('MigrationFixController', ['NotificationService', 'MigrationService',
  function(NotificationService, MigrationService) {

    var self = this;

    // Indica se a correção foi iniciada
    self.fixStarted = false;

    self.fix = function() {
      MELI.login(function() {
        var token = MELI.getToken();

        if (!token) {
          NotificationService.error('Não foi possível recuperar o token. Tente novamente mais ' +
              'tarde.');
          return;
        }

        var parameters = {
          access_token: token,
        };

        MigrationService.fix(parameters).then(function() {
          self.fixStarted = true;
        }, function(error) {
          NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };
  }
])

;
