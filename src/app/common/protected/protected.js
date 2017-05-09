angular.module('gorillascode.protected', [
  'gorillascode.change-password',
  'gorillascode.my-account',
  'ui.router'
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected', {
      abstract: true,
      url: '',
      controller: 'ProtectedController as protectedCtrl',
      templateUrl: 'common/protected/protected.tpl.html',
      resolve: {
        user: ['$rootScope', '$state', 'AuthenticationService', 'LocalUserService',
          function($rootScope, $state, AuthenticationService, LocalUserService) {
            // Verifica se o usuário está logado. Se não estiver então redireciona para o login.
            return AuthenticationService.getLoggedUser().then(function(user) {
              LocalUserService.setUser(user);
              return user;
            }, function() {
              var continueTo = encodeURIComponent($rootScope.continueTo);
              $state.go('public.login', { 'continue': continueTo });
            });
          }
        ],
      }
    })
    ;
  }
])

;
