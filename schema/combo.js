 module.exports = function(mongoose){
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
	
	const Combo = mongoose.model('Combos', ComboSchema);
	return Combo;
}
