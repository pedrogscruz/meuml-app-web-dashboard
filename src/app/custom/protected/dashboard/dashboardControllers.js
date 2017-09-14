angular.module('meuml.protected.dashboard')

.controller('DashboardController', ['$mdToast', 'NotificationService', 'SellerDashboardService',
  'SellerDashboardSearchService',

  function($mdToast, NotificationService, SellerDashboardService, SellerDashboardSearchService) {
    var self = this;

    self.refreshing = false;

    self.refresh = function() {
      self.refreshing = true;

      $mdToast.show({
        hideDelay: 0,
        template: '<md-toast>Atualizando o dashboard...</md-toast>',
      });

      SellerDashboardService.refresh().then(function() {
        NotificationService.success('Dashboard atualizado');
      }, function(error) {
        NotificationService.error('Não foi possível atualizar o dashboard. Tente novamente ' +
            'mais tarde', error);
      }).finally(function() {
        self.refreshing = false;
        $mdToast.hide();
      });
    };
  }
])

;
