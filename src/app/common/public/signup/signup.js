angular.module('gorillascode.signup', [
  'ui.router'
])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('public.signup', {
      url: '/signup?continue',
      controller: 'SignupController as signupCtrl',
      templateUrl: 'common/public/signup/signup.tpl.html',
      data: {
        pageTitle: 'Cadastro'
      }
    });
  }
])

;

