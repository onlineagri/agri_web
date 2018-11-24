
app.controller('adminLoginController', ['$scope', 'adminService','toaster','$localStorage','$location', function($scope, adminService, toaster, $localStorage, $location) {
    $scope.login = function(admin){
    	admin["role"] = "admin";
    	adminService.login(admin).then(function(response){
    		if(response.data.code == 200){
    			toaster.pop({
	                type: 'success',
	                title: '',
	                body: response.data.message
	            });
    			$localStorage.token = response.data.token;
    			$localStorage.isAdminLogin = true;
    			$localStorage.firstName = response.data.data.firstName;
    			$localStorage.phoneNumber = response.data.data.phoneNumber;
    			$location.path("/admin/dashboard");
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
}]).controller('categoryController', ['$scope', 'adminService','toaster','$localStorage','$location', 'NgTableParams', '$routeParams','$route', function($scope, adminService, toaster, $localStorage, $location, NgTableParams, $routeParams, $route) {
    
    $scope.category = {};

    $scope.uploadImage = function(files) {
        $scope.showMsg = false;
        if (files.length == 1) {
            $scope.selectedImg = true;
        } else {
            $scope.selectedImg = false;
        }

        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.getCategories = function(){
        // console.log("getCategories");
        adminService.getCategories().then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                var categoryArray = response.data.data;
                var initialParams = {
                    count: 5 
                  };
                  var initialSettings = {
                    counts: categoryArray.length,
                    paginationMaxBlocks: 13,
                    paginationMinBlocks: 2,
                    dataset: categoryArray
                  };
                  $scope.tableParams =  new NgTableParams(initialParams, initialSettings);
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

    $scope.addCategory = function(category){
        if (document.getElementById("image").files[0] && $scope.selectedImg) {
            var imgElem = document.getElementById("image").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imgElem);
            reader.onload = function(onLoadEvent) {
                if (onLoadEvent.target.result) {
                    var image = new Image();
                    image.src = onLoadEvent.target.result;
                    image.onload = function() {
                        $scope.category["image"] = onLoadEvent.target.result;
                        // console.log('category', category);
                        adminService.addCategory($scope.category).then(function(response){
                            if(response.data.code == 200){
                                toaster.pop({
                                    type: 'success',
                                    title: '',
                                    body: response.data.message
                                });
                                $location.path('/admin/categories');
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
                }
            }
        }else{
            adminService.addCategory($scope.category).then(function(response){
                if(response.data.code == 200){
                    toaster.pop({
                        type: 'success',
                        title: '',
                        body: response.data.message
                    });
                    $location.path('/admin/categories');
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
    }

    $scope.getCategoryById = function(){
        var id = $routeParams.id;

        adminService.getCategoryById(id).then(function(response){
                if(response.data.code == 200){
                    $scope.category = response.data.data;
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


    $scope.deleteCategory = function(id){
        adminService.deleteCategory(id).then(function(response){
                if(response.data.code == 200){
                    toaster.pop({
                        type: 'success',
                        title: '',
                        body: response.data.message
                    });
                    $route.reload('/admin/categories');
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

    $scope.updateCategory = function(category){
        if (document.getElementById("image").files[0] && $scope.selectedImg) {
            var imgElem = document.getElementById("image").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imgElem);
            reader.onload = function(onLoadEvent) {
                if (onLoadEvent.target.result) {
                    var image = new Image();
                    image.src = onLoadEvent.target.result;
                    image.onload = function() {
                        $scope.category["image"] = onLoadEvent.target.result;
                        // console.log('category', category);
                        adminService.updateCategory($scope.category).then(function(response){
                            if(response.data.code == 200){
                                toaster.pop({
                                    type: 'success',
                                    title: '',
                                    body: response.data.message
                                });
                                $location.path('/admin/categories');
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
                }
            }
        }else{
            adminService.updateCategory($scope.category).then(function(response){
                if(response.data.code == 200){

                    toaster.pop({
                        type: 'success',
                        title: '',
                        body: response.data.message
                    });
                    $location.path('/admin/categories');
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
    }

}]);

