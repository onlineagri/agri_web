app.factory('customerService',['$http', function ($http) {
  return {
    getNewProducts: function (params) {
      return $http({
        method: 'GET',
        url: webservices.getNewProducts
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
  }
}]);