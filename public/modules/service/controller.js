

app.controller('serviceController', ['$scope', 'serviceService','toaster','$localStorage','$location','$routeParams','$rootScope','SweetAlert','NgTableParams', function($scope, serviceService, toaster, $localStorage, $location, $routeParams, $rootScope, SweetAlert,NgTableParams) {
    
    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };

    $scope.service = {};
    $scope.service.package = [{name: "Trail Package", days: 10, netAmount: 200, dealPrice: 200, description: "This is our trail package, for 10 days", status: true}];
    
    $scope.addNewPackage = function(){
        $scope.service.package.push({name:"", days: 0, netAmount: 0, dealPrice: 0, description: "", status: true});
    }    
    
    $scope.removePackage = function(index){
        $scope.service.package.splice(index, 1);
    }

    $scope.addService = function(service){
        serviceService.addService(service).then(function(response){
            if(response.data.code == 200){
                SweetAlert.swal("", response.data.message, "success");
            } else {
                SweetAlert.swal("", response.data.message, "warning");
            }

        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.getServices = function(){
        serviceService.getServices().then(function(response){
            if(response.data.code == 200){
                var serviceArray = response.data.data;
                $scope.tableParams = new NgTableParams({
                    count: 5
                }, {
                    dataset: serviceArray,
                    
                });

            } else {
                SweetAlert.swal("", response.data.message, "warning");
            }

        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.getService = function(){
        const serviceId = $routeParams.id;
        serviceService.getService(serviceId).then(function(response){
            if(response.data.code == 200){
                $scope.service = response.data.data;
            } else {
                SweetAlert.swal("", response.data.message, "warning")
            }
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.updateService = function(service){
        serviceService.updateService(service).then(function(response){
            if(response.data.code == 200){
                SweetAlert.swal("", response.data.message, "success");
            } else {
                SweetAlert.swal("", response.data.message, "warning");
            }

        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

}])