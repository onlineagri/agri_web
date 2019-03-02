

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
	  tax: {type: Number},
	  customerId: {type: String},
	  product: {type: Array}, 
	  status: { type: Boolean, default: true }, 
	  isDeleted: { type: Boolean, default: false},
	  specialRequest : {type: String}
	},{ timestamps: { createdAt: 'created_at' } });
	
	const Order = mongoose.model('Orders', OrderSchema);
	return Order;
}


