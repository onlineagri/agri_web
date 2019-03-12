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
    "addProduct" : baseUrl + "/admin/product",
    "getProductById" : baseUrl + "/admin/product",
    "updateProduct" : baseUrl + "/admin/product",
    "getProductList" : baseUrl + "/admin/getproductlist",
    "deleteProduct": baseUrl + "/admin/product",
    "getCombos" : baseUrl + "/admin/combo",
    "getProductsCombo" : baseUrl + "/admin/comboproducts",
    "addCombo" : baseUrl + "/admin/combo",
    "getComboById" : baseUrl + "/admin/combo",
    
    
    
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
    "getUsers" : baseUrl + "/admin/users",
    "getBusinessPersons" : baseUrl + "/admin/businessperson",
    "adminAddBusinessPerson" : baseUrl + "/admin/businessperson",
    "getBusinessPerson" : baseUrl + "/admin/businessperson",
    "adminUpdateBusinessPerson" : baseUrl + "/admin/businessperson",
    "adminDeleteBusinessPerson" : baseUrl + "/admin/businessperson",
    "addSubCategory" : baseUrl + "/admin/subcategory",
    "getSubCategories" : baseUrl + "/admin/subcategory",
    "getSubCategoriesCust" : baseUrl + "/product/getsubcategories",
    "getRecommondedProducts" : baseUrl + "/product/getrecommondedproducts",
    "submitReview" : baseUrl + "/product/submitreview",
    "getDeliveryCharges" : baseUrl + "/product/systemparams",
    "getSystemParams" : baseUrl + "/admin/systemparams",
    "updateDeliveryCharges" : baseUrl + "/admin/systemparams",
    "getUserDetails" : baseUrl + "/user/customer",
    "updateProfile" : baseUrl + "/user/customer",
    "updatePassword": baseUrl + "/user/updatepassword",
    "getCustAddress" : baseUrl + "/user/getaddress",
    "sendContactEmail" : baseUrl + "/api/sendcontactemail",
    "cancleOrder" : baseUrl + "/order/cancleorder",
    "getCms" : baseUrl + "/cms/getcms",
    "addMarketing" : baseUrl + "/admin/marketing/content",
    "getMarketingContents" : baseUrl + "/admin/marketing/content",
    "updateMarketing" : baseUrl + "/admin/marketing/content",
    "getMarketingContent" : baseUrl + "/admin/marketing/content",
    "marketingDeleteContent" : baseUrl + "/admin/marketing/content",
    "getMarketingCustomer" : baseUrl + "/cms/marketingcontent",
    "verifyOtp" : baseUrl + "/api/verifyotp"
}

var headerConstants = {

    "json": "application/json"

}
