
app.controller('orderController', ['$scope', 'orderService','toaster','$localStorage','$location','$routeParams','NgTableParams','$rootScope','SweetAlert', function($scope, orderService, toaster, $localStorage, $location, $routeParams, NgTableParams, $rootScope, SweetAlert) {
     
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
        SweetAlert.swal({
                title: "Are you sure?",
                text: "You are canceling this Order?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Cancle Order",
                closeOnConfirm: false
            },
            function(isConfirm) {
                if(isConfirm){
                    orderService.cancleOrder(orderId).then(function(response){
                        if(response.data.code == 200){
                            SweetAlert.swal("", response.data.message,"success");
                        } else {
                            SweetAlert.swal("", response.data.message,"warning");
                        }
                    }).catch(function(response) {
                        toaster.pop({
                            type: 'error',
                            title: '',
                            body: "Something went wrong"
                        });
                    });
                }
            })
    }

}])