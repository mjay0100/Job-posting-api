const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

UserSchema.pre("save", async function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

UserSchema.methods.createJWT = function(){
  return jwt.sign({userId:this.id,name:this.name}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_TIME})
}

UserSchema.methods.comparePassword = async function(password){
  const match = await bcrypt.compareSync(password, this.password);
  return match
}

module.exports = mongoose.model("User", UserSchema);
