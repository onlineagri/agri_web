

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const OrderSchema = new Schema({
	  orderId: { type: String, required: true},
	  orderNetAmount: { type: Number},
	  gst_tax: {type: Number},
	  delivery_charge : {type: Number},
	  delivery_address : {type: String}, 
	  discount: { type: Number}, 
	  products: { type: Array},
	  customerName: {type: String},
	  customerEmail: {type: String},
	  customerPhone: {type: String},
	  customerId : {type: String},
	  amountPaid: {type: Number},
	  status : {type: String, default: "Placed"},
	  isDeleted : {type: Boolean, default: false}
	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Orders = mongoose.model('Orders', OrderSchema);
	return Orders;
}


