
 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const ServiceSchema = new Schema({
	  name: { type: String, required: true},
	  package: { type: Array},
	  status: { type: Boolean, default: true }, 
	  isDeleted: { type: Boolean, default: false}
	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Service = mongoose.model('Service', ServiceSchema);
	return Service;
}