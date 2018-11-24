var baseUrl = window.location.protocol + '//' + window.location.host;

var webservices = {
    "adminLogin": baseUrl + "/api/login",
    "addCategory" : baseUrl + "/admin/category/add",
    "updateCategory" : baseUrl + "/admin/category/update",
    "getCategories" : baseUrl + "/admin/category"
}

var headerConstants = {

    "json": "application/json"

}
