import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;

  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
    // res.redirect(routes.join); // above, Nico code. This, my code.
  } else {
    try {
      const user = await User({
        name,
        email,
        avatarUrl: process.env.DEFAULT_AVATAR_URL
      });
      await User.register(user, password);
      // console.log(user);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

export const githubVerifyCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, email }
  } = profile;
  let {
    _json: { name }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      // console.log(user);
      return cb(null, user);
    }
    if (name === null) name = id;
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    // console.log(user);
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = passport.authenticate("github", {
  failureRedirect: routes.login,
  successRedirect: routes.home
});

export const facebookLogin = passport.authenticate("facebook");

export const facebookVerifyCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, email }
  } = profile;
  let {
    _json: { name }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    if (name === null) name = id;
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postFacebookLogin = passport.authenticate("facebook", {
  failureRedirect: routes.login,
  successRedirect: routes.home
});

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    // console.log(user);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    // console.log(error);
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    console.log(user);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    // console.log(error);

    res.redirect(routes.me);
  }
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  // console.log(name, email, file);
  // console.log(req.user);
  console.log(file);
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? `/${file.path}` : req.user.avatarUrl
    });
    console.log(req.user);
    // req.user.name = name;
    // req.user.email = email;

    res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    res.redirect(routes.editProfile); // 나중에 이걸로 고치심
    // res.render("editProfile", { pageTitle: "Edit Profile" });
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
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
