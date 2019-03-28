 module.exports = function(mongoose, common){
 	const Prefix = common.default_set.DB_PREFIX || '';
	const Schema = mongoose.Schema;
	const ReviewSchema = new Schema({
	  review: { type: String},
	  rating: { type: Number},
	  userId: mongoose.Schema.Types.ObjectId,
	  itemId : mongoose.Schema.Types.ObjectId,
	  userName : { type: String},
	  itemName : {type: String},
	  status: {type: Boolean, default: true},
	  isDeleted : {type: Boolean, default: false}

	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Reviews = mongoose.model(Prefix + 'Reviews', ReviewSchema);
	return Reviews;
}
