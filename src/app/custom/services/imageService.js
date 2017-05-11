angular.module('meuml.services.image', [
  'meuml.resources.image'
])

.factory('SellerImageService', ['SellerImage',
  function(SellerImage) {
    var service = {
      save: function(image) {
        if (image.id) {
          return SellerImage.patch(image).$promise;
        } else {
          return SellerImage.save(image).$promise;
        }
      },
      deleteMultiple: function(ids) {
        var parameters = {
          q: {
            filters: [{
              name: 'id',
              op: 'in',
              val: ids,
            }],
          }
        };

        return SellerImage.delete(parameters).$promise;
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
      }
    };

    return service;
  }
])

;