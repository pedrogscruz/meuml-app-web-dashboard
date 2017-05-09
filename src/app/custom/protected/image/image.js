angular.module('meuml.protected.image', [
  'gorillascode.services.file',
  'meuml.services.image',
  'ui.router',
])

.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('protected.image', {
      url: '/image',
      abstract: true,
      template: '<ui-view/>'
    }).state('protected.image.list', {
      url: '?order',
      controller: 'ImageListController as imageListCtrl',
      templateUrl: 'custom/protected/image/image-list.tpl.html',
      data: {
        pageTitle: 'Imagens'
      },
      params: {
        order: {
          squash: true,
          value: '-created_at',
        },
      },
    });
  }
])

;
