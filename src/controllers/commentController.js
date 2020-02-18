import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

// Add Comment
export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    // console.log(req);
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
    res.send({
      commentId: newComment.id
    });
    req.flash("success", "Comment saved.");
  } catch (error) {
    res.status(400);
    console.log(`postAddComment: ${error}`);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const comment = await Comment.findById(id);
    if (comment.creator.toString() !== req.user.id) {
      throw Error();
    } else {
      await Comment.findByIdAndRemove(id);
    }
  } catch (error) {
    console.log(`postDeleteCommentt: ${error}`);
  }
  res.redirect(routes.home);
};
