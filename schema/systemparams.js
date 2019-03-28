
 module.exports = function(mongoose, common){
 	const Prefix = common.default_set.DB_PREFIX;
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
	
	const SystemParams = mongoose.model(Prefix + 'SystemParams', SystemParamsSchema);
	return SystemParams;
}