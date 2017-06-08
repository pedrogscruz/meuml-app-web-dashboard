angular.module('meuml.protected.plan')

.controller('PlanListController', ['$log', '$mdDialog', 'NotificationService', 'LocalUserService',
  'SellerSubscriptionService', 'plans',

  function($log,$mdDialog, NotificationService, LocalUserService, SellerSubscriptionService,
           plans) {

    var self = this;

    self.plans = plans;

    self.subscribe = function(plan, ev) {
      var title = 'Alterar assinatura';

      var confirm = $mdDialog.confirm()
        .title(title)
        // .htmlContent('Ao alterar para o plano <strong>' + plan.name + '</strong>')
        .ariaLabel(title)
        .targetEvent(ev)
        .ok('Continuar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function() {
        var subscriptionToSave = {
          plan_id: plan.id,
        };

        SellerSubscriptionService.save(subscriptionToSave).then(function(subscription) {
          $log.info('Plano alterado');

          // Atualiza as informações da assinatura do usuário autenticado
          LocalUserService.getUser().subscription = subscription;

          self.paySubscription();
        }, function(error) {
          NotificationService.error('Não foi possível alterar o plano. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };

    self.paySubscription = function() {
      var user = LocalUserService.getUser();

      // Exibe o modal para fazer o pagamento
      $MPC.openCheckout({
        url: user.subscription.external_data.init_point,
        mode: 'modal',
        onreturn: function(data) {
          console.log(data);
        },
      });
    };
  }
])

;
