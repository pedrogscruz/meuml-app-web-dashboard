angular.module('meuml.protected.image')

.controller('ImageListController', ['$scope', '$controller', '$state', '$stateParams',
  'NotificationService', 'FileService', 'SellerImageService', 'SellerImageSearchService',

  function($scope, $controller, $state, $stateParams, NotificationService, FileService,
           SellerImageService, SellerImageSearchService) {

    var self = this;

    // Filtros passados como parâmetros na URL
    self.filters = {};

    self.images = {};
    self.order = $stateParams.order;

    $controller('PaginationController', {
      $scope: $scope,
      self: this,
      list: self.images,
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

      return SellerImageSearchService.search(searchParameters);
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
      };

      if ($stateParams.order) {
        var fieldName = self.order.replace('-', '');
        var fieldDirection = (self.order[0] == '-') ? 'desc' : 'asc';

        searchParameters.q.order_by.push({
          field: fieldName,
          direction: fieldDirection
        });
      }

      return searchParameters;
    }

    /**
     * Altera os parâmetros da URL usando os valores informados nos filtros.
     */
    self.changeFilters = function() {
      $state.go('.', {});
    };

    /**
     * Altera o parâmetro de ordenação da URL.
     *
     * @param order o parãmetro usado para ordenação.
     */
    self.changeOrder = function(order) {
      $state.go('.', { order: order });
    };

    self.loadMore();
  }
])

;
