'use strict'

const Mongoose = require('mongoose');
const common = require('./config/common');

var bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 8;

Mongoose.connect(common.default_set.mongoConnectionString);
const users = require('./schema/users')(Mongoose);
const categories = require('./schema/category')(Mongoose);
const menus = require('./schema/menu')(Mongoose);
const carts = require('./schema/cart')(Mongoose);
const systemparams = require('./schema/systemparams')(Mongoose);
const orders = require('./schema/orders')(Mongoose);
const cms = require('./schema/cms')(Mongoose);
const subcategories = require('./schema/subCategory')(Mongoose);
const reviews = require('./schema/review')(Mongoose);
const marketing = require('./schema/marketing')(Mongoose);
const service = require('./schema/service')(Mongoose);

module.exports = {
    generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    validPassword: function(password, comparePassword) {
        return bcrypt.compareSync(password, comparePassword);
    },
    UserModel: function(){
    	return users;
    },
    CategoryModel: function(){
    	return categories;
    },
    MenuModel: function(){
        return menus;
    },
    CartModel: function(){
        return carts;
    },
    SystemParamsModel: function(){
        return systemparams;
    },
    OrderModel : function(){
        return orders;
    },
    CmsModel : function(){
        return cms;
    },
    SubCategoryModel : function(){
        return subcategories;
    },
    ReviewModel : function(){
        return reviews;
    },

    MarketingModel : function(){
        return marketing;
    },

    ServiceModel : function() {
        return service;
    }    

}