angular.module('gorillascode.protected')

.controller('ProtectedController', ['$rootScope', '$state', '$mdSidenav', 'AuthenticationService',
  'LocalUserService', 'user', 'plan', 'imagesStats',

  function($rootScope, $state, $mdSidenav, AuthenticationService, LocalUserService, user, plan,
           imagesStats) {

    var self = this;

    self.imagesStats = imagesStats;
    self.user = user;

    // Adiciona as informações do plano no objeto com a assinatura
    if (self.user.subscription) {
      self.user.subscription.plan = plan;
    }

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
