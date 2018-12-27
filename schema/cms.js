

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const CmsSchema = new Schema({
        contentfor: {type: String},
        heading: {type: String},
        description: {type: String},
        status: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false}
	},{ timestamps: { createdAt: 'created_at' } });
	
	const CMS = mongoose.model('CMS', CmsSchema);
	return CMS;
}


