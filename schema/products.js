 const mongoosePaginate = require('mongoose-paginate');

module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const ProductSchema = new Schema({
	  prod_id : {type: String, required: true},
	  name: { type: String, required: true},
	  imageName : {type: String},
	  price : {type: Number},
	  dealPrice : {type: Number},
	  actualPrice : {type: Number},
	  category_id : {type: String},
	  category_name : {type: String},
	  cat_id : {type: String},
	  retailer_id : {type: String},
	  retailer_name : {type: String},
	  quantity_remaining : {type: Number},
	  quantity : {type: Number},
	  price_range : {type: String}, //high, medium, low
	  stockType : {type: String}, //kg, litre, item
	  isChemicalfree : {type: Boolean},
	  description : {type: String},
	  isDaily : {type: Boolean},  
	  status: { type: String}, //active, inactive 
	  isDeleted: { type: Boolean, default: false}
	},{ timestamps: { createdAt: 'created_at' } });

    ProductSchema.index({
        prod_id: 1,
        cat_id: 1
    }, {
        unique: true,
    });
	
	ProductSchema.plugin(mongoosePaginate);
	const Product = mongoose.model('Products', ProductSchema);
	return Product;
}