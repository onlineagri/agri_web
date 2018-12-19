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
    },

    userForgotPass : function (user) {
        return $http({
            method: 'POST',
            data: user,
            url: webservices.userForgotPass
        }).then(function(response) {
            return response;
        }).catch(function() {});
    },

    checktoken : function (token) {
        return $http({
            method: 'GET',
            url: webservices.checktoken + "/" + token
        }).then(function(response) {
            return response;
        }).catch(function() {});
    },

    changePassword : function(data) {
      return $http({
          method: 'POST',
          url: webservices.changePassword,
          data: data
      }).then(function(response) {
          return response;
      }).catch(function() {});
    }
  }
}]);