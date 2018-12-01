var app = angular.module("agriApp", ["ngRoute","toaster", "ngAnimate", 'ngStorage','ngTable']);

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
}])

app.config(function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('basicAuthenticationInterceptor');
    $routeProvider
    
    .when("/", {
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