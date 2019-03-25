 module.exports = function(mongoose){
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
	
	const Reviews = mongoose.model('Reviews', ReviewSchema);
	return Reviews;
}
