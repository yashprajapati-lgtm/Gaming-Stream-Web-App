const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" }, // ✅ Add this line
  avatar: { type: String, default: "" }, 
}, { timestamps: true });