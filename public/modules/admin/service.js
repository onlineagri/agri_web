
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

    addMenu: function (params) {
      return $http({
        method: 'POST',
        data: params,
        url: webservices.addMenu
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getMenuList: function(){
      return $http({
        method: 'GET',
        url: webservices.getMenuList
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getMenuById: function(id){
      return $http({
        method: 'GET',
        url: webservices.getMenuById + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    updateMenu: function (params) {
      return $http({
        method: 'PUT',
        data: params,
        url: webservices.updateMenu
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    }, 

    deleteMenu : function(id){
      return $http({
        method: 'DELETE',
        url: webservices.deleteMenu + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCustomers : function(){
      return $http({
        method: 'GET',
        url: webservices.getCustomers
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    adminAddCustomer: function(user){
      return $http({
        method: 'POST',
        url: webservices.adminAddCustomer,
        data : user
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCustomer: function(id) {
      return $http({
        method: 'GET',
        url: webservices.getCustomer + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    adminUpdateCustomer: function(user){
      return $http({
        method: 'PUT',
        url: webservices.adminAddCustomer,
        data : user
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    }, 

    adminDeleteCustomer: function(id) {
      return $http({
        method: 'DELETE',
        url: webservices.getCustomer + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getOrders: function(){
      return $http({
        method: 'GET',
        url: webservices.getOrders
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getFamrmerList: function(){
      return $http({
        method: 'GET',
        url: webservices.getFamrmerList
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getOrder: function(id){
      return $http({
        method: 'GET',
        url: webservices.getOrderById + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    updateOrderStatus: function(params){
      return $http({
        method: 'PUT',
        url: webservices.updateOrderStatus,
        data: params
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    addContent: function(params){
      return $http({
        method: 'POST',
        url: webservices.addContent,
        data: params
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getContents: function(params){
      return $http({
        method: 'GET',
        url: webservices.getContents,
        data: params
        }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    addClothingMenu: function(data) {
      return $http({
        method: 'POST',
        data : data,
        url: webservices.addClothingMenu
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCmsContent: function(id){
      return $http({
        method: 'GET',
        url: webservices.getCmsContent + '/' + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    deleteContent : function(id){
      return $http({
        method: 'DELETE',
        url: webservices.deleteContent + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
    
  }
}]);