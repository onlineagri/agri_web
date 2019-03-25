

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const OrderSchema = new Schema({
	  orderNumber: {type: String},
	  totalCost: {type: Number},
	  discount : {type: Number},
	  actualPrice : {type: Number},
	  deliveryAddress : {type: String},
	  deliveryCharges : {type: String},
	  customerName : {type: String},
	  customerPhone : {type: String},
	  customerEmail : {type: String},
	  tax: {type: Number},
	  customerId: {type: String},
	  product: {type: Array}, 
	  status: { type: String, default: 'placed' }, 
	  isDeleted: { type: Boolean, default: false},
	  specialRequest : {type: String},
	  amountPaid : {type: Number},
	  cust_id : {type: String}
	},{ timestamps: { createdAt: 'created_at' } });
	
	const Order = mongoose.model('Orders', OrderSchema);
	return Order;
}


