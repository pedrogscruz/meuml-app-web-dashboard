angular.module('meuml.services.image-tag', [
  'meuml.resources.image-tag'
])

.factory('SellerImageTagService', ['SellerImageTag',
  function(SellerImageTag) {
    var service = {
      save: function(imageTag) {
        if (imageTag.id) {
          return SellerImageTag.patch(imageTag).$promise;
        } else {
          return SellerImageTag.save(imageTag).$promise;
        }
      },
      delete: function(id) {
        return SellerImageTag.delete({ id: id }).$promise;
      },
    };

    return service;
  }
])

.factory('SellerImageTagSearchService', ['$q', 'SellerImageTagSearch',
  function($q, SellerImageTagSearch) {
    // Cache com as tags das imagens
    var tags = {};

    var service = {
      /**
       * Faz a pesquisa de todas as tags das imagens e armazena o resultado em cache.
       */
      search: function() {
        // Se a pesquisa já foi feita retorna o resultado em cache.
        if (tags.result) {
          return $q.resolve(tags);
        }

        return SellerImageTagSearch.query(function(response) {
          tags = response;
        }).$promise;
      },
    };

    return service;
  }
])

;