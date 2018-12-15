app.factory('cartService',['$http', function ($http) {
  return {
    getCart: function (cartId) {
      return $http({
        method: 'GET',
        url: webservices.getCart + "/" + cartId
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    updateCart: function (itemData) {
      return $http({
        method: 'PUT',
        data : itemData,
        url: webservices.updateCart
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    clearCart : function (cartId) {
      return $http({
        method: 'DELETE',
        url: webservices.getCart + "/" + cartId
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    placeOrder : function (cartData) {
      return $http({
        method: 'POST',
        data : cartData,
        url: webservices.placeOrder
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    }
  }
}]);