
app.factory('adminService',['$http', function ($http) {
  return {
    login: function (params) {
      return $http({
        method: 'POST',
        data: params,
        url: webservices.adminLogin
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    addCategory: function (params) {
      return $http({
        method: 'POST',
        data: params,
        url: webservices.addCategory
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCategories: function(){
      return $http({
        method: 'GET',
        url: webservices.getCategories
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCategoryById: function(id){
      return $http({
        method: 'GET',
        url: webservices.getCategoryById + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    updateCategory: function (params) {
      return $http({
        method: 'PUT',
        data: params,
        url: webservices.updateCategory
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    deleteCategory : function(id){
      return $http({
        method: 'DELETE',
        url: webservices.deleteCategory + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
  }
}]);