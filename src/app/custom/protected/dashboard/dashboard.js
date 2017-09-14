angular.module('meuml.protected.dashboard', [
  'meuml.services.dashboard',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.dashboard', {
      url: '/dashboard',
      controller: 'DashboardController as dashboardCtrl',
      templateUrl: 'custom/protected/dashboard/dashboard.tpl.html',
      data: {
        pageTitle: 'Dashboard',
      },
    });
  }
])

;
