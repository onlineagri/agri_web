var baseUrl = window.location.protocol + '//' + window.location.host;

var webservices = {
    "adminLogin": baseUrl + "/api/login",
    "addCategory" : baseUrl + "/admin/category",
    "updateCategory" : baseUrl + "/admin/category",
    "getCategories" : baseUrl + "/admin/category",
    "getCategoryById" : baseUrl + "/admin/category",
    "deleteCategory": baseUrl + "/admin/category",
    "getCustomers" : baseUrl+ "/admin/customer",
    "adminAddCustomer" : baseUrl + "/admin/customer",
    "getCustomer" : baseUrl + "/admin/customer",
    "userLogin" : baseUrl + "/api/login",
    "customerRegister": baseUrl + "/api/register",
    "addMenu" : baseUrl + "/admin/menu",
    "updateMenu" : baseUrl + "/admin/menu",
    "getMenuList" : baseUrl + "/admin/menu",
    "getMenuById" : baseUrl + "/admin/menu",
    "deleteMenu": baseUrl + "/admin/menu",
    "getNewProducts" : baseUrl + "/product/getnewproducts",
    "getFamrmerList" : baseUrl + "/admin/farmer/list",
    "getProduct" : baseUrl + "/product/getproduct",
    "addToCart" : baseUrl + "/product/addtocart",
    "getCustomerCart": baseUrl + "/product/cart",
    "getCart" : baseUrl + "/product/cart",
    "updateCart" : baseUrl + "/product/cart",
    "placeOrder" : baseUrl + "/order/placeorder",
    "getOrder" : baseUrl + "/order/getorder",
    "getOrders" : baseUrl + "/order/getorders",
    "getProductCategories" : baseUrl + "/product/getproductcategories",
    "getCategoryProducts" : baseUrl + "/product/getcategoryproducts",
    "getOrders": baseUrl + "/admin/order",
    "getOrderById": baseUrl + "/admin/order",
    "userForgotPass" : baseUrl + "/api/forgotpass",
    "checktoken" : baseUrl + "/api/checktoken",
    "changePassword" : baseUrl + "/api/changepassword",
    "updateOrderStatus": baseUrl + "/admin/order",
    "addContent": baseUrl + "/admin/cms",
    "getContents": baseUrl + "/admin/cms",
    "getCmsContent": baseUrl + "/admin/cms",
    "deleteContent": baseUrl + "/admin/cms",
    "addClothingMenu" : baseUrl + "/admin/clothingmenu",
    "getUsers" : baseUrl + "/admin/users"
}

var headerConstants = {

    "json": "application/json"

}
