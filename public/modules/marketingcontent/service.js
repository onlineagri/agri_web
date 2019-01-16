
app.factory('marketingService',['$http', function ($http) {
  return {
    addMarketing: function (params) {
      return $http({
        method: 'POST',
        data: params,
        url: webservices.addMarketing
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getMarketingContents: function () {
      return $http({
        method: 'GET',
        url: webservices.getMarketingContents
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    updateMarketing : function (params){
      return $http({
        method: 'PUT',
        data: params,
        url: webservices.updateMarketing
      }).then(function (response) {
          return response;
      }).catch(function () {
      });
    },

    getMarketingContent : function (id){
      return $http({
        method: 'GET',
        url: webservices.getMarketingContent + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      })
    },

    deleteContent : function (id){
      return $http({
        method: 'DELETE',
        url: webservices.marketingDeleteContent + "/" + id
      }).then(function (response) {
          return response;
      }).catch(function () {
      })
    },
  }
}]);