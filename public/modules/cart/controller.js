


app.controller('cartController', ['$scope', 'cartService','toaster','$localStorage','$location','$routeParams','$rootScope','SweetAlert',  function($scope, cartService, toaster, $localStorage, $location, $routeParams, $rootScope, SweetAlert) {
    $scope.discount = 0;
    $rootScope.isFront = false;
     if($localStorage.isCustomerLogin){
        $rootScope.userLogin = true;
    } else {
        $location.path('/customer/login');
    }
    $scope.validCart = true;
    
    function getCustAddress(){
        cartService.getCustAddress().then(function(response){
            if(response.data.code == 200){
               var address = response.data.data;
               $scope.custaddress = (Object.keys(address).length === 0) ? '' : (address.flatNo + ", " + (address.wing ? address.wing :" ") + ", " + address.society + ", " + address.city + ", " + address.state + ", " + address.pincode);     
            } 
        }).catch(function(response) {
            toaster.pop({
                type: 'error',
                title: '',
                body: "Something went wrong"
            });
        })
    };
    getCustAddress();
    
    $scope.getCart = function(){
    	var cartId = $routeParams.id;
        cartService.getCart(cartId).then(function(response){
            if(response.data.code == 200){
                $scope.cart = response.data.data;
                $scope.cart.deliveryAddress = $scope.custaddress ? $scope.custaddress : '';
                // $scope.getAllTotal();
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
    	var cartId = $routeParams.id;
    	var itemUpdate = {
    		type : type,
    		cartId:cartId,
    		itemId: item.id,
    		quantity: (item.quantity < 0 || item.quantity == null) ? 1 : item.quantity,
            itemType : item.type
    	}

    	cartService.updateCart(itemUpdate).then(function(response){
            if(response.data.code == 200){
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
    	return $scope.gstCharge = $scope.cart.orderNetAmount * ($scope.gstTax/100)
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
        $scope.orderNetAmount = parseFloat($scope.cart.orderNetAmount) + getDelivery() + getGst();
        return parseFloat($scope.orderNetAmount).toFixed(2);
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
            if (isConfirm) {
                if (Object.keys(cartData.deliveryAddress).length == 0) {
                    var message = 'Please enter delivery address, <br><button  style="padding: 10px 10px 10px 10px; margin: 0; background-color: blue;"> <a href="#!/customer/profile/' + $localStorage.phoneNumber + '" style="color: white;" onclick="swal.close();">Go to profile</a></button><br>';
                    SweetAlert.swal({
                            title: "",
                            html: true,
                            text: message,
                            type: "warning",
                            showCancelButton: true,
                            closeOnConfirm: false
                        })
                        // SweetAlert.swal("","Please enter delivery address","warning");
                    return;
                }
                var orderData = {
                    cartId: $routeParams.id,
                    orderNetAmount: $scope.orderNetAmount,
                    deliveryCharge: $scope.deliveryCharge,
                    gstCharge: $scope.gstCharge,
                    discount: $scope.discount
                }
                if (cartData.deliveryAddress) {
                    orderData["deliveryAddress"] = cartData.deliveryAddress;
                }
                if (cartData.specialRequest) {
                    orderData["specialRequest"] = cartData.specialRequest;
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