angular.module('gorillascode.protected')

.controller('ProtectedController', ['$rootScope', '$state', '$mdSidenav', '$mdTheming',
  'AuthenticationService', 'LocalUserService', 'user', 'store',

  function($rootScope, $state, $mdSidenav, $mdTheming, AuthenticationService, LocalUserService,
           user, store) {

    var self = this;

    self.store = store;
    self.user = user;

    // Papeis dos usuários
    self.isUserAdmin = LocalUserService.isUserInRole('admin', user);
    self.isUserInstitution = LocalUserService.isUserInRole('institution', user);
    self.isUserManager = LocalUserService.isUserInRole('manager', user);

    self.toggleMenu = function() {
      $mdSidenav('sidenav-left').toggle();
    };

    self.logout = function() {
      AuthenticationService.logout().then(function() {
        changeTheme('default');
        $state.go('public.login');
      });
    };

    if (self.isUserAdmin) {
      changeTheme('admin');
    } else if (self.isUserInstitution) {
      changeTheme('institution');
    }

    function changeTheme(theme) {
      $rootScope.theme = theme;
      $mdTheming.setBrowserColor({ theme: theme });
    }
  }
])

;
