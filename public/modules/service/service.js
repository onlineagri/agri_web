app.factory('serviceService',['$http', function ($http) {
  return {
    addService: function (params) {
      return $http({
        method: 'POST',
        url: webservices.addService,
        data : params
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getServices : function () {
      return $http({
        method: 'GET',
        url: webservices.getServices
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getService : function(id){
      return $http({
        method: 'GET',
        url: webservices.getService + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    updateService: function (params) {
      return $http({
        method: 'PUT',
        url: webservices.updateService,
        data : params
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
  }
}]);