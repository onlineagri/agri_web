
 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const SystemParamsSchema = new Schema({
	  type : {type: String},
	  deliveryPercentage : {type: Number},
	  deliveryPrice : {type: Number},
	  gstCharges : {type: Number},
	  productsPerPerson : {type: Number},
	  minPerchaseAmt : {type: Number}
	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const SystemParams = mongoose.model('SystemParams', SystemParamsSchema);
	return SystemParams;
}