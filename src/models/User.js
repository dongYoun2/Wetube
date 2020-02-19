import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: String,
  facebookId: Number,
  githubId: Number
});

////// 추가 코드
// UserSchema.statics.serializeUser = () => (user, cb) => cb(null, user.id);

// UserSchema.statics.deserializeUser = () => {
//   const self = this;
//   return (id, cb) => self.findById(id, cb);
// };
/////////

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});
const model = mongoose.model("User", UserSchema);

export default model;
