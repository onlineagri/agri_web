
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
        console.log("getCategories");
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

}]).controller('menuController', ['$scope', 'adminService', 'toaster', '$localStorage', '$location', 'NgTableParams', '$routeParams', '$route', function($scope, adminService, toaster, $localStorage, $location, NgTableParams, $routeParams, $route) {

    $scope.menu = {};

    var _selected;

    $scope.selected = undefined;
    // $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    // $scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];

    $scope.getCategories = function(){
        adminService.getCategories().then(function(response){
            $scope.categoryList = response.data.data;
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

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

    $scope.getMenuList = function(){
        // console.log("getCategories");
        adminService.getMenuList().then(function(response){
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

    $scope.addMenu = function(menu){
        if (document.getElementById("image").files[0] && $scope.selectedImg) {
            var imgElem = document.getElementById("image").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imgElem);
            reader.onload = function(onLoadEvent) {
                if (onLoadEvent.target.result) {
                    var image = new Image();
                    image.src = onLoadEvent.target.result;
                    image.onload = function() {
                        $scope.menu["image"] = onLoadEvent.target.result;
                        // console.log('category', category);
                        adminService.addMenu($scope.menu).then(function(response){
                            if(response.data.code == 200){
                                toaster.pop({
                                    type: 'success',
                                    title: '',
                                    body: response.data.message
                                });
                                $location.path('/admin/menulist');
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
            adminService.addMenu($scope.menu).then(function(response){
                if(response.data.code == 200){
                    toaster.pop({
                        type: 'success',
                        title: '',
                        body: response.data.message
                    });
                    $location.path('/admin/menulist');
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

    $scope.getMenuById = function(){
        var id = $routeParams.id;
        adminService.getMenuById(id).then(function(response){
                if(response.data.code == 200){
                    $scope.menu = response.data.data;
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


    $scope.deleteMenu = function(id){
        adminService.deleteMenu(id).then(function(response){
                if(response.data.code == 200){
                    toaster.pop({
                        type: 'success',
                        title: '',
                        body: response.data.message
                    });
                    $route.reload('/admin/menulist');
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

    $scope.updateMenu = function(menu){
        if (document.getElementById("image").files[0] && $scope.selectedImg) {
            var imgElem = document.getElementById("image").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imgElem);
            reader.onload = function(onLoadEvent) {
                if (onLoadEvent.target.result) {
                    var image = new Image();
                    image.src = onLoadEvent.target.result;
                    image.onload = function() {
                        $scope.menu["image"] = onLoadEvent.target.result;
                        // console.log('category', category);
                        adminService.updateMenu($scope.menu).then(function(response){
                            if(response.data.code == 200){
                                toaster.pop({
                                    type: 'success',
                                    title: '',
                                    body: response.data.message
                                });
                                $location.path('/admin/menulist');
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
            adminService.updateMenu($scope.menu).then(function(response){
                if(response.data.code == 200){

                    toaster.pop({
                        type: 'success',
                        title: '',
                        body: response.data.message
                    });
                    $location.path('/admin/menulist');
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

}]).controller('customerController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route) {
    $scope.states = [{
        name: "Andhra Pradesh"
    }, {
        name: "Arunachal Pradesh"
    }, {
        name: "Assam"
    }, {
        name: "Bihar"
    }, {
        name: "Chandigarh"
    }, {
        name: "Chhattisgarh"
    }, {
        name: "Dadra and Nagar Haveli"
    }, {
        name: "Daman and Diu"
    }, {
        name: "New Delhi"
    }, {
        name: "Goa"
    }, {
        name: "Gujarat"
    }, {
        name: "Haryana"
    }, {
        name: "Himachal Pradesh"
    }, {
        name: "Jammu and Kashmir"
    }, {
        name: "Jharkhand"
    }, {
        name: "Karnataka"
    }, {
        name: "Kerala"
    }, {
        name: "Lakshadweep"
    }, {
        name: "Madhya Pradesh"
    }, {
        name: "Maharashtra"
    }, {
        name: "Manipur"
    }, {
        name: "Meghalaya"
    }, {
        name: "Mizoram"
    }, {
        name: "Nagaland"
    }, {
        name: "Odisha"
    }, {
        name: "Puducherry"
    }, {
        name: "Punjab"
    }, {
        name: "Rajasthan"
    }, {
        name: "Sikkim"
    }, {
        name: "Tamil Nadu"
    }, {
        name: "Telangana"
    }, {
        name: "Tripura"
    }, {
        name: "Uttar Pradesh"
    }, {
        name: "Uttarakhand"
    }, {
        name: "West Bengal"
    }]
    $scope.getCustomers = function(){
        // console.log("getCategories");
        adminService.getCustomers().then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                var customerArray = response.data.data;
                var initialParams = {
                    count: 5 
                  };
                  var initialSettings = {
                    counts: customerArray.length,
                    paginationMaxBlocks: 13,
                    paginationMinBlocks: 2,
                    dataset: customerArray
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

    $scope.addUser = function(user){
        adminService.adminAddCustomer(user).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $location.path('/admin/customers')
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

    $scope.getCustomer = function(){
        var id = $routeParams.id;
        adminService.getCustomer(id).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                }); 
                $scope.user = response.data.data;
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

    $scope.updateUser = function(user){
        adminService.adminUpdateCustomer(user).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $location.path('/admin/customers')
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

    $scope.deleteUser = function(id) {
        adminService.adminDeleteCustomer(id).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $route.reload();
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

    

}]).controller('orderManageController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route) {
    
}]);
