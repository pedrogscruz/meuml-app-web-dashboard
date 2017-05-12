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
      delete: function(id) {
        return SellerImage.delete({ id: id }).$promise;
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