

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const MenuSchema = new Schema({
	  name: { type: String, required: true},
	  description: { type: String},
	  categoryId: {type: String},
	  categoryName : {type: String},
	  imageName : {type: String}, 
	  status: { type: Boolean, default: true }, 
	  isDeleted: { type: Boolean, default: false},
	  applicationPrice: {type: Number},
	  dealPrice: {type: Number},
	  quantity: {type: Number},
	  remainingQuantity: {type: Number},
	  farmerId : {type: String},
	  farmerName : {type: String},
	  priceEachItem: {type: Number},
	  stockType : {type: String, default: 'kg'},
	  farmerPrice : {type: Number},
	  brand: {type: String}

	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Menu = mongoose.model('Menus', MenuSchema);
	return Menu;
}


