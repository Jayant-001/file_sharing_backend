const dropBox = document.querySelector(".drop-box");
const fileInput = document.querySelector("#input-file");
const browseBtn = document.querySelector(".browse-btn");

const baseURL = "https://innshare.herokuapp.com";
const uploadURL = `${baseURL}/api/files`;

dropBox.addEventListener("dragover", (e) => {
  e.preventDefault();

  if (!dropBox.classList.contains("dragged")) {
    dropBox.classList.add("dragged");
  }
});

dropBox.addEventListener("dragleave", (e) => {
  if (dropBox.classList.contains("dragged")) {
    dropBox.classList.remove("dragged");
  }
});

dropBox.addEventListener("drop", (e) => {
  e.preventDefault();

  if (dropBox.classList.contains("dragged")) {
    dropBox.classList.remove("dragged");
  }

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    uploadFile();
  }
});

// select files through the browse btn
browseBtn.addEventListener("click", (e) => {
  fileInput.click();
});

const uploadFile = () => {

  // take first file to upload
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    console.log(xhr.readyState);
  }

  // open post request
  xhr.open("POST", uploadURL);
  xhr.send(formData);

}