 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const MenuClothingSchema = new Schema({
	  name: { type: String, required: true},
	  description: { type: String},
	  categoryId: mongoose.Schema.Types.ObjectId,
	  categoryName : {type: String},
	  type: {type: String},
	  imageArray : {type: Array}, 
	  status: { type: Boolean, default: true }, 
	  isDeleted: { type: Boolean, default: false},
	  applicationPrice: {type: Number},
	  dealPrice: {type: Number},
	  quantity: {type: Number},
	  remainingQuantity: {type: Number},
	  provideId : mongoose.Schema.Types.ObjectId,
	  providerName : {type: String},
	  priceEachItem: {type: Number},
	  providerPrice : {type: Number},
	  brand: {type: String},
	  size : {type: String},
	  colour : {type: String},
	  packOf : {type: Number, default: 1},
	  fabric : {type: String},
	  sleeve : {type: String, default: 'Half'},
	  pattern : {type: String},
	  styleCode : {type: String},
	  closure : {type: String},
	  fit : {type: String},
	  collor : {type: String},
	  fabricCare : {type: String},
	  suitableFor : {type: String},
	  pockets : {type: String},
	  outerMaterial : {type: String},
	  soleMaterial : {type: String},
	  weight : {type : Number}



	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Clothingmenus = mongoose.model('Clothingmenus', MenuClothingSchema);
	return Clothingmenus;
}
