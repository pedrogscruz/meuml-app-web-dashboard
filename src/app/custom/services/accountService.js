angular.module('meuml.services.account', [
  'meuml.resources.account'
])

.factory('SellerAccountService', ['SellerAccount',
  function(SellerAccount) {
    var service = {
      get: function(id) {
        return SellerAccount.get({ id: id }).$promise;
      },
      save: function(account) {
        if (account.id) {
          return SellerAccount.patch(account).$promise;
        } else {
          return SellerAccount.save(account).$promise;
        }
      },
      delete: function(id) {
        return SellerAccount.delete({ id: id }).$promise;
      },
    };

    return service;
  }
])

.factory('SellerAccountSearchService', ['SellerAccount',
  function(SellerAccount) {
    var service = {
      search: function(parameters) {
        return SellerAccount.query(parameters).$promise;
      }
    };

    return service;
  }
])

;