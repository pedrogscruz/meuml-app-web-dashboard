angular.module('gorillascode.protected')

.controller('ProtectedController', ['$log', '$state', '$mdSidenav', 'AuthenticationService',
  'LocalUserService', 'SellerImageTagSearchService', 'user',

  function($log, $state, $mdSidenav, AuthenticationService, LocalUserService,
           SellerImageTagSearchService, user) {
    var self = this;

    self.user = user;
    self.imageTags = {};

    function searchImageTags() {
      $log.debug('Listando todas as tags');

      SellerImageTagSearchService.search().then(function(response) {
        $log.debug('Tags listadas');
        self.imageTags = response;
      }, function(error) {
        NotificationService.error('Não foi possível listar as tags', error);
      });
    }

    self.toggleMenu = function() {
      $mdSidenav('sidenav-left').toggle();
    };

    self.logout = function() {
      AuthenticationService.logout().then(function() {
        $state.go('public.login');
      });
    };

    searchImageTags();
  }
])

;
