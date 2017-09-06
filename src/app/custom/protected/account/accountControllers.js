angular.module('meuml.protected.account')

.controller('AccountListController', ['$scope', '$controller', '$mdDialog', 'NotificationService',
  'SellerAccountService', 'SellerAccountSearchService',

  function($scope, $controller, $mdDialog, NotificationService, SellerAccountService,
           SellerAccountSearchService) {

    var self = this;

    self.filters = {};
    self.order = 'email';
    self.accounts = {};

    $controller('PaginationController', {
      $scope: $scope,
      self: this,
      list: self.accounts,
      searchFunction: search
    });

    /**
     * Faz a pesquisa.
     *
     * @param paginationParameters os parâmetros da paginação.
     * @returns uma promise para a pesquisa.
     */
    function search(paginationParameters) {
      var searchParameters = createSearchParameters();
      angular.extend(searchParameters, paginationParameters);

      return SellerAccountSearchService.search(searchParameters);
    }

    /**
     * Monta os parãmetros da pesquisa a partir dos parâmetros informados na URL.
     *
     * @returns os parâmetros para fazer a pesquisa.
     */
    function createSearchParameters() {
      var searchParameters = {
        q: {
          filters: [],
          order_by: [],
        },
        results_per_page: 20,
      };

      searchParameters.q.order_by.push({
        field: 'email',
        direction: 'asc',
      });

      return searchParameters;
    }

    self.delete = function(account, index, ev) {
      var prompt = $mdDialog.confirm()
        .title('Excluir a conta?')
        .ariaLabel('Excluir a conta?')
        .textContent(account.email)
        .targetEvent(ev)
        .ok('Excluir')
        .cancel('Cancelar');

      $mdDialog.show(prompt).then(function() {
        SellerAccountService.delete(account.id).then(function() {
          NotificationService.success('Conta excluída');
          self.accounts.result.splice(index);
        }, function(error) {
          NotificationService.error('Não foi possível excluir a conta. Tente novamente mais ' +
              'tarde.', error);
        });
      });
    };

    self.loadMore();
  }
])

;
