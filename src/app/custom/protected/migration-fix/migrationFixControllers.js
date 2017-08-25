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

.controller('FixController', ['$window', '$http', 'NotificationService', 'MigrationService', 'MigrationSearchService', 'LocalUserService',
  function($window, $http, NotificationService, MigrationService, MigrationSearchService, LocalUserService) {

    var self = this;

    // Indica se a correção foi iniciada
    self.fixStarted = false;

    self.migrations = {};

    var parameters = {
      q: {
        filters: [{
          name: 'status',
          op: '==',
          val: 'REQUEST',
        }],
      }
    };

    MigrationSearchService.search(parameters).then(function(response) {
      self.migrations = response;
      console.log(self.migrations);
    }, function() {
      // exibir mensagem de erro
    });

    self.fix = function(migration) {
      $window.mlCallback = function(accessToken, refreshToken) {
        var authenticationToken = LocalUserService.getAuthenticationToken();
        $http.get('https://meuml.herokuapp.com/start_fix_s3?access_key=' + accessToken + '&refresh_token=' + refreshToken + '&migration_id=' + migration.id + '&authentication_token=' + authenticationToken);
      };

      migration.total = 10;

      window.open('https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=2075293406712364', 'juliano', 'outerWidth=600,width=500,innerWidth=400,resizable,scrollbars,status');
    };
  }
])

;
