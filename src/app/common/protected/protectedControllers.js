angular.module('gorillascode.protected')

.controller('ProtectedController', ['$rootScope', '$state', '$mdSidenav', 'AuthenticationService',
  'LocalUserService', 'user',

  function($rootScope, $state, $mdSidenav, AuthenticationService, LocalUserService, user) {
    var self = this;

    self.user = user;

    self.toggleMenu = function() {
      $mdSidenav('sidenav-left').toggle();
    };

    self.logout = function() {
      AuthenticationService.logout().then(function() {
        $rootScope.$broadcast('userLogout');
        $state.go('public.login');
      });
    };
  }
])

;
