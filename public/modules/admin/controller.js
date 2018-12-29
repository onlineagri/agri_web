
app.controller('DashboardController', ['$scope', 'adminService','toaster','$localStorage','$location', function($scope, adminService, toaster, $localStorage, $location) {
    var total = 0;
    var totalCustomers = [];
    var totalFarmers = [];
    adminService.getOrders().then(function(response){
        if (response.data.code == 200) {
            var data = response.data.data;
            $scope.orderCounts = data.length;
            angular.forEach(data, function(value, key){
                if (value.status == 'Completed') {
                    total += value.amountPaid;
                }
            });
            $scope.totalTransactions = total.toFixed(2);
        }
    }).catch(function(response){

    });

    adminService.getUsers().then(function(response){
        if (response.data.code == 200) {
            var data = response.data.data;
            $scope.customerCounts = data[0].customers;
            $scope.farmerCounts = data[1].farmers;
        }
    }).catch(function(response){

    });
}]).controller('adminLoginController', ['$scope', 'adminService','toaster','$localStorage','$location', function($scope, adminService, toaster, $localStorage, $location) {
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
    $scope.stockTypes = ["kg", "liter", "item"];
   

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

    $scope.getFamrmerList = function(){
        adminService.getFamrmerList().then(function(response){
            $scope.farmerList = response.data.data;
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
        if (files.length > 0) {
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
                $scope.tableParams = new NgTableParams({
                    // initial grouping
                    group: {
                        categoryName: "desc"
                    }
                }, {
                    dataset: categoryArray,
                    groupOptions: {
                        isExpanded: false
                    }
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

    $scope.addClothingMenu = function(menu){
        $scope.menu.image = [];
        if (document.getElementById("image").files && $scope.selectedImg) {
            var imgElem = document.getElementById("image").files;
            
            for(var i =0; i < imgElem.length; i++){
                var reader = new FileReader();
                reader.readAsDataURL(imgElem[i]);
                reader.onload = function(onLoadEvent) {
                    if (onLoadEvent.target.result) {
                        var image = new Image();
                        image.src = onLoadEvent.target.result;
                        image.onload = function() {
                            $scope.menu.image.push(onLoadEvent.target.result);
                        }
                    }
                }
            }
        }
        adminService.addClothingMenu($scope.menu).then(function(response){
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

}]).controller('adminCustomerController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route','SweetAlert', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route, SweetAlert) {
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
    }];

    $scope.getCustomers = function(){
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
                SweetAlert.swal("", response.data.message, "success");
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
                SweetAlert.swal("", response.data.message, "success");
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
        SweetAlert.swal({
                title: "Are you sure?",
                text: "You are deleting this customer?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete customer",
                closeOnConfirm: false
            },
            function(isConfirm) {
                adminService.adminDeleteCustomer(id).then(function(response){
                    if(response.data.code == 200){
                        SweetAlert.swal("", response.data.message, "success");
                        $route.reload();
                    } else{
                        SweetAlert.swal("", response.data.message, "warning");
                    }
                }).catch(function(response) {
                });
            });
    }

}]).controller('orderManageController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route','$localStorage','SweetAlert', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route, $localStorage, SweetAlert) {
    if($localStorage.isCustomerLogin){
        $rootScope.userLogin = true;
    }
    $scope.getOrder = function(){
        var orderId = $routeParams.id;
        
        adminService.getOrder(orderId).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $scope.order = response.data.data;
                if ($scope.order.status == 'Completed') {
                    $scope.process = 1;
                    $scope.delivery = 1;
                    $scope.complete = 1;
                } else if ($scope.order.status == 'Out for delivery') {
                    $scope.process = 1;
                    $scope.delivery = 1;
                    $scope.complete = 0;
                } else if ($scope.order.status == 'In Process') {
                    $scope.process = 1;
                    $scope.delivery = 0;
                    $scope.complete = 1;
                } else{
                   $scope.process = 0;
                   $scope.delivery = 1;
                   $scope.complete = 1; 
                }
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
        adminService.getOrders().then(function(response){
            if(response.data.code == 200){
                $scope.orders = response.data.data;
                $scope.filter = {
                    orderId: '',
                    status:''
                };
                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 10,
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

    $scope.orderStatus = function(orderId, status){
        var status = status;
        var params = {orderId: orderId, status: status};

        if (status == 'Placed') {
            params = {orderId: orderId, status: 'In Process'};
            $scope.order.status = 'In Process';
            $scope.process = 1;
            $scope.delivery = 0;
            $scope.complete = 1;
        }

        if (status == 'In Process') {
            params = {orderId: orderId, status: 'Out for delivery'};
            $scope.order.status = 'Out for delivery';
            $scope.process = 1;
            $scope.delivery = 1;
            $scope.complete = 0;
        }

        if (status == 'Out for delivery') {
            params = {orderId: orderId, status: 'Completed'};
            $scope.order.status = 'Completed';
            $scope.process = 1;
            $scope.delivery = 1;
            $scope.complete = 1;
        }

        adminService.updateOrderStatus(params).then(function(response){
            SweetAlert.swal("", response.data.message, "success");
        }).catch(function(response){
            console.log(response);
        });

    }

}]).controller('contentManagementController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route','$localStorage','SweetAlert', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route, $localStorage, SweetAlert) {
    // Editor options.
      $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
      };

      $scope.getContents = function(){
        adminService.getContents().then(function(response){
            if (response.data.code == 200) {
                $scope.contents = response.data.data;
            }
        }).catch(function(response){
        })
      }

      $scope.createContent = function(data){
        adminService.addContent(data).then(function(response){
            if (response.data.code == 200) {
                SweetAlert.swal("", response.data.message, "success");
                $location.path('/admin/contents');
            } else{
                SweetAlert.swal("", response.data.message, "warning");
            }
        }).catch(function(response){

        });
      }

      $scope.updateContent = function(data){
        adminService.addContent(data).then(function(response){
            if (response.data.code == 200) {
                SweetAlert.swal("", response.data.message, "success");
                $location.path('/admin/contents');
            } else{
                SweetAlert.swal("", response.data.message, "warning");
            }
        }).catch(function(response){

        });
      }

      $scope.getCmsContent = function(){
        var id = $routeParams.id;
        adminService.getCmsContent(id).then(function(response){
            $scope.cms = response.data.data;
        }).catch(function(response){

        })
      }

      $scope.deleteContent = function(id){
        SweetAlert.swal({
                title: "Are you sure?",
                text: "You are deleting this content?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete content",
                closeOnConfirm: false
            },
            function(isConfirm) {
                adminService.deleteContent(id).then(function(response){
                    if(response.data.code == 200){
                        SweetAlert.swal("", response.data.message, "success");
                        $route.reload('/admin/contents');
                    } else {
                        toaster.pop({
                            type: 'error',
                            title: '',
                            body: response.data.message
                        });
                    }
                }).catch(function(response){

                })
            });
      }

}]);
