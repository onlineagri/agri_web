app.controller('staticController', ['$scope','$localStorage','$location', 'customerService','$rootScope', function($scope, $localStorage, $location, customerService, $rootScope) {
    // if($localStorage.isAdminLogin){
    //     $scope.logOut = "Logout";
    // } else {
    //     $scope.logOut = "Login";
    // }
    $scope.adminLogout = function(){
        localStorage.clear();
        $location.path("/admin/login");
    }

    if($location.path() != "/"){
        $rootScope.isFront = false;
    } else {
        $rootScope.isFront = true;
    }

    if($localStorage.isCustomerLogin){
    	$scope.firstName = $localStorage.firstName;
        $rootScope.userLogin = true;
        $rootScope.phoneNumber = $localStorage.phoneNumber; 
        $scope.logOut = "Logout";
        getCustomerCart();
    } 
    if(!$localStorage.isCustomerLogin || $localStorage.isCustomerLogin == undefined){
        $scope.logOut = "Login";
        $rootScope.userLogin = false;
        $location.path("/");
    }

    $scope.customerLogout = function(){
        $localStorage.isCustomerLogin = false;
    	localStorage.clear();
        $rootScope.isFront = true;
        $rootScope.userLogin = false;
        $location.path("/");
    }

    function getCustomerCart(){
        customerService.getCustomerCart().then(function(response){
            if(response.data.code == 200){
                $rootScope.userCart = response.data.data;
            }
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }
    
    
}]);