app.factory('productService',['$http', function ($http) {
  return {
    getProductDetail: function (data) {
      return $http({
        method: 'GET',
        url: webservices.getProductDetail + "/" + data.catId + "/" + data.productId
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getMoreProducts: function (data) {
      return $http({
        method: 'GET',
        url: webservices.getMoreProducts + "/" + data.catId + "/" + data.exclude
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCategoryProducts: function (data) {
      return $http({
        method: 'POST',
        url: webservices.getCategoryProducts,
        data : data
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
  }
}]);