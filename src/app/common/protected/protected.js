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
        store: ['LocalUserService', 'ManagerStoreService', 'user',
          function(LocalUserService, ManagerStoreService, user) {
            // Retorna o estabelecimento gerenciado pelo usuário autenticado

            if (!LocalUserService.isUserInRole('manager', user)) {
              return null;
            }

            return ManagerStoreService.get('my');
          }
        ],
      }
    })
    ;
  }
])

;
