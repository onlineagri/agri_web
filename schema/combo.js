 const mongoosePaginate = require('mongoose-paginate');

 module.exports = function(mongoose, common){
 	const Prefix = common.default_set.DB_PREFIX;
	const Schema = mongoose.Schema;
	const ComboSchema = new Schema({
	  combo_id : {type: String},
	  name: { type: String, required: true},
	  imageName : {type: String},
	  actualPrice : {type: Number},
	  price : {type: Number},
	  description : {type: String},
	  products : [{
	  	name : {type: String},
	  	id : {type: String},
	  	price : {type: Number}
	  }], 
	  status: { type: String, default: 'active' }, //active, inactive 
	  comboDiscount : {type: Number},
	  isDeleted: { type: Boolean, default: false}
	},{ timestamps: { createdAt: 'created_at' } });
	
	ComboSchema.plugin(mongoosePaginate);
	const Combo = mongoose.model(Prefix +'Combos', ComboSchema);
	return Combo;
}

