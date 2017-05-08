angular.module('meuml.protected.home', [
  'ui.router'
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.home', {
      url: '/',
      template: 'custom/protected/home/home.tpl.html',
      data: {
        pageTitle: ''
      }
    });
  }
])

;

