import Video from "../models/Video";
import Comment from "../models/Comment";
import routes from "../routes";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log("home: ", error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
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
    console.log("search: ", error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location }
  } = req;
  // console.log(location);
  try {
    const newVideo = await Video.create({
      fileUrl: location,
      title,
      description,
      creator: req.user.id
    });
    // 아래 두 줄은 user schema 가 video id를 참조하고 있을 시
    // req.user.videos.push(newVideo.id);
    // req.user.save();

    // console.log(newVideo);
    req.flash("success", "Video uploaded.");
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (error) {
    req.flash("error", "Can't upload video.");
    res.redirect(routes.upload);
    console.log("postUpload: ", error);
  }
};

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id).populate("creator");
    const comments = await Comment.find({ video: video.id }).populate(
      "creator"
    );
    video.views += 1;
    await video.save();
    res.render("videoDetail", { pageTitle: video.title, video, comments });
  } catch (error) {
    req.flash("error", "Video not found");
    res.redirect(routes.home);
    console.log("videoDetail: ", error);
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
    console.log("getEditVideo: ", error);
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
    req.flash("success", "Video detail updated.");
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    req.flash("error", "Can't update video detail.");
    res.redirect(routes.home);
    console.log("postEditVideo: ", error);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      req.flash("error", "Can't delete others' video.");
      console.log(
        "deleteVideo: someone tries to delete other's video through URL. "
      );
      // throw Error("not allowed to delete other's video through URL.");
    } else {
      // video.remove();
      // video.save(); -> video.remove() 하면 이 코드 수행할 필요 X
      await Video.findByIdAndDelete(id);
      const response = await Comment.deleteMany({ video: id });
      if (response.ok !== 1) {
        throw Error("error on removing certain video's comments");
      }
      req.flash("success", "Video deleted.");
    }
  } catch (error) {
    req.flash("error", "Can't delete video.");
    console.log("deleteVideo: ", error);
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
