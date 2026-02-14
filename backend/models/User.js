const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /.+\@.+\..+/
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  bio: { 
    type: String, 
    default: "" 
  },
  role: { 
    type: String, 
    default: "user" 
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);