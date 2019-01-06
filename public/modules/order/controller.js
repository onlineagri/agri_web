
app.controller('orderController', ['$scope', 'orderService','toaster','$localStorage','$location','$routeParams','NgTableParams','$rootScope', function($scope, orderService, toaster, $localStorage, $location, $routeParams, NgTableParams, $rootScope) {
     
    $rootScope.isFront = false; 
     if($localStorage.isCustomerLogin){
        $rootScope.userLogin = true;
    } else {
        $location.path('/customer/login');
    }
    $scope.getOrder = function(){
    	var orderId = $routeParams.id;
        orderService.getOrder(orderId).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $scope.order = response.data.data;
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
            }
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.printOrder = function(){
    	window.print();
    }

    $scope.getOrders = function(){
        orderService.getOrders().then(function(response){
            if(response.data.code == 200){
                $scope.orders = response.data.data;
                $scope.filter = {
                    orderId: '',
                    status:''
                };
                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 20,
                    sorting: {
                        createdAt: "desc"
                    },
                    filter: $scope.filter
                }, {
                    total: $scope.orders.length,
                    counts: [],
                    dataset: $scope.orders
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
            }
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.cancleOrder = function(orderId) {
        orderService.cancleOrder(orderId).then(function(response){
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
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

}])