

 module.exports = function(mongoose, common) {
     const Prefix = common.default_set.DB_PREFIX;
     console.log(Prefix,"Prefix");
     const Schema = mongoose.Schema;
     const CategorySchema = new Schema({
         cat_id: {
             type: String,
             required: true
         },
         name: {
             type: String,
             required: true
         },
         imageName: {
             type: String
         },
         status: {
             type: String,
             default: true
         }, //active, inactive 
         isDeleted: {
             type: Boolean,
             default: false
         }
     }, {
         timestamps: {
             createdAt: 'created_at'
         }
     });

     CategorySchema.index({
         cat_id: 1
     }, {
         unique: true,
     });


     const Category = mongoose.model(Prefix+'Categorys', CategorySchema);
     return Category;
 }

