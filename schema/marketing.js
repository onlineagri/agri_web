 module.exports = function(mongoose, common){
        const Prefix = common.default_set.DB_PREFIX || '';
	const Schema = mongoose.Schema;
	const MarketingSchema = new Schema({
        contentfor: {type: String},
        heading: {type: String},
        description: {type: String},
        loginUsers : {type: Boolean, default: false},
        guestUsers : {type: Boolean, default: false},
        status: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false}
	},{ timestamps: { createdAt: 'created_at' } });
	
	const marketing = mongoose.model(Prefix + 'marketing', MarketingSchema);
	return marketing;
}
