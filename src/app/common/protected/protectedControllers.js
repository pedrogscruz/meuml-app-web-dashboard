angular.module('gorillascode.protected')

.controller('ProtectedController', ['$state', '$mdSidenav', 'AuthenticationService',
  'LocalUserService', 'user',

  function($state, $mdSidenav, AuthenticationService, LocalUserService, user) {
    var self = this;

    self.user = user;

    self.toggleMenu = function() {
      $mdSidenav('sidenav-left').toggle();
    };

    self.logout = function() {
      AuthenticationService.logout().then(function() {
        $state.go('public.login');
      });
    };
  }
])

;
