app.factory('orderService',['$http', function ($http) {
  return {
    getOrder: function (orderId) {
      return $http({
        method: 'GET',
        url: webservices.getOrder + "/" + orderId
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getOrders: function (orderId) {
      return $http({
        method: 'GET',
        url: webservices.getOrders
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    cancleOrder: function (orderId) {
      return $http({
        method: 'GET',
        url: webservices.cancleOrder + "/" + orderId
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    }
  }
}]);