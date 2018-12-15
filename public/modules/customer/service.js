app.factory('customerService',['$http', function ($http) {
  return {
    getNewProducts: function () {
      return $http({
        method: 'GET',
        url: webservices.getNewProducts
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getProductById: function (id) {
      return $http({
        method: 'GET',
        url: webservices.getProduct + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    addToCart : function (product) {
      return $http({
        method: 'POST',
        data: product,
        url: webservices.addToCart
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCustomerCart : function(){
      return $http({
        method: 'GET',
        url: webservices.getCustomerCart
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCategories : function(){
      return $http({
        method: 'GET',
        url: webservices.getProductCategories
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCategoryProducts: function (id) {
      return $http({
        method: 'GET',
        url: webservices.getCategoryProducts + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    }
  }
}]);