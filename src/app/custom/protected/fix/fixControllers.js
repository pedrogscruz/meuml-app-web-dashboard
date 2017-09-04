angular.module('meuml.protected.fix')

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

.controller('FixController', ['$window', 'NotificationService', 'MigrationService',
  'MigrationSearchService', 'configuration', 'migrations',
  
  function($window, NotificationService, MigrationService, MigrationSearchService, configuration,
           migrations) {

    var self = this;

    // Indica se a correção foi iniciada
    self.fixStarted = false;

    self.migrations = migrations;

    self.start = function(migration) {
      // Função que será chamada quando a pop-up aberta for fechada
      $window.oauthCallback = function(accessToken, refreshToken) {
        var authenticationToken = LocalUserService.getAuthenticationToken();
        $http.get('https://meuml.herokuapp.com/start_fix_s3?access_key=' + accessToken + '&refresh_token=' + refreshToken + '&migration_id=' + migration.id + '&authentication_token=' + authenticationToken);
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
