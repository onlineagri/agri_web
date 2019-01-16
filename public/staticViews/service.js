app.factory('cmsService',['$http', function ($http) {
  return {
    getAboutus: function (cfor) {
      return $http({
        method: 'GET',
        url: webservices.getCms + "/" + cfor
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getMarketingContent: function (params) {
      return $http({
        method: 'POST',
        url: webservices.getMarketingCustomer,
        data: params
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
  }
}]);