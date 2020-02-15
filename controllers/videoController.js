import routes from "../routes";
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  console.log(req.user);

  const {
    query: { term: searchingBy }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      $or: [
        { title: { $regex: searchingBy, $options: "i" } },
        { description: { $regex: searchingBy, $options: "i" } }
      ]
    }).sort({ _id: -1 });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path }
  } = req;
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  // console.log(newVideo);
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate({
        path: "comments",
        populate: {
          path: "creator",
          model: User
        }
      });
    video.views += 1;
    await video.save();
    console.log(video);
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findByIdAndUpdate(id, { title, description });
    // above line is same as
    // await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    } else {
      // video.remove();
      // video.save(); -> video.remove() 하면 이 코드 수행할 필요 X

      await Video.findByIdAndRemove(id);
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Video View

// export const postRegisterView = async (req, res) => {
//   const {
//     params: { id }
//   } = req;
//   try {
//     const video = await Video.findById(id);
//     video.views += 1;
//     await video.save();
//     res.status(200);
//   } catch (error) {
//     res.status(400);
//   } finally {
//     res.end();
//   }
// };

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    console.log(req);
    if (!user) {
      // login 안 된 경우
      console.log("❌유저가 로그인 안 하고 댓글을 달려고 합니다");
      return;
    }
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
    console.log(error);
  } finally {
    res.end();
  }
};
