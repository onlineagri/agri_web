

app.controller('categoryCustomerController', ['$scope', 'categoryService','toaster','$localStorage','$location','$routeParams','$rootScope','SweetAlert','customerService', function($scope, categoryService, toaster, $localStorage, $location, $routeParams, $rootScope, SweetAlert, customerService) {
    $rootScope.isFront = false;
    if($localStorage.isCustomerLogin){
        $rootScope.userLogin = true;
    }
    
    $scope.type = $routeParams.type;
    $scope.mainCatId = $routeParams.mainId;
    $scope.getProducts = function(){
        categoryService.getProducts({type: $scope.type, categoryId: $scope.mainCatId}).then(function(response){
            if(response.data.code == 200){
                $scope.imageUrl = response.data.data.imageUrl;
                $scope.products = response.data.data.data;
            } else {
                SweetAlert.swal("", response.data.message, "warning")
            }
        }).catch(function(response) {
            SweetAlert.swal("", "Something went wrong", "warning")
        });
    }

    $scope.addTocart = function(product){
        var productParam = {
            id : product._id,
            name : product.name,
            category_name : product.categoryName,
            farmerName : product.brand,
            priceEachItem : product.priceEachItem,
            stockType : product.stockType,
            quantity : 1,
            farmerId : product.farmerId,
            dealPrice : product.dealPrice
        }

        customerService.addToCart(productParam).then(function(response){
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
}])