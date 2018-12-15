

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const cartSchema = new Schema({
	  customerId: mongoose.Schema.Types.ObjectId,
	  orderNetAmount : {type: Number},
	  customerName : {type: String}, 
	  customerEmail : {type: String}, 
	  customerPhonenumber : {type: String},
	  customerAddress : {type: String},  
	  status: { type: Boolean, default: true },
	  products: {type: Array}

	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Cart = mongoose.model('Cart', cartSchema);
	return Cart;
}