
app.controller('userComboController', ['$scope', 'comboService','toaster','$localStorage','$location','$routeParams','$rootScope','SweetAlert','customerService', function($scope, comboService, toaster, $localStorage, $location, $routeParams, $rootScope, SweetAlert, customerService) {
    $rootScope.isFront = false;
    $scope.rating = 5;

     if($localStorage.isCustomerLogin){
        $rootScope.userLogin = true;
    } else {
        $location.path('/customer/login');
    }

    $scope.getComboDetail = function(){
        var id = $routeParams.id;
        comboService.getComboDetail(id).then(function(response){
            if(response.data.code == 200){
                $scope.combo = response.data.data.combos;
                $scope.ratings = response.data.data.rating;
                $scope.comboProducts = Array.prototype.map.call($scope.combo.products, function(item) { return item.name; }).join(","); 
                getMoreCombos();
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

    $scope.productDetails = function(id){
        comboService.productDetails(id).then(function(response){
            if(response.data.code == 200){
                $scope.cProduct = response.data.data;
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

    $scope.submitReview = function(rating, review){
        var reviewParam = {
            rating : rating,
            review : review,
            itemId : $scope.combo._id,
            itemName : $scope.combo.name
        }

        comboService.submitReview(reviewParam).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
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

    function getMoreCombos(){
        var exclude =  $scope.combo._id;
        comboService.getMoreCombos(exclude).then(function(response){
            if(response.data.code == 200){
                $scope.moreCombos = response.data.data;
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

    $scope.addToCart = function(combo){
        var product = {
            id : combo._id,
            name : combo.name,
            quantity : 1,
            type : 'combo'
        }
        comboService.addToCart(product).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                getCustomerCart();
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
    getCustomerCart();

    $scope.currentPage = 1;
    $scope.pageSize = 20;
    $scope.combos = [];

    $scope.getCombos = function(){
        var data = {
            page : $scope.currentPage,
            pageSize : $scope.pageSize
        }
        comboService.getAllCombos(data).then(function(response){
            if(response.data.code == 200){
                $scope.combos = response.data.data.data;
                $scope.numberOfPages = Math.ceil((response.data.data.length) / $scope.pageSize);
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