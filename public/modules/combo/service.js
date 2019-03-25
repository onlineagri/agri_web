app.factory('comboService',['$http', function ($http) {
  return {
    getComboDetail: function (id) {
      return $http({
        method: 'GET',
        url: webservices.getComboDetail + '/'+ id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
    productDetails: function (id) {
      return $http({
        method: 'GET',
        url: webservices.productDetails + '/'+ id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
    submitReview : function(data) {
      return $http({
        method: 'POST',
        data: data,
        url: webservices.submitReview
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getMoreCombos : function(id) {
      return $http({
        method: 'GET',
        url: webservices.getMoreCombos + '/' + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    addToCart : function(data) {
      return $http({
        method: 'POST',
        data: data,
        url: webservices.addToCart
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getAllCombos: function(data) {
      return $http({
        method: 'GET',
        url: webservices.getAllCombos + "/" + data.page + "/" + data.pageSize
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
}
}]);