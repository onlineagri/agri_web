app.factory('categoryService',['$http', function ($http) {
  return {
    getProducts: function (data) {
      return $http({
        method: 'GET',
        url: webservices.getCategoryProducts + "/" +  data.categoryId + "/" + data.type
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    }
  }
}]);