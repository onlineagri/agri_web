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
    .when("/admin/categories/add", {
        controller : "categoryController",
        templateUrl : "../modules/admin/views/addCategory.html"
    })
    .when("/blue", {
        templateUrl : "blue.htm"
    });
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