

app.controller('userLoginController', ['$scope', 'userService','toaster','$localStorage','$location','$routeParams', function($scope, userService, toaster, $localStorage, $location, $routeParams) {
    
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

    $scope.userForgotPass = function(email, role){
        var paramData = {
            email: email,
            role : role
        }
        userService.userForgotPass(paramData).then(function(response){
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

    if($location.path().split('/')[1] == 'verifyUser'){
        var id = $routeParams.token;
        userService.checktoken(id).then(function(response){
            if(response.data.code == 200){
                $scope.error = false;
                $scope.userId = response.data.data.id;
            } else {
                $scope.error = true;
                $scope.errorMsg = response.data.message;
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
    };

    $scope.changePassword = function(password){
        var data = {
            password: password,
            id: $scope.userId
        }

        userService.changePassword(data).then(function(response){
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