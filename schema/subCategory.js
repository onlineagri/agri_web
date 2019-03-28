 module.exports = function(mongoose, common){
 	const Prefix = common.default_set.DB_PREFIX || '';
	const Schema = mongoose.Schema;
	const SubCategorySchema = new Schema({
	  categoryId : mongoose.Schema.Types.ObjectId,
	  categoryName : { type: String, required: true},
	  name: { type: String, required: true},
	  description: { type: String},
	  imageName : {type: String}, 
	  status: { type: Boolean, default: true }, 
	  isDeleted: { type: Boolean, default: false}
	},{ timestamps: { createdAt: 'created_at' } });
	
	const SubCategory = mongoose.model(Prefix + 'SubCategorys', SubCategorySchema);
	return SubCategory;
}
