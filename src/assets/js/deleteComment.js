import axios from "axios";

const commentList = document.getElementById("jsCommentList");
const commentDeleteBtns = document.getElementsByClassName("comment-deleteBtn");
const commentsNumber = document.getElementById("jsCommentNumber");

const decreaseCommentsNumber = () => {
  const decreasedNum = parseInt(commentsNumber.innerHTML, 10) - 1;
  if (decreasedNum === 1) {
    commentsNumber.innerHTML = `${decreasedNum} comment`;
  } else {
    commentsNumber.innerHTML = `${decreasedNum} comments`;
  }
};

const deleteComment = commentItem => {
  commentList.removeChild(commentItem);
};

const checkCommentDelete = statusCode => {
  return statusCode === 200;
};

const sendDeleteComment = async comment => {
  const response = await axios({
    url: `/api/${comment.id}/comment/delete`,
    method: "post"
  });
  console.log(response);
  if (checkCommentDelete(response.status)) {
    deleteComment(comment);
    decreaseCommentsNumber();
  }
};

const handleClick = event => {
  const deleteCommentBlock = event.target.closest("li");
  sendDeleteComment(deleteCommentBlock);
};

function init() {
  for (let i = 0; i < commentDeleteBtns.length; i++) {
    commentDeleteBtns[i].addEventListener("click", handleClick);
  }
}

if (commentDeleteBtns.length) {
  init();
}

export default handleClick;
