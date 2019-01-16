

app.controller('marketingController', ['$scope', 'marketingService','toaster','$localStorage','$location','$routeParams','$rootScope', function($scope, marketingService, toaster, $localStorage, $location, $routeParams, $rootScope) {
      
    $scope.addMarketing = function(marketing){

        marketingService.addMarketing(marketing).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
            }
        }).catch(function(response){
            toaster.pop({
                type: 'success',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.getMarketingContents = function(){
        marketingService.getMarketingContents().then(function(response){
            if(response.data.code == 200){
                $scope.contents = response.data.data;
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
            }
        }).catch(function(response){
            toaster.pop({
                type: 'success',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.updateMarketing = function(content){
        marketingService.updateMarketing(content).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
            }
        }).catch(function(response){
            toaster.pop({
                type: 'success',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.getMarketingContent = function(){
        var id = $routeParams.id;
        marketingService.getMarketingContent(id).then(function(response){
            if(response.data.code == 200){
                $scope.marketing = response.data.data;
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
            }
        }).catch(function(response){
            toaster.pop({
                type: 'success',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.deleteContent = function(id){
        marketingService.deleteContent(id).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
            }
        }).catch(function(response){
            toaster.pop({
                type: 'success',
                title: '',
                body: "Something went wrong"
            });
        });
    }
    
}])