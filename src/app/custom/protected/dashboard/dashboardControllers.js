angular.module('meuml.protected.dashboard')

.controller('DashboardController', ['$log', '$mdToast', 'NotificationService',
  'SellerDashboardService', 'SellerDashboardSearchService', 'accounts',

  function($log, $mdToast, NotificationService, SellerDashboardService,
           SellerDashboardSearchService, accounts) {

    var self = this;

    self.accounts = accounts;
    self.refreshing = false;
    self.selectedAccount = null;

    // Seleciona a primeira conta
    if (self.accounts.result.length) {
      self.selectedAccount = accounts.result[0];
    }

    self.changeFilters = function() {
      // TODO atualizar os gráficos para a nova conta
      $log.info('Conta selecionada: ' + self.selectedAccount.name);
    };

    self.refresh = function() {
      if (!self.selectedAccount) {
        return;
      }

      var parameters = {
        account_id: self.selectedAccount.id,
      };

      self.refreshing = true;

      $mdToast.show({
        hideDelay: 0,
        template: '<md-toast>Atualizando o dashboard...</md-toast>',
      });

      SellerDashboardService.refresh(parameters).then(function() {
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
