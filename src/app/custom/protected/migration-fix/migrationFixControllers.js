angular.module('meuml.protected.migration-fix')

.controller('MigrationFixController', ['NotificationService', 'MigrationService',
  function(NotificationService, MigrationService) {

    var self = this;

    // Indica se a correção foi iniciada
    self.fixStarted = false;

    self.fix = function() {
      self.fixStarted = true;

      MELI.login(function() {
        var token = MELI.getToken();

        if (!token) {
          NotificationService.error('Não foi possível recuperar o token. Tente novamente mais ' +
              'tarde.');
          return;
        }

        var parameters = {
          access_token: token,
          type: 'start_fix',
        };

        MigrationService.fix(parameters).then(function() {
          // Correção iniciada
        }, function(error) {
          self.fixStarted = false;
          NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };
  }
])

.controller('FixController', ['NotificationService', 'MigrationService',
  function(NotificationService, MigrationService) {

    var self = this;

    // Indica se a correção foi iniciada
    self.fixStarted = false;

    self.fix = function() {
      self.fixStarted = true;

      MELI.login(function() {
        var token = MELI.getToken();

        if (!token) {
          NotificationService.error('Não foi possível recuperar o token. Tente novamente mais ' +
              'tarde.');
          return;
        }

        var parameters = {
          access_token: token,
          type: 'start_fix_s3',
        };

        MigrationService.fix(parameters).then(function() {
          // Correção iniciada
        }, function(error) {
          self.fixStarted = false;
          NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };
  }
])

;
