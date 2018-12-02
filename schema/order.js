

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const OrderSchema = new Schema({
	  orderNumber: {type: String},
	  totalCost: {type: Number},
	  tax: {type: Number},
	  serviceFee: {type: Number},
	  deliveryCharges: {type: Number},
	  deliveryAddress: {type: Array},
	  userId: {type: String},
	  userName: {type: String},
	  phoneNumber: {type: Number},
	  product: {type: Array},
	  imageName : {type: String}, 
	  status: { type: Boolean, default: true }, 
	  isDeleted: { type: Boolean, default: false}
	},{ timestamps: { createdAt: 'created_at' } });
	
	const Order = mongoose.model('Orders', OrderSchema);
	return Order;
}


