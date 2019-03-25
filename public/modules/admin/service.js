
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

    addProduct: function (params) {
      return $http({
        method: 'POST',
        data: params,
        url: webservices.addProduct
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getProductList: function(catId){
      return $http({
        method: 'GET',
        url: webservices.getProductList 
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getProductById: function(id){
      return $http({
        method: 'GET',
        url: webservices.getProductById + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    updateProduct: function (params) {
      return $http({
        method: 'PUT',
        data: params,
        url: webservices.updateProduct
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    }, 

    deleteProduct : function(id){
      return $http({
        method: 'DELETE',
        url: webservices.deleteProduct + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getCombos : function() {
      return $http({
        method: 'GET',
        url: webservices.getCombos
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getProductsCombo : function() {
      return $http({
        method: 'GET',
        url: webservices.getProductsCombo
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    addCombo : function(params) {
      return $http({
        method: 'POST',
        data: params,
        url: webservices.addCombo
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getComboById : function(id) {
      return $http({
        method: 'GET',
        url: webservices.getComboById + '/' +id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },
    deleteCombo : function(id) {
      return $http({
        method: 'DELETE',
        url: webservices.getComboById + '/' +id
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

    getUsers: function(){
      return $http({
        method: 'GET',
        url: webservices.getUsers
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getBusinessPersons : function(){
      return $http({
        method: 'GET',
        url: webservices.getBusinessPersons
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    adminAddBusinessPerson: function(user){
      return $http({
        method: 'POST',
        url: webservices.adminAddBusinessPerson,
        data : user
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getBusinessPerson: function(id) {
      return $http({
        method: 'GET',
        url: webservices.getBusinessPerson + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    adminUpdateBusinessPerson: function(user){
      return $http({
        method: 'PUT',
        url: webservices.adminUpdateBusinessPerson,
        data : user
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    }, 

    adminDeleteBusinessPerson: function(id) {
      return $http({
        method: 'DELETE',
        url: webservices.adminDeleteBusinessPerson + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getSubCategories: function(){
      return $http({
        method: 'GET',
        url: webservices.getSubCategories
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },


    addSubCategory: function (params) {
      return $http({
        method: 'POST',
        data: params,
        url: webservices.addSubCategory
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getSystemParams: function () {
      return $http({
        method: 'GET',
        url: webservices.getSystemParams
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    updateDeliveryCharges: function (params) {
      return $http({
        method: 'PUT',
        data: params,
        url: webservices.updateDeliveryCharges
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    cancleOrder: function (orderno) {
      return $http({
        method: 'PUT',
        data: {orderNumber : orderno},
        url: webservices.adminCancleOrder
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

  }
}]);