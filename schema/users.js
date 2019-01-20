

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const UserSchema = new Schema({
	  firstName: { type: String, required: true},
	  lastName: { type: String, required: true},
	  email: { type: String},
	  phoneNumber: { type: String, required: true},
	  streetAddress: { type: String},
	  password: {type: String, required: true},
	  city: { type: String},
	  state: { type: String},
	  country: { type: String},
	  pincode: { type: String},
	  role: { type: String, required: true }, //customer, farmer, admin
	  status: { type: String }, // inRegistration, active, suspended
	  isDeleted: { type: Boolean, default: false},
	  about: {type: String},
	  address : {type: String},
	  passwordToken : {type: String},
	  verificationCode : {type: String},
	  verified : {type: Boolean, default: false}
	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Users = mongoose.model('Users', UserSchema);
	return Users;
}


