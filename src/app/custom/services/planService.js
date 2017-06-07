angular.module('meuml.services.plan', [
  'meuml.resources.plan',
])

.factory('SellerPlanService', ['SellerPlanSubscribe',
  function(SellerPlanSubscribe) {
    var service = {
      subscribe: function(plan) {
        return SellerPlanSubscribe.save({ plan_id: plan.id }).$promise;
      }
    };

    return service;
  }
])

.factory('SellerPlanSearchService', ['SellerPlan',
  function(SellerPlan) {
    var service = {
      search: function(parameters) {
        return SellerPlan.query(parameters).$promise;
      }
    };

    return service;
  }
])

;