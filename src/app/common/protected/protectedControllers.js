angular.module('gorillascode.protected')

.controller('ProtectedController', ['$rootScope', '$state', '$mdSidenav', '$filter', 'moment',
  'AuthenticationService', 'LocalUserService', 'user', 'plan', 'imagesStats',

  function($rootScope, $state, $mdSidenav, $filter, moment, AuthenticationService, LocalUserService,
           user, plan, imagesStats) {

    var self = this;

    // Indica quais menus serão exibidos
    self.isVisible = {
      htmlEditor: false,
      images: false,
      imagesCount: false,
      plan: false,
      productCategory: false,
      templates: false,
    };

    self.imagesStats = imagesStats;
    self.subcriptionStatus = null;
    self.user = user;

    // Adiciona as informações do plano no objeto com a assinatura
    if (self.user.subscription) {
      var endDate = new Date(self.user.subscription.end_date + 'Z');
      var isTrial = false;

      if (self.user.subscription.end_date_trial) {
        isTrial = new Date(self.user.subscription.end_date_trial + 'Z') > new Date();
      }

      self.user.subscription.plan = plan;

      self.isVisible.htmlEditor = self.user.subscription.status != 'CANCELED';
      self.isVisible.images = self.user.subscription.status != 'CANCELED';
      self.isVisible.imagesCount = self.user.subscription.status != 'CANCELED';
      self.isVisible.plan = self.user.subscription.status != 'CANCELED';
      self.isVisible.productCategory = self.user.subscription.status != 'CANCELED';
      self.isVisible.templates = self.user.subscription.status != 'CANCELED';

      if (endDate < new Date()) {
        self.subcriptionStatus = 'Assinatura vencida';
      } else if (isTrial) {
        self.subcriptionStatus = 'Gratuito até ' +
            $filter('date')(self.user.subscription.end_date_trial, "d 'de' MMMM");
      } else if (self.user.subscription.status == 'ACTIVE') {
        self.subcriptionStatus = 'Vence ' + moment(endDate).fromNow();
      } else if (self.user.subscription.status == 'PENDING') {
        self.subcriptionStatus = 'Pagamento pendente';
      }
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
