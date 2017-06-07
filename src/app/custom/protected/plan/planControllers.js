angular.module('meuml.protected.plan')

.controller('PlanListController', ['$log', '$mdDialog', 'NotificationService',
  'SellerPlanService', 'plans',

  function($log,$mdDialog, NotificationService, SellerPlanService, plans) {
    var self = this;

    self.plans = plans;

    self.subscribe = function(plan) {
      SellerPlanService.subscribe(plan.id).then(function() {
        NotificationService.info('Plano alterado');
      }, function(error) {
        NotificationService.error('Não foi possível alterar o plano. Tente novamente mais ' +
            'tarde.', error);
      });
    };
  }
])

;
