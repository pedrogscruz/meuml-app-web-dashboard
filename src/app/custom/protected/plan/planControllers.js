angular.module('meuml.protected.plan')

.controller('PlanListController', ['$log', '$state', '$window', '$mdDialog',
  'NotificationService', 'LocalUserService', 'SellerSubscriptionService', 'SellerImageService',
  'plans',

  function($log, $state, $window, $mdDialog, NotificationService, LocalUserService,
           SellerSubscriptionService, SellerImageService, plans) {

    var self = this;
    var user = LocalUserService.getUser();

    self.plans = plans;

    self.subscribe = function(plan, ev) {
      var imagesCount = SellerImageService.getStats().count;
      var title = 'Alterar assinatura';

      if (imagesCount > plan.max_images) {
        var alert = $mdDialog.alert()
          .title(title)
          .textContent('Você deve excluir algumas imagens para poder alterar o plano')
          .targetEvent(ev)
          .ok('Ok');

        $mdDialog.show(alert);

        return;
      }

      var confirm = $mdDialog.confirm()
        .title(title)
        .textContent('Você será direcionado para o pagamento no MercadoPago')
        .targetEvent(ev)
        .ok('Continuar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function() {
        var subscriptionToSave = {
          plan_id: plan.id,
        };

        SellerSubscriptionService.save(subscriptionToSave).then(function(subscription) {
          $log.info('Plano alterado');

          // Se a transação não foi aprovada automaticamente então exibe a tela de pagamento
          if (subscription.external_data.status == 'pending') {
            self.paySubscription(subscription.external_data.init_point);
          } else {
            // Atualiza as informações da assinatura do usuário autenticado
            user.subscription = subscription;

            NotificationService.success('Plano alterado');
          }
        }, function(error) {
          NotificationService.error('Não foi possível alterar o plano. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };

    /**
     * Exibe a tela de pagamento do MercadoPago.
     */
    self.paySubscription = function(paymentUrl) {
      paymentUrl = paymentUrl || user.subscription.external_data.init_point;
      $window.location = paymentUrl;
    };
  }
])

;
