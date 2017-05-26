angular.module('meuml.components.image-picker', [])

.factory('ImagePicker', ['$mdDialog',
  function($mdDialog) {
    var service = {
      show: function() {
        return $mdDialog.show({
          controller: 'ImagePickerController as imagePickerCtrl',
          fullscreen: true,
          parent: angular.element(document.body),
          templateUrl: 'custom/protected/image-picker/image-picker.tpl.html',
        });
      },
    };

    return service;
  }
])

.controller('ImagePickerController', ['$log', '$controller', '$scope', '$mdDialog',
  'SellerImageSearchService', 'SellerImageTagSearchService',

  function($log, $controller, $scope, $mdDialog, SellerImageSearchService,
           SellerImageTagSearchService) {

    var self = this;

    var imageTags = {
      result: [],
    };

    self.images = {};

    self.filters = {
      tag: [],
    };

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
          order_by: [{
            field: 'created_at',
            direction: 'desc'
          }],
        },
      };

      if (self.filters.tag && self.filters.tag.length) {
        // Usa o filtro de tags para pesquisar tanto nas tags das imagens quanto no nome do arquivo
        var keyFilter = [];
        var tagsFilter = [];

        angular.forEach(self.filters.tag, function(tag) {
          keyFilter.push({
            name: 'key',
            op: '==',
            val: tag,
          });

          tagsFilter.push({
            name: 'tags',
            op: 'any',
            val: {
              name: 'tag',
              op: '==',
              val: tag,
            },
          });
        });

        // Pesquisa no nome do arquivo ou nas tags da imagem
        searchParameters.q.filters.push({
          or: [{
            and: keyFilter,
          }, {
            and: tagsFilter,
          }]
        });
      }

      return searchParameters;
    }

    function searchTags() {
      $log.debug('Listando todas as tags');

      SellerImageTagSearchService.search().then(function(response) {
        $log.debug('Tags listadas');
        imageTags = response;
      }, function(error) {
        NotificationService.error('Não foi possível listar as tags', error);
      });
    }

    self.selectedImage = function(image) {
      $mdDialog.hide(image);
    };

    self.close = function() {
      $mdDialog.cancel();
    };

    self.searchImageTag = function(searchText) {
      if (!searchText) {
        return [];
      }

      return imageTags.result.filter(function(imageTag) {
        return (imageTag.tag.indexOf(angular.lowercase(searchText)) > -1);
      }).map(function(imageTag) {
        return imageTag.tag;
      });
    };

    /**
     * Adiciona a tag junto das tags atuais do filtro de pesquisa e sem seguida faz uma nova
     * pesquisa.
     *
     * @param tag a tag que será adicionada no filtro.
     */
    self.appendTagToFilters = function(tag) {
      if (self.filters.tag.indexOf(tag) != -1) {
        // Tag já está adicionada
        return;
      }

      self.filters.tag.push(tag);
      self.changeFilters();
    };

    /**
     * Limpa a lista de imagens e pesquisa novamente.
     */
    self.changeFilters = function() {
      self.resetPagination();
      self.loadMore();
    };

    self.loadMore();

    searchTags();
  }
])

;
