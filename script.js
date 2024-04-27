const galleryElement = document.querySelector(".gallery")
const filterElement = document.querySelector(".filter")

let data
let uniqueCategories
let token = sessionStorage.getItem("authToken")

async function initData() {
  try {
    const req = await fetch("http://localhost:5678/api/works");
    data = await req.json()
    initGallery(data)
    setCategory(data)
    initFilterBtn(data)
    selectCategory(data)
    galleryPhotoDisplay(data)
  } catch (error) {
    console.error(error)
  }
}
initData()

function initGallery(data) {
  for (const objet of data) {
    const figure = document.createElement("figure")
    galleryElement.appendChild(figure)
    figure.classList.add("figure")
    figure.id = objet.id

    const image = new Image()
    image.src = objet.imageUrl
    image.alt = objet.title
    figure.appendChild(image)

    const figcaption = document.createElement("figcaption")
    figcaption.textContent = objet.title
    figure.appendChild(figcaption)
  }
}


// filtrer = masquer les figures selon la catégorie
function filtrer(filtre = "Tout") {
  const allFigure = document.querySelectorAll(".figure");

  for (const [index, figure] of allFigure.entries()) {
    //récupération des noms de catégories de chaque objets de data
    const category = data[index].category.name
    figure.setAttribute('data-category', category)
    if (category === filtre || filtre === "Tout") {
      figure.classList.remove("hidden")
    } else {
      figure.classList.add("hidden")
    }
  }

}

function setCategory(data) {
  let listOfCategories = new Set();
  //récupération de chaque categories de data en texte json
  data.forEach((objet) => {
    listOfCategories.add(JSON.stringify(objet.category))
  });
  //ajout de chaque catégorie dans un tableau
  const tableauCategories = [...listOfCategories]
  //récupération des tableaux d'objets en objet javascript
  uniqueCategories = tableauCategories.map((s) => JSON.parse(s))
  //ajout de la catégorie "Tout" en première position
  uniqueCategories.unshift({ id: 0, name: "Tout" })
}

function initFilterBtn(data) {
  for (const category of uniqueCategories) {
    const filterBtn = document.createElement("button")
    filterBtn.textContent = category.name
    filterBtn.classList.add("filter-btn")

    if (category.name === "Tout") {
      filterBtn.classList.add("active-filter-btn")
    }

    filterBtn.addEventListener("click", () => {
      const allFilterBtn = document.querySelectorAll(".filter-btn");
      filtrer(category.name);
      for (const currentFilterBtn of allFilterBtn) {
        if (currentFilterBtn === filterBtn) {
          currentFilterBtn.classList.add("active-filter-btn")
        } else {
          currentFilterBtn.classList.remove("active-filter-btn")
        }
      }
    });
    filterElement.appendChild(filterBtn)
  }
}
/************************************ Edit mode **********************************/
function editMode() {
  const body = document.querySelector("body")
  if (token) {
    const loginBtn = document.querySelector(".login-btn")
    loginBtn.textContent = "logout"
    
    const modeEditionBar = document.createElement("div")
    modeEditionBar.classList.add("mode-edition-bar")
    body.prepend(modeEditionBar)

    const whiteEditIcon = document.createElement("img")
    whiteEditIcon.src = "assets/icons/pen-to-square-regular.svg"
    whiteEditIcon.alt = "icone édition"
    modeEditionBar.appendChild(whiteEditIcon)

    const modeEditionBarText = document.createElement("p")
    modeEditionBarText.innerHTML = "Mode édition"
    modeEditionBar.appendChild(modeEditionBarText)

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
    openModalBtnText.innerHTML = "modifier"
    openModalBtn.appendChild(openModalBtnText)

    filterElement.style.display = "none"
  }
}
editMode()

///////////////////////////////// modale

const openModal = function (e) {
  e.preventDefault()
  const modal = document.querySelector(".modal")
  modal.style.display = "flex"

  //fermer la modale en cliquant sur la croix
  modal.querySelector(".close-modal-btn").addEventListener("click", closeModal)
  //fermer la modale en cliquant dans le vide (à suivre en dessous)
  modal.addEventListener("click", closeModal)
  //stopper la propagation de closeModal jusqu'à la fenêtre modale modal-wrapper
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal = function (e) {
  if (modal === null) return
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

const stopPropagation = function (e) {
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

//afficher les images dans la modale

const galleryPhotoDisplaySection = document.querySelector(".gallery-photo-section");

function galleryPhotoDisplay(data) {
  for (let i = 0; i < data.length; i++) {
    let divImage = document.createElement("div")
    divImage.classList.add("modal-gallery-div")
    divImage.id = data[i].id
    galleryPhotoDisplaySection.appendChild(divImage)

    const imagesToDelete = document.createElement("img")
    imagesToDelete.src = data[i].imageUrl
    imagesToDelete.alt = data[i].title
    imagesToDelete.classList.add("image-to-delete")
    divImage.appendChild(imagesToDelete)

    const deleteImagesBtn = document.createElement("button")
    deleteImagesBtn.classList.add("delete-image-btn")
    divImage.appendChild(deleteImagesBtn)
    deleteImagesBtn.setAttribute("onclick", `deleteWorkData(${data[i].id})`)

    const deleteImagesIcon = document.createElement("img")
    deleteImagesIcon.src = "assets/icons/trash-can-solid.svg"
    deleteImagesIcon.alt = `delete id="${data[i].id}" photo`
    deleteImagesBtn.appendChild(deleteImagesIcon)

    //supprimer le travail dans le dom sans recharger la page
    deleteImagesBtn.addEventListener("click", () => {
      divImage.remove()
      let figures = document.querySelectorAll(".figure")
      figures.forEach((figure) => {
        if (data[i].id == figure.id)
          figure.remove()
      })
    })
  }
}

// selectionner une catégorie dans le formulaire
function selectCategory() {
  const selectBar = document.querySelector(".category-img")

  for (const category of uniqueCategories) {
    if (category.name !== "Tout") {
      const categoryOption = document.createElement("option")
      categoryOption.innerHTML = category.name
      categoryOption.id = category.id
      selectBar.appendChild(categoryOption)
    }
  }
}

//afficher l'image selectionnée dans le preview
const fileInput = document.getElementById('file-input')

fileInput.addEventListener('change', function () {
  const beforePreview = document.querySelector(".preview-section")
  const afterPreview = document.querySelector(".preview-section-after")

  beforePreview.style.display = "none"
  afterPreview.style.display = "flex"

  const previewImage = document.createElement("img")
  previewImage.src = `assets/images/${fileInput.files[0].name}`
  previewImage.alt = fileInput.files[0].name
  previewImage.classList.add("preview-image")
  afterPreview.appendChild(previewImage)

})

// Si tous les champs du formulaire sont remplis, le bouton valider du formulaire sera vert et en cursor pointer
document.getElementById("titre-img").addEventListener("input", formSubmitBtnActive)
document.querySelector(".category-img").addEventListener("input", formSubmitBtnActive)
document.getElementById("file-input").addEventListener("change", formSubmitBtnActive)

function formSubmitBtnActive() {
  const fileInput = document.getElementById('file-input')
  let newTitle = document.getElementById("titre-img").value
  let select = document.querySelector(".category-img")
  const formSubmitBtn = document.querySelector(".submit-add-photo-btn")

  if (fileInput.files[0] != undefined && newTitle != "" && select.options[select.selectedIndex].innerText != "") {
    formSubmitBtn.style.backgroundColor = "#1D6154"
    formSubmitBtn.style.cursor = "pointer"
  }
}

//////////////////////////////////////// Supprimer un travail /////////////////////////////////////////////

//suppression immédiate du travail dans le DOM ligne 231
//suppression du travail dans l'API
function deleteWorkData(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      accept: "*/*",
      authorization: `Bearer ${token}`,
    }
  })
    .then(response => {
      if (response.ok) {
        alert("Fichier supprimé !")
      } else {
        console.log(response)
        alert(`Erreur ${response.status} lors de la tentative de suppression du travail.<br />`)
      }
    })
    .catch(error => {
      alert("Une erreur s'est produite lors de la tentative de suppression du travail.")
    })
}

//////////////////////////////////////// Ajouter un travail ///////////////////////////////////////////////

// récupérer les valeurs du formulaire et l'envoyer à l'API
function formDataValue() {
  //récupérer les éléments du formulaire
  let newImage = document.getElementById('file-input').files[0]
  let newTitle = document.getElementById("titre-img").value
  let select = document.querySelector(".category-img")
  let newCategoryName = select.options[select.selectedIndex].innerHTML
  let newCategoryId = select.options[select.selectedIndex].id
  // les stocker dans formData
  let formData = new FormData()
  formData.append("title", newTitle)
  formData.append("image", newImage)
  formData.append("category", newCategoryId)
  return {
    formData
  }
}

//ajouter la nouvelle figure dans la galerie puis suppression au moment de l'actualisation
function addWorkGallery(newData) {

  const figure = document.createElement("figure");
  galleryElement.appendChild(figure);
  figure.classList.add("figure")
  figure.classList.add("new-work")
  figure.id = newData.id

  const image = new Image()
  image.src = newData.imageUrl
  image.alt = newData.title
  figure.appendChild(image)

  const figcaption = document.createElement("figcaption")
  figcaption.textContent = newData.title
  figure.appendChild(figcaption)

}

//ajouter la nouvelle figure dans la modale puis suppression au moment de l'actualisation
function addWorkModal(newData) {
  
  let divImage = document.createElement("div")
  divImage.classList.add("modal-gallery-div")
  divImage.classList.add("new-work-modal")
  divImage.id = newData.id
  galleryPhotoDisplaySection.appendChild(divImage)

  const imagesToDelete = document.createElement("img")
  imagesToDelete.src = newData.imageUrl
  imagesToDelete.alt = newData.title
  imagesToDelete.classList.add("image-to-delete")
  divImage.appendChild(imagesToDelete)

  const deleteImagesBtn = document.createElement("button")
  deleteImagesBtn.classList.add("delete-image-btn")
  divImage.appendChild(deleteImagesBtn)
  deleteImagesBtn.setAttribute("onclick", `deleteWorkData(${newData.id})`)

  const deleteImagesIcon = document.createElement("img")
  deleteImagesIcon.src = "assets/icons/trash-can-solid.svg"
  deleteImagesIcon.alt = `delete id="${newData.id}" photo`
  deleteImagesBtn.appendChild(deleteImagesIcon)
}

const form = document.forms.namedItem("fileinfo");
form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    let { formData } = formDataValue()

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          alert("Fichier téléversé !")
          // Récupérer la réponse du serveur au format JSON
          return response.json();
        } else {
          console.log(response)
          alert(`Erreur ${response.status} lors de la tentative de téléversement du fichier.<br />`);
        }
      })
      .then(newData => {
        addWorkModal(newData)
        addWorkGallery(newData)
        // Supprimer la figure lors du rechargement de la page
        window.addEventListener('load', () => {
          const figureToRemove = document.querySelector(".new-work")
          const modalDivToRemove = document.querySelector(".new-work-modal")
          figureToRemove.remove()
          modalDivToRemove.remove()
        })
      })
      .catch(error => {
        alert("Une erreur s'est produite lors de la tentative de téléversement du fichier.")
      })
  },
  false,
)

