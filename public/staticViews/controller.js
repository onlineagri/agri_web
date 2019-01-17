app.controller('staticController', ['$scope','$localStorage','$location', 'customerService','$rootScope','toaster','cmsService','$sce', function($scope, $localStorage, $location, customerService, $rootScope, toaster, cmsService, $sce) {
    // if($localStorage.isAdminLogin){
    //     $scope.logOut = "Logout";
    // } else {
    //     $scope.logOut = "Login";
    // }
    $scope.adminLogout = function(){
        localStorage.clear();
        $location.path("/admin/login");
    }

    if($location.path() != "/" && $location.path()!= "/contactus" && $location.path()!= "/aboutus"){
        $rootScope.isFront = false;
    } else {
        $rootScope.isFront = true;
    }

    if($localStorage.isCustomerLogin){
    	$scope.firstName = $localStorage.firstName;
        $rootScope.userLogin = true;
        $rootScope.phoneNumber = $localStorage.phoneNumber; 
        $scope.logOut = "Logout";
        getCustomerCart();
    } 
    if(!$localStorage.isAdminLogin && (!$localStorage.isCustomerLogin || $localStorage.isCustomerLogin == undefined)){
        $scope.logOut = "Login";
        $rootScope.userLogin = false;
        
        if($location.path() != "/contactus" && $location.path() != "/aboutus"){
            $location.path("/");
        }
    }

    function getMarketingContent(){
        var queryData = {
            loginUsers : $rootScope.userLogin ? true : false,
            guestUsers : $rootScope.userLogin ? false : true,
            contentfor : "Home Page"
        }

        cmsService.getMarketingContent(queryData).then(function(response){
            if(response.data.code == 200){
                $scope.isMarketing = true;
                $scope.marketingContents = response.data.data;
                $(document).ready(function(){
                    $("#owl-example").owlCarousel({items : 1, autoPlay : true});
                })
            } else {
                $scope.isMarketing = false;
            }
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    getMarketingContent();

    $scope.customerLogout = function(){
        $localStorage.isCustomerLogin = false;
    	localStorage.clear();
        $rootScope.isFront = true;
        $rootScope.userLogin = false;
        $location.path("/");
    }

    function getCustomerCart(){
        customerService.getCustomerCart().then(function(response){
            if(response.data.code == 200){
                $rootScope.userCart = response.data.data;
            }
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }

    $scope.sendContactEmail = function(contact){
        customerService.sendContactEmail(contact).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'Success',
                    title: '',
                    body: response.data.message
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

    $scope.getAboutus = function(){
        cmsService.getAboutus('About Us').then(function(response){
            if(response.data.code == 200){
                $scope.aboutusContent = deliberatelyTrustDangerousSnippet(response.data.data.description);
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

    var deliberatelyTrustDangerousSnippet = $scope.deliberatelyTrustDangerousSnippet = function(content){
         return $sce.trustAsHtml(content);
    }
}]);