

app.controller('customerController', ['$scope', 'customerService','toaster','$localStorage','$location','$routeParams','$rootScope','SweetAlert', function($scope, customerService, toaster, $localStorage, $location, $routeParams, $rootScope, SweetAlert) {
    $rootScope.isFront = false;
     if($localStorage.isCustomerLogin){
        $rootScope.userLogin = true;
    } else {
        $location.path('/customer/login');
    }
    $scope.rating = 5;

    $scope.getProductCat = function(){
        var pathParams = $routeParams.category;
        $scope.productCategory = pathParams;
    }

    $scope.getNewProducts = function(){
        customerService.getNewProducts().then(function(response){
            if(response.data.code == 200){
                $scope.newProducts = response.data.data.data;
                $scope.imageUrl = response.data.data.imageUrl;
                $(document).ready(function(){
                  $("#news-slider").owlCarousel({
                        items : 3,
                        itemsDesktop : [1199,3],
                        itemsMobile : [600,1],
                        pagination :true,
                        autoPlay : true
                    });
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


    $scope.getProduct = function(){
        var id = $routeParams.id;
        customerService.getProductById(id).then(function(response){
            if(response.data.code == 200){
                $scope.product = response.data.data;
                getRecommondedProducts();
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

    $scope.addToCart = function(product){
        var product = {
            id : product._id,
            name : product.name,
            category_name : product.categoryName,
            providerName : product.brand,
            priceEachItem : product.priceEachItem,
            stockType : product.stockType,
            quantity : 1,
            providerId : product.providerId,
            providerEmail : product.providerEmail,
            dealPrice : product.dealPrice
        }

        customerService.addToCart(product).then(function(response){
            if(response.data.code == 200){
                SweetAlert.swal("",response.data.message,"success");
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

    /*function getCustomerCart(){
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
    }*/

    $scope.getCategories = function(){
        customerService.getCategories().then(function(response){
            if(response.data.code == 200){
               
                $scope.productCategories = response.data.data.data;
                $scope.imageUrlCat = response.data.data.imageUrl;
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

    $scope.getCategoryProducts = function(){
        var id = $routeParams.id;
        customerService.getCategoryProducts(id).then(function(response){
            if(response.data.code == 200){
                $scope.subCatProdImag = response.data.data.imageUrl;
                $scope.categoryProducts = response.data.data.data;
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

    getCustomerCart();
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

    $scope.getSubCategories = function(){
        var categoryId = $routeParams.id;
        $scope.mainCatId = $routeParams.id;
        customerService.getSubCategories(categoryId).then(function(response){
            if(response.data.code == 200){
                $scope.imageUrlSubCat = response.data.data.imageUrl;
                $scope.subCategories = response.data.data.data;
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

    function getRecommondedProducts(){
        customerService.getRecommondedProducts({type: $scope.product.type, categoryId: $scope.product.categoryName}).then(function(response){
            if(response.data.code == 200){
                $scope.imageUrlReco = response.data.data.imageUrl;
                $scope.recommondedProducts = response.data.data.data;
            } else {
                SweetAlert.swal("", response.data.message, "warning")
            }
        }).catch(function(response) {
            SweetAlert.swal("", "Something went wrong", "warning")
        }); 
    }

    $scope.submitReview = function(rating, review){
        var reviewParam = {
            rating : rating,
            review : review,
            productId : $scope.product._id,
            productName : $scope.product.name
        }

        customerService.submitReview(reviewParam).then(function(response){
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

    $scope.getUserDetails = function(){
        var phoneNumber = $routeParams.id;
        customerService.getUserDetails(phoneNumber).then(function(response){
            if(response.data.code == 200){
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

    $scope.updateProfile = function(user){
        customerService.updateProfile(user).then(function(response){
            if(response.data.code == 200){
                SweetAlert.swal("",response.data.message,"success");
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

    $scope.compairePassword = function(pass, cpass){
        if(pass == cpass){
            $scope.passerror = false;
        } else {
            $scope.passerror = true;
        }
    }

    $scope.updatePassword = function(pass){
        customerService.updatePassword(pass).then(function(response){
            if(response.data.code == 200){
                SweetAlert.swal("",response.data.message,"success");
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