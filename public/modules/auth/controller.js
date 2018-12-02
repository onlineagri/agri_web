

app.controller('userLoginController', ['$scope', 'userService','toaster','$localStorage','$location', function($scope, userService, toaster, $localStorage, $location) {
    
    $scope.userLogin = function(user){
    	userService.userLogin(user).then(function(response){
    		if(response.data.code == 200){
    			toaster.pop({
	                type: 'success',
	                title: '',
	                body: response.data.message
	            });
    			$localStorage.token = response.data.token;
    			if(user.role == 'customer')
    				$localStorage.isCustomerLogin = true;
    			if(user.role == 'farmer')
    				$localStorage.isFarmerLogin = true;
    			$localStorage.firstName = response.data.data.firstName;
    			$localStorage.phoneNumber = response.data.data.phoneNumber;
    			$location.path("/" +user.role + "/dashboard");
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

    $scope.compairePassword = function(pass, cpass){
    	if(pass == cpass){
    		$scope.passerror = false;
    	} else {
    		$scope.passerror = true;
    	}
    }

    $scope.userRegister = function(user){
    	userService.customerRegister(user).then(function(response){
    		if(response.data.code == 200){
    			toaster.pop({
	                type: 'success',
	                title: '',
	                body: response.data.message
	            });
    			$location.path("/user/login");
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