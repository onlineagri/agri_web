

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const MenuAgriSchema = new Schema({
	  name: { type: String, required: true},
	  description: { type: String},
	  categoryId: mongoose.Schema.Types.ObjectId,
	  categoryName : {type: String},
	  type : {type: String},
	  isOrganic : {type: Boolean, default: false},
	  imageName : {type: String}, 
	  status: { type: Boolean, default: true }, 
	  isDeleted: { type: Boolean, default: false},
	  applicationPrice: {type: Number},
	  dealPrice: {type: Number},
	  quantity: {type: Number},
	  remainingQuantity: {type: Number},
	  providerId : mongoose.Schema.Types.ObjectId,
	  providerName : {type: String},
	  priceEachItem: {type: Number},
	  stockType : {type: String, default: 'kg'},
	  farmerPrice : {type: Number},
	  brand: {type: String},
	  holesaleprice : {type: Number},
	  holesalequantity : {type: Number}
	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Agrimenus = mongoose.model('Agrimenus', MenuAgriSchema);
	return Agrimenus;
}


