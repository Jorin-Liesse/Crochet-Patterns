let lightMode = false;

let pageRecipes = 1;
let pageSearchRecipes = 1;

let loading = false;
let hasMoreContent = true;

const images = [];

async function getRecipes() {
  removeCards();

  loadedData = loadLocalStorage('patterns');

  if (loadedData !== null) makeCard(loadedData);

  fetchData();
}

async function fetchData() {
  const loader = document.querySelector('.loader');

  let hasMoreContent = true;
  if (loading || !hasMoreContent) return;

  loading = true;
  loader.style.display = 'flex';
  images.length = 0;

  while (hasMoreContent) {
    const response = await fetch(`https://jorin-liesse-crochet-api.onrender.com/getRecipes/${pageRecipes}`);
    const data = await response.json();

    if (data.length === 0) hasMoreContent = false;
    
    else {
      saveLocalStorage('patterns', data);
      data.forEach(element => {
          images.push({_id: element._id, image: element.image});
      });

      pageRecipes++;
    }

    if (!hasMoreContent) {
      loading = false;
      loader.style.display = 'none';

      loadedData = loadLocalStorage('patterns');
      removeCards();
      if (loadedData !== null) makeCard(loadedData);

      break;
    }
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    fetchRecipes();
  }
}

function addRecipe(name, ingredients, directions, image) {
  const data = {
    name: name,
    ingredients: ingredients,
    directions: directions,
    image: image,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  makeCard({ data: data });

  fetch("https://jorin-liesse-crochet-api.onrender.com/addRecipe", options)
    .then((response) => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function searchRecipes(searchTerm) {
  removeCards();

  window.removeEventListener('scroll', handleScroll);

  fetchSearchRecipes(searchTerm);
}

function updateRecipeTest(oldName, newName, ingredients, directions, image) {
  const data = {
    name: newName,
    ingredients: ingredients,
    directions: directions,
    image: image,
  };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const container = document.querySelector('#section');

  const pElements = container.getElementsByTagName(`p`);

  for (const pElement of pElements) {
    if (pElement.textContent === oldName) {
      const card = pElement.closest('.card');
      card.remove();

      makeCard({ data: data });
      break;
    }
  }

  fetch(`https://jorin-liesse-crochet-api.onrender.com/updateRecipe/${oldName}`, options)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function deleteRecipe(name) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const container = document.querySelector('#section');

  const pElements = container.getElementsByTagName(`p`);

  for (const pElement of pElements) {
    if (pElement.textContent === name) {
      const card = pElement.closest('.card');
      card.remove();
      break;
    }
  }

  fetch(`https://jorin-liesse-crochet-api.onrender.com/deleteRecipe/${name}`, options)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function fetchSearchRecipes(searchTerm) {
  const loader = document.querySelector('.loader');

  loading = true;
  loader.style.display = 'flex';
  images.length = 0;

  fetch(`https://jorin-liesse-crochet-api.onrender.com/searchRecipes/${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(element => {
        images.push({_id: element._id, image: element.image});
      });
      makeCard(data);
      loading = false;
      loader.style.display = 'none';
    })
    .catch(error => console.error(error));
}

function removeCards() {
  const main = document.getElementById("section");
  main.innerHTML = "";
} 

function makeCard(data) {
  const main = document.getElementById("section");

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      main.innerHTML += `
        <div class="card" id="${data[key]["_id"]}">
          <div class="card-inner">
            <div class="card-face card-front">
              <img class="image" src="${data[key]["image"]}">
              <p class="name-front">${data[key]["name"]}</p>
            </div>
            <div class="card-face card-back">
              <ion-icon class="delete-icon" name="trash"></ion-icon>
              <ion-icon class="edit-icon" name="create"></ion-icon>
          
              <p class="name-back">${data[key]["name"]}</p>
              <p class="ingredients">${data[key]["ingredients"]}</p>
              <p class="directions">${data[key]["directions"]}</p>
            </div>
          </div>
        </div>`;
    }
  }

  if (images.length > 0) {
    images.forEach(element => {
      const card = document.getElementById(element._id);
      const image = card.querySelector('.image');
      image.src = element.image;
    });
  }

  handleCardClick();
  handleCardEdit();
  handleCardDelete();
}

function toggleLightMode(lightMode) {
  const switchLightMode = document.querySelector(".toggle");
  const root = document.querySelector(":root");

  switchLightMode.addEventListener("click", () => {
    lightMode = !lightMode;

    if (lightMode === true) {
      root.style.setProperty("--backgroundColor", "255, 255, 255");
      root.style.setProperty("--textColor", "95, 99, 104");
      root.style.setProperty("--elementColor", "241, 243, 244");
    } else if (lightMode === false) {
      root.style.setProperty("--backgroundColor", "27, 26, 25");
      root.style.setProperty("--textColor", "226, 225, 223");
      root.style.setProperty("--elementColor", "59, 58, 57");
    }
  });
}

function submitSearchForm() {
  const input = document.getElementById("search-bar-input");
  const form = document.getElementById("search-bar-form");
  const main = document.getElementById("section");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    main.innerHTML = "";

    const searchTerm = input.value;

    if (searchTerm) {
      searchRecipes(searchTerm);
      input.value = "";
    }
  });

  form.addEventListener("click", () => {
    input.focus();
  });
}

function handleCardClick() {
  const cards = document.querySelectorAll(".card-inner");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });
}

function handleCardEdit() {
  const editButtons = document.querySelectorAll(".edit-icon");

  const addButton = document.querySelector(".add-button");
  const icon = document.querySelector("#add-button-icon");

  const editContainer = document.querySelector("#editRecipeForm");

  const popupOverlayEdit = document.querySelector(".popup-overlay-edit-recipe");

  const submitButton = document.querySelector(".edit-submit-button");

  const name = document.getElementById("edit-name-text-area-front");
  const ingredients = document.getElementById("edit-ingredients-text-area");
  const directions = document.getElementById("edit-directions-text-area");
  const image = document.querySelector(".edit-file-upload-image");

  const nameFront = document.getElementById("edit-name-text-area-front");
  const nameBack = document.getElementById("edit-name-text-area-back");

  editButtons.forEach((editButton) => {
    editButton.addEventListener("click", () => {
      const card = editButton.closest(".card-inner");
      card.classList.toggle("is-flipped");

      popupOverlayEdit.style.display = "block";

      document.body.classList.add("popup-active");

      addButton.classList.add("active");
      icon.classList.add("active");

      const cardInner = editButton.closest('.card-inner');

      const nameFrontElement = cardInner.querySelector('.name-front');
      const nameBackElement = cardInner.querySelector('.name-back');
      const ingredientsElement = cardInner.querySelector('.ingredients');
      const directionsElement = cardInner.querySelector('.directions');
      const imageElement = cardInner.querySelector('.image');

      nameFront.value = nameFrontElement.textContent;
      nameBack.value = nameBackElement.textContent;
      ingredients.value = ingredientsElement.textContent;
      directions.value = directionsElement.textContent;
      image.src = imageElement.src;

      image.style.display = "block";

      submitButton.setAttribute('data', nameBackElement.textContent);
    });
  });

  popupOverlayEdit.addEventListener("click", (event) => {
    if (
      event.target !== editContainer &&
      !editContainer.contains(event.target) &&
      event.target !== addButton &&
      !addButton.contains(event.target)
    ) {
      popupOverlayEdit.style.display = "none";

      document.body.classList.remove("popup-active");

      addButton.classList.remove("active");
      icon.classList.remove("active");
    }
  });
}

function handleCardDelete() {
  const deleteButtons = document.querySelectorAll(".delete-icon");

  const popupDeleteButton = document.querySelector(".delete-button");

  const deleteContainer = document.querySelector(".delete-recipe-container");

  const addButton = document.querySelector(".add-button");
  const icon = document.querySelector("#add-button-icon");

  const popupOverlay = document.querySelector(".popup-overlay-delete-recipe");

  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const card = deleteButton.closest(".card-inner");
      card.classList.toggle("is-flipped");

      popupOverlay.style.display = "block";

      document.body.classList.add("popup-active");

      addButton.classList.add("active");
      icon.classList.add("active");

      const nameBackElement = deleteButton.closest('.card-back').querySelector('.name-back');
      popupDeleteButton.setAttribute('data', nameBackElement.textContent);
    });
  });

  popupOverlay.addEventListener("click", (event) => {
    if (
      event.target !== deleteContainer &&
      !deleteContainer.contains(event.target) &&
      event.target !== addButton &&
      !addButton.contains(event.target)
    ) {
      popupOverlay.style.display = "none";

      document.body.classList.remove("popup-active");

      addButton.classList.remove("active");
      icon.classList.remove("active");
    }
  });

  popupDeleteButton.addEventListener("click", () => {
    const name = popupDeleteButton.getAttribute('data');

    deleteRecipe(name);

    popupOverlay.style.display = "none";
    document.body.classList.remove("popup-active");
    addButton.classList.remove("active");
    icon.classList.remove("active");
  });
}

function handleAddRecipe() {
  const addButton = document.querySelector(".add-button");
  const icon = document.querySelector("#add-button-icon");

  const addContainer = document.querySelector("#addRecipeForm");

  const popupOverlayAdd = document.querySelector(".popup-overlay-add-recipe");
  const popupOverlayDelete = document.querySelector(".popup-overlay-delete-recipe");
  const popupOverlayEdit = document.querySelector(".popup-overlay-edit-recipe");

  addButton.addEventListener("click", () => {
    if (addButton.classList.contains("active")) {
      popupOverlayAdd.style.display = "none";
      popupOverlayDelete.style.display = "none";
      popupOverlayEdit.style.display = "none";

      document.body.classList.remove("popup-active");
      
      addButton.classList.remove("active");
      icon.classList.remove("active");
    } 
    
    else {
      popupOverlayAdd.style.display = "block";

      document.body.classList.add("popup-active");

      addButton.classList.add("active");
      icon.classList.add("active");
    }
  });

  popupOverlayAdd.addEventListener("click", (event) => {
    if (
      event.target !== addContainer &&
      !addContainer.contains(event.target) &&
      event.target !== addButton &&
      !addButton.contains(event.target)
    ) {
      popupOverlayAdd.style.display = "none";

      document.body.classList.remove("popup-active");

      addButton.classList.remove("active");
      icon.classList.remove("active");
    }
  });
}

function displaySelectedImage(input, output) {
  const uploadImage = document.querySelector("." + output);

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      uploadImage.src = e.target.result;
      uploadImage.style.display = "block";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function linkNameAreas(self, other) {
  const otherElement = document.getElementById(other);

  otherElement.value = self.value;
}

function convertImageToBase64(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const base64Data = canvas.toDataURL("image/png");

  return base64Data;
}

function submitAddRecipeForm() {
  const submitButton = document.querySelector(".add-submit-button");

  const name = document.getElementById("add-name-text-area-front");
  const ingredients = document.getElementById("add-ingredients-text-area");
  const directions = document.getElementById("add-directions-text-area");
  const image = document.querySelector(".add-file-upload-image");

  const nameFront = document.getElementById("add-name-text-area-front");
  const nameBack = document.getElementById("add-name-text-area-back");

  const popupOverlay = document.querySelector(".popup-overlay-add-recipe");
  const addButton = document.querySelector(".add-button");
  const icon = document.querySelector("#add-button-icon");

  submitButton.addEventListener("click", () => {
    const nameValue = name.value;
    const ingredientsValue = ingredients.value;
    const directionsValue = directions.value;
    const imageSrc = image.src;

    if (
      nameValue.trim() === "" ||
      ingredientsValue.trim() === "" ||
      directionsValue.trim() === "" ||
      imageSrc === ""
    ) {
      alert("Please fill in all fields before submitting.");
    } 
    
    else {
      addRecipe(
        nameValue,
        ingredientsValue,
        directionsValue,
        convertImageToBase64(image)
      );

      nameFront.value = "";
      nameBack.value = "";
      ingredients.value = "";
      directions.value = "";
      image.src = "";

      image.style.display = "none";

      popupOverlay.style.display = "none";
      document.body.classList.remove("popup-active");
      
      addButton.classList.remove("active");
      icon.classList.remove("active");
    }
  });
}

function submitEditRecipeForm() {
  const submitButton = document.querySelector(".edit-submit-button");

  const name = document.getElementById("edit-name-text-area-front");
  const ingredients = document.getElementById("edit-ingredients-text-area");
  const directions = document.getElementById("edit-directions-text-area");
  const image = document.querySelector(".edit-file-upload-image");

  const popupOverlay = document.querySelector(".popup-overlay-edit-recipe");
  const addButton = document.querySelector(".add-button");
  const icon = document.querySelector("#add-button-icon");

  submitButton.addEventListener("click", () => {
    const nameValue = name.value;
    const ingredientsValue = ingredients.value;
    const directionsValue = directions.value;
    const imageSrc = image.src;

    if (
      nameValue.trim() === "" ||
      ingredientsValue.trim() === "" ||
      directionsValue.trim() === "" ||
      imageSrc === ""
    ) {
      alert("Please fill in all fields before submitting.");
    } 
    
    else {
      updateRecipeTest(
        submitButton.getAttribute('data'),
        nameValue,
        ingredientsValue,
        directionsValue,
        convertImageToBase64(image)
      );

      popupOverlay.style.display = "none";
      document.body.classList.remove("popup-active");
      
      addButton.classList.remove("active");
      icon.classList.remove("active");
    }
  });
}

function saveLocalStorage(key, saveData) {
  const loadedData = JSON.parse(localStorage.getItem(key)) || [];
  const idSet = new Set(loadedData.map(item => item._id));

  saveData.forEach(element => {
    if (!idSet.has(element._id)) {
      idSet.add(element._id);
      element.image = "";
      loadedData.push(element);
    }
  });

  localStorage.setItem(key, JSON.stringify(loadedData)); // Save data to local storage
}

function loadLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)); //load data from local storage
}

document.addEventListener("DOMContentLoaded", () => {
  getRecipes();

  toggleLightMode(lightMode);

  submitSearchForm();

  handleAddRecipe();

  submitAddRecipeForm();

  submitEditRecipeForm();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
  });
}

