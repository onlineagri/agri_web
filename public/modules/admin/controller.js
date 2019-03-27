
app.controller('DashboardController', ['$scope', 'adminService','toaster','$localStorage','$location', function($scope, adminService, toaster, $localStorage, $location) {
    var total = 0;
    var counter = 0;
    var totalCustomers = [];
    var totalFarmers = [];
    adminService.getOrders().then(function(response){
        if (response.data.code == 200) {
            var data = response.data.data;
            angular.forEach(data, function(value, key){
                if (value.status == 'Completed') {
                    total += value.amountPaid;
                    counter++;
                }
            });
            $scope.totalTransactions = total.toFixed(2);
            $scope.orderCounts = counter;
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

}]).controller('productController', ['$scope', 'adminService', 'toaster', '$localStorage', '$location', 'NgTableParams', '$routeParams', '$route','SweetAlert', function($scope, adminService, toaster, $localStorage, $location, NgTableParams, $routeParams, $route, SweetAlert) {

    $scope.menu = {};
    var _selected;

    $scope.selected = undefined;
    $scope.stockTypes = ["gm", "kg", "liter", "item"];
   

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
        if (files.length > 0) {
            $scope.selectedImg = true;
        } else {
            $scope.selectedImg = false;
        }

        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.getProductList = function(){
        adminService.getProductList().then(function(response){
            if(response.data.code == 200){
                var categoryArray = response.data.data;
                $scope.tableParams = new NgTableParams({
                    // initial grouping
                    group: {
                        category_name: "desc"
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

    $scope.addProduct = function(menu){
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
                        adminService.addProduct($scope.menu).then(function(response){
                            if(response.data.code == 200){
                                SweetAlert.swal("", response.data.message, "success");
                                $location.path('/admin/products');
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
                }
            }
        }else{
            adminService.addProduct($scope.menu).then(function(response){
                if(response.data.code == 200){
                    SweetAlert.swal("", response.data.message, "success");
                    $location.path('/admin/products');
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
    }

    $scope.getProductById = function() {
        var id = $routeParams.id;
        adminService.getProductById(id).then(function(response) {
            if (response.data.code == 200) {
                $scope.product = response.data.data;
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
            s
        });
    }


    $scope.deleteMenu = function(id){
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
                if (isConfirm) {
                    adminService.deleteMenu(id).then(function(response) {
                        if (response.data.code == 200) {
                            SweetAlert.swal("", response.data.message, "success");
                            $route.reload('/admin/menulist');
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
            });
    }

    $scope.updateProduct = function(product){
        if (document.getElementById("image").files[0] && $scope.selectedImg) {
            var imgElem = document.getElementById("image").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imgElem);
            reader.onload = function(onLoadEvent) {
                if (onLoadEvent.target.result) {
                    var image = new Image();
                    image.src = onLoadEvent.target.result;
                    image.onload = function() {
                        $scope.product["image"] = onLoadEvent.target.result;
                        // console.log('category', category);
                        adminService.updateProduct($scope.product).then(function(response){
                            if(response.data.code == 200){
                                SweetAlert.swal("", response.data.message, "success");
                                $location.path('/admin/products');
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
                }
            }
        }else{
            adminService.updateProduct($scope.product).then(function(response){
                if(response.data.code == 200){
                    SweetAlert.swal("", response.data.message, "success");
                    $location.path('/admin/products');
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

}])
.controller('comboController', ['$scope', 'adminService', 'toaster', '$localStorage', '$location', 'NgTableParams', '$routeParams', '$route','SweetAlert', '$uibModal','$rootScope', function($scope, adminService, toaster, $localStorage, $location, NgTableParams, $routeParams, $route, SweetAlert, $uibModal, $rootScope) {

    $scope.combo = {};
    $scope.comboProducts = [];
    
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

    $scope.getCombos = function(){
        adminService.getCombos().then(function(response){
            if(response.data.code == 200){
                $scope.combos = response.data.data;
                $scope.tableParamsCombo = new NgTableParams({

                }, { dataset: $scope.combos});
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

    $scope.openProduct = function(){
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modules/admin/views/select-products.html',
            controller: 'SubProductCtrl',
            controllerAs: 'ctrl',
            size: 'sm',
            scope: $scope,
            windowClass: 'show',
            backdropClass: 'show'
        });

        modalInstance.result.then(function() {}, function() {});
    }

    $scope.getProductsCombo = function(){
        adminService.getProductsCombo().then(function(response){
            if(response.data.code == 200){
                $scope.comboProd = response.data.data;
                $scope.tableParams = new NgTableParams({

                }, { dataset: $scope.comboProd});
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
        })
    }

    $scope.addProductToCombo = function(product, isSelect){
        var index = 0;
        if(isSelect){
            index = $rootScope.lodash.findIndex($scope.comboProducts, {'_id': product._id});
            if(index == -1){
                $scope.comboProducts.push(product);
            }
        } else {
            index = $rootScope.lodash.findIndex($scope.comboProducts, {'_id': product._id});
            if(index != -1){
                $scope.comboProducts.splice(index, 1);
            }
        }
    }

    $scope.addOptions = function(){
        var productsCombo = [];
        var actualPriceCombo = 0;
        $rootScope.lodash.each($scope.comboProducts, function(item){
            productsCombo.push({name: item.name, id : item._id, price: item.price});
            actualPriceCombo += item.price;
        })
        $scope.combo.products = productsCombo;
        $scope.combo.actualPrice = actualPriceCombo;
        $scope.comboProducts = [];
    }

    $scope.calculatePrice = function(prercent){
        $scope.combo.price = $scope.combo.actualPrice -  ($scope.combo.actualPrice * prercent) / 100;
    }

    $scope.addCombo = function(){
        if (document.getElementById("image").files[0] && $scope.selectedImg) {
            var imgElem = document.getElementById("image").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imgElem);
            reader.onload = function(onLoadEvent) {
                if (onLoadEvent.target.result) {
                    var image = new Image();
                    image.src = onLoadEvent.target.result;
                    image.onload = function() {
                        $scope.combo["image"] = onLoadEvent.target.result;
                        // console.log('category', category);
                        adminService.addCombo($scope.combo).then(function(response){
                            if(response.data.code == 200){
                                SweetAlert.swal("", response.data.message, "success");
                                $location.path('/admin/combos');
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
                }
            }
        }else{
            adminService.addCombo($scope.combo).then(function(response){
                if(response.data.code == 200){
                    SweetAlert.swal("", response.data.message, "success");
                    $location.path('/admin/combos');
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
    }

    $scope.getCombo = function(){
        var id = $routeParams.id;
        adminService.getComboById(id).then(function(response) {
            if (response.data.code == 200) {
                $scope.combo = response.data.data;
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
            s
        });
    }

    $scope.deleteCombo = function(id) {
        SweetAlert.swal({
                title: "Are you sure?",
                text: "You are deleting this combo?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete combo",
                closeOnConfirm: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    adminService.deleteCombo(id).then(function(response) {
                        if (response.data.code == 200) {
                            SweetAlert.swal("", response.data.message, "success");
                            $route.reload('/admin/combos');
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
            });
    }
   

}])

.controller('SubProductCtrl', ['$scope', '$uibModalInstance', function($scope,  $uibModalInstance) {
    var vm = this;
    vm.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}])
.controller('adminCustomerController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route','SweetAlert', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route, SweetAlert) {
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
        adminService.adminUpdateCustomer($scope.user).then(function(response){
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
                if (isConfirm) {
                    adminService.adminDeleteCustomer(id).then(function(response){
                        if(response.data.code == 200){
                            SweetAlert.swal("", response.data.message, "success");
                            $route.reload();
                        } else{
                            SweetAlert.swal("", response.data.message, "warning");
                        }
                    }).catch(function(response) {
                    });
                }
            });
    }

}]).controller('orderManageController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route','$localStorage','SweetAlert','$rootScope', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route, $localStorage, SweetAlert, $rootScope) {

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

    $scope.cancleOrder = function(orderNo){
        SweetAlert.swal({
                title: "Are you sure?",
                text: "You are Canceling this order?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, cancle order",
                closeOnConfirm: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    adminService.cancleOrder(orderNo).then(function(response){
                        SweetAlert.swal("", response.data.message, "success");
                    }).catch(function(response){
                        console.log(response);
                    });
                }
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
                if (isConfirm) {
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

                    });
                }
            });
      }

}]).controller('adminBusinessPersonController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route','SweetAlert', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route, SweetAlert) {
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

    $scope.names = ["farmer", "seller"];

    $scope.getBusinessPersons = function(){
        adminService.getBusinessPersons().then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                var businessPersonsArray = response.data.data;
                var initialParams = {
                    count: 5 
                  };
                  var initialSettings = {
                    counts: businessPersonsArray.length,
                    paginationMaxBlocks: 13,
                    paginationMinBlocks: 2,
                    dataset: businessPersonsArray
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

    $scope.addBusinessPerson = function(user){
        adminService.adminAddBusinessPerson(user).then(function(response){
            if(response.data.code == 200){
                SweetAlert.swal("", response.data.message, "success");
                $location.path('/admin/business');
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
            }
        })
    }
    $scope.getBusinessPerson = function(){
        var id = $routeParams.id;
        adminService.getBusinessPerson(id).then(function(response){
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

    $scope.updateBusinessPerson = function(user){
        adminService.adminUpdateBusinessPerson(user).then(function(response){
            if(response.data.code == 200){
                SweetAlert.swal("", response.data.message, "success");
                $location.path('/admin/business');
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

    $scope.deleteBusinessPerson = function(id) {
        SweetAlert.swal({
                title: "Are you sure?",
                text: "You are deleting this business person?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete business person",
                closeOnConfirm: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    adminService.adminDeleteBusinessPerson(id).then(function(response){
                        if(response.data.code == 200){
                            SweetAlert.swal("", response.data.message, "success");
                            $route.reload();
                        } else{
                            SweetAlert.swal("", response.data.message, "warning");
                        }
                    }).catch(function(response) {
                    });
                }
            });
    }

    $scope.cancel = function(){
        $location.path('/admin/business');
    }

}]).controller('subCategoryController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route','$localStorage','SweetAlert', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route, $localStorage, SweetAlert) {
    
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
    
    $scope.addSubCategory = function(subcategory){
        if (document.getElementById("image").files[0] && $scope.selectedImg) {
            var imgElem = document.getElementById("image").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imgElem);
            reader.onload = function(onLoadEvent) {
                if (onLoadEvent.target.result) {
                    var image = new Image();
                    image.src = onLoadEvent.target.result;
                    image.onload = function() {
                        $scope.subcategory["image"] = onLoadEvent.target.result;
                        // console.log('category', category);
                        adminService.addSubCategory($scope.subcategory).then(function(response){
                            if(response.data.code == 200){
                                SweetAlert.swal("", response.data.message,"success")
                                $location.path('/admin/categories');
                            } else {
                                SweetAlert.swal("", response.data.message,"warning")
                            }
                        }).catch(function(response) {
                            SweetAlert.swal("", "Something went wrong","warning")
                        });
                    }
                }
            }
        }else{
            adminService.addSubCategory($scope.subcategory).then(function(response){
                if(response.data.code == 200){
                    SweetAlert.swal("", response.data.message,"success")
                    $location.path('/admin/categories');
                } else {
                    SweetAlert.swal("", response.data.message,"warning")
                }
            }).catch(function(response) {
                SweetAlert.swal("", "Something went wrong","warning")
            });
        }
    }

    $scope.getSubCategories = function(){
        adminService.getSubCategories().then(function(response){
            if(response.data.code == 200){
                var subcategoryArray = response.data.data;
                $scope.tableParams = new NgTableParams({
                    // initial grouping
                    group: {
                        categoryName: "desc"
                    }
                }, {
                    dataset: subcategoryArray,
                    groupOptions: {
                        isExpanded: false
                    }
                });
            } else {
                SweetAlert.swal("", response.data.message,"warning");
            }
        }).catch(function(response) {
            SweetAlert.swal("", "Something went wrong","warning")
        });
    }
}]).controller('systemParamsController', ['$scope', 'adminService','toaster','$location', 'NgTableParams', '$routeParams','$route','$localStorage','SweetAlert', function($scope, adminService, toaster, $location, NgTableParams, $routeParams, $route, $localStorage, SweetAlert) {
    $scope.updateDeliveryCharges = function(params){
        SweetAlert.swal({
                title: "Are you sure?",
                text: "You are updating system parameters?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, update syste parameters",
                closeOnConfirm: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    adminService.updateDeliveryCharges(params).then(function(response) {
                        if (response.data.code == 200) {
                            SweetAlert.swal("", response.data.message, "success");
                            $route.reload();
                        } else {
                            SweetAlert.swal("", response.data.message, "warning");
                        }
                    }).catch(function(response) {});
                }
            });
    }

    $scope.getDeliveryCharges = function(){
        adminService.getSystemParams().then(function(response){
            var data = response.data.data;
            $scope.params = data[0];
        }).catch(function(response){

        })
    }

}]);
