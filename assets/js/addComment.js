import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseCommentNumber = () => {
  const increasedNum = parseInt(commentNumber.innerHTML, 10) + 1;
  if (increasedNum === 1) {
    commentNumber.innerHTML = `${increasedNum} comment`;
  } else {
    commentNumber.innerHTML = `${increasedNum} comments`;
  }
};

const addComment = comment => {
  const li = document.createElement("li");
  const pre = document.createElement("pre");
  pre.innerHTML = comment;
  li.appendChild(pre);
  commentList.prepend(li);
  increaseCommentNumber();
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  //   console.log(videoId);
  console.log(videoId, comment);
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "post",
    data: {
      comment
    }
  });
  console.log(response);
  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentTextarea = addCommentForm.querySelector("textarea");
  const comment = commentTextarea.value;
  sendComment(comment);
  commentTextarea.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
