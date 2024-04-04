/*********************************** gallery + filter ***************************************/

const galleryElement = document.querySelector(".gallery");
const filterElement = document.querySelector(".filter");


//const allFilterBtn = [];
let data;
let uniqueCategories;



async function initGallery() {
  try {
    const req = await fetch("http://localhost:5678/api/works");
    data = await req.json();
    console.log(data)
    // galerie fonctionnelle Javascript
    for (const objet of data) {
      const figure = document.createElement("figure");
      galleryElement.appendChild(figure);
      figure.classList.add("figure")

      const image = new Image();
      image.src = objet.imageUrl;
      image.alt = objet.title;
      figure.appendChild(image);

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = objet.title;
      figure.appendChild(figcaption);

      
    }



    // Récupérer les différentes catégories d'objets
    const categories = data.map((objet) => objet.category.name);
    uniqueCategories = [...new Set(categories)];
    uniqueCategories.unshift("Tout");
  

    function filtrer(filtre = "Tout") {
      const allFigure = document.querySelectorAll(".figure");

      for (const [index, figure] of allFigure.entries()) {
        const category = data[index].category.name;
        figure.setAttribute('data-category', category);
        if (category === filtre || filtre === "Tout") {
          figure.classList.remove("hidden");
        } else {
          figure.classList.add("hidden");
        }
      }
      
    }

    for (const category of uniqueCategories) {
      const filterBtn = document.createElement("button");
      filterBtn.textContent = category;
      filterBtn.classList.add("filter-btn");

      if (category === "Tout") {
        filterBtn.classList.add("active-filter-btn");
      }

      filterBtn.addEventListener("click", () => {
        const allFilterBtn = document.querySelectorAll(".filter-btn");
        filtrer(category);
        for (const currentFilterBtn of allFilterBtn) {
          if (currentFilterBtn === filterBtn) {
            currentFilterBtn.classList.add("active-filter-btn");
          } else {
            currentFilterBtn.classList.remove("active-filter-btn");
          }
        }
      });

      filterElement.appendChild(filterBtn);
    }

    filtrer();
  } catch (err) {
    console.error(err);
  }
}

initGallery();


/************************************ Edit mode **********************************/



// page d'édition
function editMode() {
  // Vérifier si l'utilisateur est connecté
const token = sessionStorage.getItem("authToken");
const body = document.querySelector("body")

if (token) {
  // L'utilisateur est connecté, version edit de la page
  
  const loginBtn = document.querySelector(".login-btn");              
  loginBtn.textContent = "logout"; 
  
  // mode edition bar
  const modeEditionBar = document.createElement("div");
  modeEditionBar.classList.add("mode-edition-bar");
  body.prepend(modeEditionBar)

  const whiteEditIcon = document.createElement("img")
  whiteEditIcon.src = "assets/icons/pen-to-square-regular.svg"
  whiteEditIcon.alt = "icone édition"
  modeEditionBar.appendChild(whiteEditIcon)

  const modeEditionBarText = document.createElement("p")
  modeEditionBarText.innerHTML = "Mode édition"
  modeEditionBar.appendChild(modeEditionBarText)

  // bouton d'édition 

  const portfolioSection = document.getElementById("portfolio")

  const mesProjetsTitle = document.createElement("div")
  mesProjetsTitle.classList.add("mes-projets-title")
  portfolioSection.prepend(mesProjetsTitle)

  const mesProjetsh2 = document.querySelector("#portfolio h2")
  mesProjetsTitle.appendChild(mesProjetsh2)

  const openModalBtn = document.createElement("a")
  openModalBtn.href = "#modal"
  openModalBtn.classList.add("js-modal")
  mesProjetsTitle.appendChild(openModalBtn)
  

  const blackEditIcon = document.createElement("img")
  blackEditIcon.src = "assets/icons/pen-to-square-regular (1).svg"
  blackEditIcon.alt = "icone du bouton d'édition"
  openModalBtn.prepend(blackEditIcon)

  const openModalBtnText = document.createElement("p")
  openModalBtnText.innerHTML= "modifier"
  openModalBtn.appendChild(openModalBtnText)

  //suppression section filtre

  filterElement.style.display = "none"

  } 
}

editMode()


///////////////////////////////// afficher et fermer la modale

const openModal = function(e) {
  e.preventDefault()
  const modal = document.querySelector(".modal")
  modal.style.display = "flex"

  
  //fermer la modale en cliquant sur la croix
  modal.querySelector(".close-modal-btn").addEventListener("click", closeModal)
  //fermer la modale en cliquant dans le vide (à suivre en dessous)
  modal.addEventListener("click", closeModal)
  //stopper la propagation de closeModal jusqu'à la fenêtre modale
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
  
}

const closeModal = function(e) {
  if(modal === null) return
  e.preventDefault()
  
  modal.style.display = "none"
  //enlever les addEventListener
  modal.removeEventListener("click", closeModal)
  modal.querySelector(".close-modal-btn").removeEventListener("click", closeModal)
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
  modall = null

  //retourner à la première vue automatiquement quand je ferme la modale
  returnToModalGallery()
}

// fonction consistant à stopper une propagation
const stopPropagation = function(e) {
  e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", openModal)
})

//////////////////////////////// chemin première et seconde vue de la modale

const firstModal = document.querySelector(".modal-gallery-photo")
const secondModal = document.querySelector(".modal-add-photo")
const backArrow = document.querySelector(".back-modal-btn")

function ajouterUnePhoto() {
  //mettre à jour les suppression de la galerie photo 

  //passer à la seconde vue 
  firstModal.style.display = "none"
  secondModal.style.display = "flex"
  backArrow.style.visibility = "visible"
}

//retourner à la première vue
function returnToModalGallery() {
  firstModal.style.display = "flex"
  secondModal.style.display = "none"
  backArrow.style.visibility = "hidden"
}


async function galleryPhotoDisplay() {
  await initGallery();
  const allImages = data.map((element) => element)
  //console.log(data)
  const galleryPhotoDisplaySection = document.querySelector(".gallery-photo-section");

  for (const [index] of data.entries()) {
    
    const divImage = document.createElement("div")
    galleryPhotoDisplaySection.appendChild(divImage)

    const imagesToDelete = document.createElement("img")
    imagesToDelete.src = allImages[index].imageUrl
    imagesToDelete.alt = allImages[index].title
    imagesToDelete.classList.add("image-to-delete")
    divImage.appendChild(imagesToDelete)

    const deleteImagesBtn = document.createElement("button")
    deleteImagesBtn.classList.add("delete-image-btn")
    divImage.appendChild(deleteImagesBtn)

    const deleteImagesIcon = document.createElement("img")
    deleteImagesIcon.src = "assets/icons/trash-can-solid.svg"
    deleteImagesIcon.alt = `delete id="${index+1}" photo`
    deleteImagesIcon.id = index + 1
    deleteImagesBtn.appendChild(deleteImagesIcon)

  }

  

  
}

galleryPhotoDisplay();

// selectionner une catégorie dans le formulaire

async function selectCategory() {
  await initGallery();
  const selectBar = document.querySelector(".category-img")
  
  for(const category of uniqueCategories) {
    const categoryOption = document.createElement("option")
    categoryOption.innerHTML = category
    selectBar.appendChild(categoryOption)
  }
  

  
}



//afficher l'image selectionnée dans le preview

const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', function() {
  const beforePreview = document.querySelector(".preview-section")
  const afterPreview = document.querySelector(".preview-section-after")

  beforePreview.style.display = "none"
  afterPreview.style.display = "flex"

  const previewImage = document.createElement("img")
  previewImage.src = `assets/images/${fileInput.files[0].name}`
  previewImage.alt = fileInput.files[0].name
  previewImage.classList.add("preview-image")
  afterPreview.appendChild(previewImage)

  console.log(previewImage)
});

//

const form = document.forms.namedItem("fileinfo");
form.addEventListener(
  "submit",
  (event) => {
    const output = document.querySelector(".output");
    const formData = new FormData(form);

    formData.append("CustomField", "Des données supplémentaires");

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          alert("Fichier téléversé !")
        } else {
          alert(`Erreur ${response.status} lors de la tentative de téléversement du fichier.<br />`);
        }
      })
      .catch(error => {
        output.innerHTML = "Une erreur s'est produite lors de la tentative de téléversement du fichier.";
      });
    
    event.preventDefault();
  },
  false,
);


// récupérer les valeurs du formulaire et l'envoyer à l'API

function formDataValue() {

  //récupérer le token pour s'authentifier
  let token = sessionStorage.getItem("token")

  //récupérer les éléments du formulaire
  let newImage = `assets/images/${fileInput.files[0].name}`
  let newTitle = document.getElementById("titre-img").value 
  let select = document.querySelector(".category-img")
  let newCategoryName = select.options[selectedIndex].innerHTML
  let newCategoryId = select.options[selectedIndex].id

}

