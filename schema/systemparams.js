
 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const SystemParamsSchema = new Schema({
	  type : {type: String},
	  deliveryCharges : {type: Number},
	  gstCharges : {type: Number},
	  productsPerPerson : {type: Number}

	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const SystemParams = mongoose.model('SystemParams', SystemParamsSchema);
	return SystemParams;
}