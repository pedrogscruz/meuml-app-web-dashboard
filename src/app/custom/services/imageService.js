angular.module('meuml.services.image', [
  'meuml.resources.image'
])

.factory('SellerImageService', ['$q', 'SellerImage',
  function($q, SellerImage) {
    // Estatísticas das imagens
    var stats = {
      count: 0,
    };

    var service = {
      save: function(image) {
        if (image.id) {
          return SellerImage.patch(image).$promise;
        } else {
          return SellerImage.save(image).$promise;
        }
      },
      delete: function(id) {
        return SellerImage.delete({ id: id }).$promise;
      },
      getStats: function() {
        if (stats.count) {
          return $q.resolve(stats);
        }

        var deferred = $q.defer();

        SellerImage.query({ results_per_page: 0 }, function(response) {
          stats.count = response.limit;
          deferred.resolve(stats);
        }, function(error) {
          deferred.reject(error);
        });

        return stats;
      },
      incrementImagesCount: function() {
        stats.count++;
      },
    };

    return service;
  }
])

.factory('SellerImageSearchService', ['SellerImage',
  function(SellerImage) {
    var service = {
      search: function(parameters) {
        return SellerImage.query(parameters).$promise;
      },
    };

    return service;
  }
])

;