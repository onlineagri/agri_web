'use strict'

const Mongoose = require('mongoose');
const common = require('./config/common');

var bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 8;

Mongoose.connect(common.default_set.mongoConnectionString);
const users = require('./schema/users')(Mongoose, common);
const categories = require('./schema/category')(Mongoose, common);
const carts = require('./schema/cart')(Mongoose, common);
const systemparams = require('./schema/systemparams')(Mongoose, common);
const orders = require('./schema/order')(Mongoose, common);
const cms = require('./schema/cms')(Mongoose, common);
const subcategories = require('./schema/subCategory')(Mongoose, common);
const reviews = require('./schema/review')(Mongoose, common);
const marketing = require('./schema/marketing')(Mongoose, common);
const product = require('./schema/products')(Mongoose, common);
const combo = require('./schema/combo')(Mongoose, common);

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

    ProductModel : function(){
        return product;
    },

    ComboModel : function(){
        return combo;
    }
}