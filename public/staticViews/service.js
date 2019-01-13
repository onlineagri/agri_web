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
    }
  }
}]);