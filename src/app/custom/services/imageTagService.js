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

;