var baseUrl = window.location.protocol + '//' + window.location.host;

var webservices = {
    "adminLogin": baseUrl + "/api/login",
    "addCategory" : baseUrl + "/admin/category",
    "updateCategory" : baseUrl + "/admin/category",
    "getCategories" : baseUrl + "/admin/category",
    "getCategoryById" : baseUrl + "/admin/category",
    "deleteCategory": baseUrl + "/admin/category",
    "addMenu" : baseUrl + "/admin/menu",
    "updateMenu" : baseUrl + "/admin/menu",
    "getMenuList" : baseUrl + "/admin/menu",
    "getMenuById" : baseUrl + "/admin/menu",
    "deleteMenu": baseUrl + "/admin/menu"
}

var headerConstants = {

    "json": "application/json"

}
