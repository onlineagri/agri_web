

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
	  actualPrice: {type: Number},
	  dealPrice: {type: Number},
	  quantity: {type: Number},
	  remainingQuantity: {type: Number},
	  farmerId : {type: String},
	  priceEachItem: {type: Number}
	});
	
	const Menu = mongoose.model('Menus', MenuSchema);
	return Menu;
}


