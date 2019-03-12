

app.controller('userLoginController', ['$scope', 'userService','toaster','$localStorage','$location','$routeParams','SweetAlert', function($scope, userService, toaster, $localStorage, $location, $routeParams, SweetAlert) {
    
    if($localStorage.isCustomerLogin){
        $location.path("/customer/dashboard");
    } 
    $scope.userLogin = function(user){
    	userService.userLogin(user).then(function(response){
    		if(response.data.code == 200){
    			$localStorage.token = response.data.token;
    			if(user.role == 'customer')
    				$localStorage.isCustomerLogin = true;
    			if(user.role == 'farmer')
    				$localStorage.isFarmerLogin = true;
    			$localStorage.firstName = response.data.data.firstName;
    			$localStorage.phoneNumber = response.data.data.phoneNumber;
    			$location.path("/" +user.role + "/dashboard");
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
    			$location.path("/user/verifyotp/" + response.data.data);
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

    $scope.userForgotPass = function(phoneNumber, role){
        var paramData = {
            phoneNumber: phoneNumber,
            role : role
        }
        userService.userForgotPass(paramData).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $location.path("/user/verifyUser");
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

    $scope.changePassword = function(otp,password){
        var data = {
            password: password,
            id: otp
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

    $scope.verifyOtp = function(code){
        var userId = $routeParams.userId;
        var params = {
            userId : userId,
            verificationCode : code
        }
        userService.verifyOtp(params).then(function(response){
            if(response.data.code == 200){
                SweetAlert.swal("", response.data.message, "success");
                $localStorage.token = response.data.token;
                $localStorage.isCustomerLogin = true;
                $localStorage.firstName = response.data.data.firstName;
                $localStorage.phoneNumber = response.data.data.phoneNumber;
                $location.path("/customer/dashboard");
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