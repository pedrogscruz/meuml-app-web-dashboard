angular.module('gorillascode.signup')

.controller('SignupController', ['$log', 'NotificationService', 'AuthenticationService',

  function ($log, NotificationService, AuthenticationService) {
    var self = this;

    self.user = {};
    self.waitForSubmit = false;

    self.signUp = function () {
      if (!self.waitForSubmit) {
        self.waitForSubmit = true;
      }

      $log.info('Cadastrando o usuário');

      AuthenticationService.createUser(self.user).then(function(response) {
        if (!response.response.errors) {
          $log.info('Cadastro finalizado');
          AuthenticationService.login(self.user.email, self.user.password, true);
        }
      }, function (error) {
        NotificationService.error('Não foi possível fazer o cadastro. Tente novamente mais ' +
          'tarde.', error);
      }).finally(function() {
        self.waitForSubmit = false;
      });
    };
  }
])

;
