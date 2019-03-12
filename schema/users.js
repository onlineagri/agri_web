

 module.exports = function(mongoose){
	const Schema = mongoose.Schema;
	const UserSchema = new Schema({
	  firstName: { type: String},
	  lastName: { type: String},
	  email: { type: String},
	  phoneNumber: { type: String, required: true},
	  password: {type: String, required: true},
	  address : {
	  	area : {type : String},
	  	houseNo : {type: String},
	  	city : {type: String},
	  	state : { type: String},
	  	pincode : {type: String}
	  },
	  role: { type: String, required: true }, //customer, admin, retailer, employee
	  status: { type: String }, // inRegistration, active, suspended
	  isDeleted: { type: Boolean, default: false},
	  passwordToken : {type: String},
	  verificationCode : {type: String},
	  userId : {type: String},
	  deliveryAddresses : {type: String}
	},
	{ timestamps: { createdAt: 'created_at' } });
	
	const Users = mongoose.model('Users', UserSchema);
	return Users;
}


