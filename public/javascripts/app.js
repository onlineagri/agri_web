var app = angular.module("agriApp", ["ngRoute","toaster", "ngAnimate", 'ngStorage','ngTable','ui.bootstrap','oitozero.ngSweetAlert','ckeditor']);

app.factory('basicAuthenticationInterceptor',['$localStorage' , '$location', function($localStorage, $location) {
    var basicAuthenticationInterceptor = {
        request: function(config) {
            config.headers['Authorization'] = 'Bearer ' + $localStorage.token;
            config.headers['Content-Type'] = headerConstants.json;
            return config;
        },
        responseError: function(config) {
            if (config.status == 401) {
                $localStorage.$reset();
                $location.url("/");
            }
            return config;
        }
    };

    return basicAuthenticationInterceptor;
}]);

app.config(function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('basicAuthenticationInterceptor');
    $routeProvider
    
    .when("/", {
        controller : "staticController",
        templateUrl : "../staticViews/homepage.html"
    })

    .when("/admin/login", {
        controller : "adminLoginController",
        templateUrl : "../modules/admin/views/login.html"
    })

    .when("/admin/dashboard", {
        templateUrl : "../modules/admin/views/dashboard.html"
    })
    .when("/admin/categories", {
        controller : "categoryController",
        templateUrl : "../modules/admin/views/categories.html"
    })
    .when("/admin/category/add", {
        controller : "categoryController",
        templateUrl : "../modules/admin/views/addCategory.html"
    })
    .when("/admin/category/update/:id", {
        controller : "categoryController",
        templateUrl : "../modules/admin/views/updateCategory.html"
    })  
    .when("/admin/customers", {
        controller : "customerController",
        templateUrl : "../modules/admin/views/customers.html"
    })
    .when("/admin/customer/add", {
        controller : "customerController",
        templateUrl : "../modules/admin/views/addCustomer.html"
    })
    .when("/admin/customer/update/:id", {
        controller : "customerController",
        templateUrl : "../modules/admin/views/updateCustomer.html"
    })

    .when("/user/login", {
        controller : "userLoginController",
        templateUrl : "../modules/auth/views/login.html"
    })

    .when("/user/register", {
        controller : "userLoginController",
        templateUrl : "../modules/auth/views/register.html"
    })

    .when("/user/forgotpassword", {
        controller : "userLoginController",
        templateUrl : "../modules/auth/views/forgotPass.html"
    })
    

    .when("/customer/dashboard", {
        controller : "customerController",
        templateUrl : "../modules/customer/views/dashboard.html"
    })
    .when("/admin/menulist", {
        controller : "menuController",
        templateUrl : "../modules/admin/views/menulist.html"
    })
    .when("/admin/menu/add", {
        controller : "menuController",
        templateUrl : "../modules/admin/views/addMenu.html"
    })
    .when("/admin/menu/update/:id", {
        controller : "menuController",
        templateUrl : "../modules/admin/views/updateMenu.html"
    })
    .when("/product/:id", {
        controller : "customerController",
        templateUrl : "../modules/customer/views/productDetail.html"
    })

    .when("/customer/cart/:id", {
        controller : "cartController",
        templateUrl : "../modules/cart/views/cartDetail.html"
    })
    
    .when("/customer/order/:id", {
        controller : "orderController",
        templateUrl : "../modules/order/views/orderDetails.html"
    })

    .when("/customer/orders", {
        controller : "orderController",
        templateUrl : "../modules/order/views/orderList.html"
    })

    .when("/category/products/:id", {
        controller : "customerController",
        templateUrl : "../modules/customer/views/categoryproducts.html"
    })
    .when("/admin/orders", {
        controller : "orderManageController",
        templateUrl : "../modules/admin/views/orders-dashboard.html"
    })
    .when("/admin/order/update/:id", {
        controller : "orderManageController",
        templateUrl : "../modules/admin/views/order-details.html"
    })

    .when("/verifyUser/:token", {
        controller : "userLoginController",
        templateUrl : "../modules/auth/views/changePassword.html"
    })
    .when("/admin/contents/", {
        controller : "contentManagementController",
        templateUrl : "../modules/admin/views/content-list.html"
    })
    .when("/admin/content/add", {
        controller : "contentManagementController",
        templateUrl : "../modules/admin/views/create-content.html"
    })
    .when("/admin/content/update/:id", {
        controller : "contentManagementController",
        templateUrl : "../modules/admin/views/update-content.html"
    })

    .when("/category/:id/subcategory", {
        controller : "customerController",
        templateUrl : "../modules/customer/views/subcategorys.html"
    })

    .when("/admin/subcategories", {
        controller : "subCategoryController",
        templateUrl : "../modules/admin/views/subcategories.html"
    })

    .when("/admin/subcategory/add", {
        controller : "subCategoryController",
        templateUrl : "../modules/admin/views/addsubcategory.html"
    })

    .when("/category/:mainId/:type/products", {
        controller : "categoryCustomerController",
        templateUrl : "../modules/category/views/products.html"
    })

    
    .otherwise("/404", {
        template : "<h1>Page not found</h1>"
    })
});

app.run(['$rootScope', '$location', '$http', '$localStorage', 
    function($rootScope, $location, $http, $localStorage) {


    //Do not remove Analytics injected server
    $rootScope.isAdmin = false;
    $rootScope.isCustomer = false;
    $rootScope.isFront = true;
    if($localStorage.isAdminLogin || $location.path() == '/admin/login'){
        $rootScope.isAdmin = true;
        $rootScope.isFront = false;
    }
    if($localStorage.isCustomerLogin){
        $rootScope.isCustomer = true;
        $rootScope.isFront = false;
    }
    
    $rootScope.firstName = $localStorage.firstName ? $localStorage.firstName : "";
    $rootScope.phoneNumber = $localStorage.phoneNumber ? $localStorage.phoneNumber : "";
    
    // $rootScope.$on("$locationChangeSuccess", function() {
    //     //console.log($rootScope.routeCounter);
    //     if ($rootScope.$root.flashes.length && !$rootScope.routeCounter) {
    //         //console.log("inside 1");
    //         $rootScope.routeCounter = 1;
    //     } else {
    //         $rootScope.routeCounter = 0;
    //         $rootScope.$root.flashes = [];
    //     }
    // });
    // if(!$localStorage.userLoggedIn) {
    //      $location.path('/login');
    // }
}]);

app.filter('capitalize', function() {
    return function(input, scope) {
        if (input != null)
            input = input.toLowerCase();
        if (input != undefined)
            return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});

app.directive('capitalizeFirst', function($parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if (inputValue === undefined) { inputValue = ''; }
           var capitalized = inputValue.charAt(0).toUpperCase() +
                             inputValue.substring(1);
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
     }
   };
});
app.directive('ngStars', function(){
     return {
         restrict: 'EA',
         link: function($scope, element, attrs){
             var stars_template = {
                 one: 'fa-star',
                 zero: 'fa-star-o',
                 half: 'fa-star-half-o'
             };

             $scope.stars = [];
             $scope.max = ($scope.max) ? $scope.max : 5;
             var readOnly = ($scope.readOnly == undefined) ? false : true;

             $scope.$watch('value', function(val){
                 var stars = [];

                 for ( i=0; i < $scope.max; i++ ){
                     var val = $scope.value - i;

                     if ( val >= 1 ){
                         stars.push({ class: stars_template.one })
                     } else if ( val < 1 && val > 0 ){
                         stars.push({ class: stars_template.half })
                     } else if ( val <= 0 ){
                         stars.push({ class: stars_template.zero })
                     }
                 }

                 $scope.stars = stars;
             });

             $scope.setStars = function(val){
                 if( !readOnly ){
                     val += 1;
                     $scope.value = val;

                     if( typeof($scope.callback) == 'function' ){
                         if( $scope.callback() == false ){
                             readOnly = true;
                         }
                     }
                 }
             }
         },
         template: '<span class="fa {{star.class}}" ng-repeat="star in stars track by $index" ng-click="setStars($index)"></span>',
         scope: {
             max: '@ngStarsMax',
             value: '=?ngStars',
             stars: '=?',
             readOnly: '@ngStarsReadonly',
             callback: '=?ngStarsCallback',
         },
     };
 });


// app.directive('ckEditor', function() {
//   return {
//     require: '?ngModel',
//     link: function(scope, elm, attr, ngModel) {
//       var ck = CKEDITOR.replace(elm[0]);

//       if (!ngModel) return;

//       ck.on('pasteState', function() {
//         scope.$apply(function() {
//           ngModel.$setViewValue(ck.getData());
//         });
//       });

//       ngModel.$render = function(value) {
//         ck.setData(ngModel.$viewValue);
//       };
//     }
//   };
// });