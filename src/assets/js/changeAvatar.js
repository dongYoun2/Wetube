const avatarImage = document.getElementById("jsAvatar");
const fileInputForm = document.getElementById("jsFileInputForm");

const fReader = new FileReader();

const handleLoad = () => {
  avatarImage.src = fReader.result;
};

const handleChange = event => {
  const {
    target: { files }
  } = event;
  const image = files && files[0] ? files[0] : null;
  if (image) {
    fReader.readAsDataURL(image);
    fReader.addEventListener("load", handleLoad);
  }
};
const init = () => {
  fileInputForm.addEventListener("change", handleChange);
};

if (fileInputForm) {
  init();
}
