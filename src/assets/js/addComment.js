import axios from "axios";
import handleDeleteComment from "./deleteComment";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentsNumber = document.getElementById("jsCommentNumber");

const increaseCommentsNumber = () => {
  const increasedNum = parseInt(commentsNumber.innerHTML, 10) + 1;
  if (increasedNum === 1) {
    commentsNumber.innerHTML = `${increasedNum} comment`;
  } else {
    commentsNumber.innerHTML = `${increasedNum} comments`;
  }
};

const addComment = (comment, newId) => {
  const li = document.createElement("li");
  li.classList.add("commentBlock");
  li.id = newId;

  const anchor1 = document.createElement("a");
  anchor1.href = `/users/${me._id}`;

  const img = document.createElement("img");
  img.classList.add("u-avatar");
  img.src = me.avatarUrl;

  anchor1.appendChild(img);

  li.appendChild(anchor1);

  const div1 = document.createElement("div");
  div1.classList.add("commentBlock__content");

  const div2 = document.createElement("div");
  div2.classList.add("comment-header");

  const div3 = document.createElement("div");
  div3.classList.add("comment-creator");

  const anchor2 = document.createElement("a");
  anchor2.href = `/users/${me._id}`;
  anchor2.innerText = me.name;

  div3.appendChild(anchor2);
  div2.appendChild(div3);

  const span = document.createElement("span");
  span.classList.add("comment-deleteBtn");
  span.innerText = "❌";
  span.addEventListener("click", handleDeleteComment);

  div2.appendChild(span);

  div1.appendChild(div2);

  const div4 = document.createElement("div");
  div4.classList.add("comment-date");
  div4.innerText = new Date().toLocaleString();

  div1.appendChild(div4);

  const pre = document.createElement("pre");
  pre.innerText = `\n${comment}`;

  div1.appendChild(pre);

  li.appendChild(div1);

  commentList.prepend(li);
};

const checkCommentSave = statusCode => {
  return statusCode === 200;
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  // console.log(videoId, comment);
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "post",
    data: {
      comment
    }
  });
  console.log(response);
  if (checkCommentSave(response.status)) {
    const {
      data: { commentId }
    } = response;
    // console.log(commentId);
    addComment(comment, commentId);
    increaseCommentsNumber();
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
