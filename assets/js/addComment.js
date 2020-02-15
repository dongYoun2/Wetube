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
  const anchor1 = document.createElement("a");
  anchor1.href = `/users/${me._id}`;

  const img = document.createElement("img");
  img.classList.add("u-avatar");
  img.src = me.avatarUrl;

  anchor1.appendChild(img);

  const pre = document.createElement("pre");
  const anchor2 = document.createElement("a");
  anchor2.href = `/users/${me._id}`;
  anchor2.innerText = me.name;

  pre.appendChild(anchor2);
  pre.innerHTML += `\n${comment}`;

  li.appendChild(anchor1);
  li.appendChild(pre);

  commentList.prepend(li);
};

const checkCommentValidation = statusCode => {
  return statusCode === 200;
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
  if (checkCommentValidation(response.status)) {
    addComment(comment);
    increaseCommentNumber();
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
