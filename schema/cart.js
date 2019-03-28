

 module.exports = function(mongoose, common){
 	const Prefix = common.default_set.DB_PREFIX; 
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
	
	const Cart = mongoose.model( Prefix +'Cart', cartSchema);
	return Cart;
}