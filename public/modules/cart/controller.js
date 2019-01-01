


app.controller('cartController', ['$scope', 'cartService','toaster','$localStorage','$location','$routeParams','$rootScope','SweetAlert',  function($scope, cartService, toaster, $localStorage, $location, $routeParams, $rootScope, SweetAlert) {
    $scope.discount = 0;
    $rootScope.isFront = false;
     if($localStorage.isCustomerLogin){
        $rootScope.userLogin = true;
    }
    $scope.validCart = true;
    $scope.getCart = function(){
    	var cartId = $routeParams.id;
        cartService.getCart(cartId).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $scope.cart = response.data.data;
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


    $scope.updateCart = function(item,type){
    	var type = type;
    	var cartId = $routeParams.id;
    	var itemUpdate = {
    		type : type,
    		cartId:cartId,
    		itemId: item.id,
    		quantity: (item.quantity < 0 || item.quantity == null) ? 1 : item.quantity
    	}

    	cartService.updateCart(itemUpdate).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $scope.validCart = true;
                $scope.getCart();
            } else {
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: response.data.message
                });
                $scope.validCart = false;
            }
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        });
    }


    $scope.clearCart = function(){
    	var cartId = $routeParams.id;
    	cartService.clearCart(cartId).then(function(response){
            if(response.data.code == 200){
                toaster.pop({
                    type: 'success',
                    title: '',
                    body: response.data.message
                });
                $location.path("/customer/dashboard");

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

    $scope.getDeliveryCharge = function(){
    	cartService.getDeliveryCharge().then(function(response){
            if(response.data.code == 200){
                $scope.deliveryPercent = response.data.data.deliveryPercentage;
                $scope.gstTax = response.data.data.gstCharges;
                $scope.deliveryPrice = response.data.data.deliveryPrice;
                $scope.minPerchaseAmt = response.data.data.minPerchaseAmt;
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

    function getGst(){
    	return $scope.gstCharge = $scope.gstTax;
    }

    function getDelivery(){
        if($scope.cart.orderNetAmount <= $scope.deliveryPrice){
            $scope.deliveryHint = "Add more items for free delivery";
            return $scope.deliveryCharge = $scope.cart.orderNetAmount * ($scope.deliveryPercent /100);
        } else {
            $scope.deliveryHint = "";
            return $scope.deliveryCharge = 0;
        }
    }

    $scope.getAllTotal = function(){
        if($scope.cart.orderNetAmount < $scope.minPerchaseAmt){
            $scope.orderAmountHint = "Order total should be greater than Rupees " + $scope.minPerchaseAmt;
            $scope.blockPurchase = true;
        } else {
            $scope.orderAmountHint = "";
            $scope.blockPurchase = false;
        }
        $scope.orderNetAmount = parseInt($scope.cart.orderNetAmount) + getDelivery() + getGst();
        return $scope.orderNetAmount;
    }

    $scope.placeOrder = function(cartData) {
        SweetAlert.swal({
                title: "Are you sure?",
                text: "You are placing this order?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Place Order!",
                closeOnConfirm: false
            },
            function(isConfirm) {
                if(isConfirm){
                    var orderData = {
                        cartId: $routeParams.id,
                        orderNetAmount: $scope.orderNetAmount,
                        deliveryCharge: $scope.deliveryCharge,
                        gstCharge: $scope.deliveryCharge,
                        discount: $scope.discount
                    }

                    cartService.placeOrder(orderData).then(function(response) {
                        if (response.data.code == 200) {
                            SweetAlert.swal("Your order placed sucessfully");
                            $location.path("/customer/order/" + response.data.data.id)
                        } else {
                            SweetAlert.swal(response.data.message);
                        }
                    }).catch(function(response) {
                        SweetAlert.swal("Something went wrong");
                    });
                }
            });
    }

}])