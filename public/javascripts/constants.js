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

}

var headerConstants = {

    "json": "application/json"

}
