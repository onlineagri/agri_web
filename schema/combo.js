 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const ComboSchema = new Schema({
	  combo_id : {type: String},
	  name: { type: String, required: true},
	  imageName : {type: String},
	  price : {type: Number},
	  description : {type: String},
	  products : {
	  	name : {type: String},
	  	id : {type: String},
	  	price : {type: Number}
	  }, 
	  status: { type: Boolean, default: true }, //active, inactive 
	  isDeleted: { type: Boolean, default: false}
	},{ timestamps: { createdAt: 'created_at' } });
	
	const Combo = mongoose.model('Combos', ComboSchema);
	return Combo;
}
