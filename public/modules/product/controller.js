app.controller('userProductController', ['$scope', 'productService','toaster','$localStorage','$location','$routeParams','NgTableParams','$rootScope','SweetAlert','comboService','customerService',  function($scope, productService, toaster, $localStorage, $location, $routeParams, NgTableParams, $rootScope, SweetAlert, comboService, customerService) {
	$rootScope.isFront = false;
    $scope.rating = 5;

     if($localStorage.isCustomerLogin){
        $rootScope.userLogin = true;
    } else {
        $location.path('/customer/login');
    }
    $scope.cartIds = $routeParams.catid;
	$scope.getProductDetail = function(){
		var productId = $routeParams.id;
		var catId = $routeParams.catid;
		var product = {
			productId : productId,
			catId : catId
		}
		productService.getProductDetail(product).then(function(response){
            if(response.data.code == 200){
                $scope.product = response.data.data.product;
                $scope.ratings = response.data.data.rating;
                getMoreProducts(catId);
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
            itemId : $scope.product._id,
            itemName : $scope.product.name
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

    function getMoreProducts(catId){
        var exclude =  $scope.product._id;
        var data = {
            exclude : exclude,
            catId : catId
        }

        productService.getMoreProducts(data).then(function(response){
            if(response.data.code == 200){
                $scope.moreProducts = response.data.data;
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
    $scope.addToCart = function(product){
        var product = {
            id : product._id,
            name : product.name,
            quantity : 1,
            type : 'product'
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


    $scope.currentPage = 1;
    $scope.pageSize = 30;
    $scope.catProducts = [];
    $scope.getCategoryProducts = function() {
        var data = {
            page : $scope.currentPage,
            pageSize : $scope.pageSize,
            catId : $scope.cartIds
        }
        productService.getCategoryProducts(data).then(function(response){
            if(response.data.code == 200){
                $scope.catProducts = response.data.data.data;
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
}]);