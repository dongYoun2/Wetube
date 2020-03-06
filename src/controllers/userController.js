import passport from "passport";
import routes from "../routes";
import User from "../models/User";
import Video from "../models/Video";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  const {
    locals: { defaultAvatarUrl }
  } = res;
  if (password !== password2) {
    req.flash("error", "Passwords don't match.");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
    // res.redirect(routes.join); // above, Nico code. This, my code.
  } else {
    try {
      const existUser = await User.findOne({ email });
      if (existUser) {
        if (existUser.githubId) {
          req.flash("error", "You already have an account with Github.");
          res.redirect(routes.join);
        } else if (existUser.facebookId) {
          req.flash("error", "You already have an account with Facebook.");
          res.redirect(routes.join);
        } else {
          req.flash("error", "You already have Wetube account.");
          res.redirect(routes.join);
        }
        return;
      }
      const user = await User({
        name,
        email,
        avatarUrl: defaultAvatarUrl
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log("PostJoin: ", error);
      res.redirect(routes.join);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome",
  // failureFlash: true
  failureFlash: "Can't log in. Check email and/or password."
});

export const githubLogin = passport.authenticate("github");

export const githubVerifyCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, email, name }
  } = profile;
  try {
    // console.log(profile);
    const user = await User.findOne({ githubId: id });
    if (user) {
      return cb(null, user);
    }
    if (await User.findOne({ email })) {
      throw Error("You already have Wetube account.");
    }
    const newUser = await User.create({
      email: email || undefined,
      name: name || id,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    console.log("githubVerifyCallback: ", error);
    return cb(null, false, { message: error.message });
  }
};

export const postGithubLogin = passport.authenticate("github", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome",
  failureFlash: true
  // failureFlash: "Can't log in with Github. Check Github ID or password."
});

export const facebookLogin = passport.authenticate("facebook");

export const facebookVerifyCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, email, name }
  } = profile;
  try {
    const user = await User.findOne({ facebookId: id });
    if (user) {
      return cb(null, user);
    }
    if (!email) {
      throw Error("Allow your Facebook email public first.");
    }
    if (await User.findOne({ email })) {
      throw Error("you already have account.");
    }
    const newUser = await User.create({
      email,
      name: name || id,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(null, false, { message: error.message });
  }
};

export const postFacebookLogin = passport.authenticate("facebook", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome",
  failureFlash: true
  // failureFlash: "Can't log in with Facebook. Check Github ID or password."
});

export const logout = (req, res) => {
  req.flash("info", "Logged out. See you later.");
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const videos = await Video.find({ creator: req.user.id });
    // console.log(user);
    res.render("userDetail", { pageTitle: "User Detail", user, videos });
  } catch (error) {
    req.flash("error", "User not found.");
    res.redirect(routes.home);
    console.log("getMe: ", error);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    const videos = await Video.find({ creator: id });
    // console.log(user);
    res.render("userDetail", { pageTitle: "User Detail", user, videos });
  } catch (error) {
    res.redirect(routes.home);
    console.log("userDetail: ", error);
  }
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    const existUser = await User.findOne({ email });
    if (existUser && existUser.id !== req.user.id) {
      req.flash("error", "Email already exists. User other email.");
      res.redirect(`/users/${routes.editProfile}`);
      return;
    }
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email: email || null,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    req.flash("success", "Profile updated");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't update profile.");
    res.redirect(`/users/${routes.editProfile}`);
    console.log("postEditProfile: ", error);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "Passwords don't match.");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    req.flash("success", "password changed.");
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    req.flash("error", "Can't change password.");
    res.redirect(`/users${routes.changePassword}`);
    console.log("postChangePassword: ", error);
  }
};
