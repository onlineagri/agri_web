app.factory('userService',['$http', function ($http) {
  return {
    userLogin: function (params) {
      return $http({
        method: 'POST',
        data: params,
        url: webservices.userLogin
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    customerRegister : function (user) {
    	user["role"] = "customer";
        return $http({
            method: 'POST',
            data: user,
            url: webservices.customerRegister
        }).then(function(response) {
            return response;
        }).catch(function() {});
    }
  }
}]);