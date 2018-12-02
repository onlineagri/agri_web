

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const CategorySchema = new Schema({
	  name: { type: String, required: true},
	  description: { type: String},
	  type : {type: String},
	  imageName : {type: String}, 
	  status: { type: Boolean, default: true }, 
	  isDeleted: { type: Boolean, default: false},
	  other: {type: String}
	});
	
	const Category = mongoose.model('Categorys', CategorySchema);
	return Category;
}


