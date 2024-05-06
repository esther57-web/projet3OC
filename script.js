const galleryElement = document.querySelector(".gallery")
const filterElement = document.querySelector(".filter")

let work
let uniqueCategories
let token = sessionStorage.getItem("authToken")

async function initData() {
  try {
    const req = await fetch("http://localhost:5678/api/works")
    work = await req.json()
    initGallery(work)
    setCategory(work)
    initFilterBtn()
    selectCategory(work)
    galleryPhotoDisplay(work)
  } catch (error) {
    console.error(error)
  }
}
initData()

function initGallery(work) {
  for (const objet of work) {
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
  const allFigure = document.querySelectorAll(".figure")

  for (const [index, figure] of allFigure.entries()) {
    //récupération des noms de catégories de chaque objets de data
    const category = work[index].category.name
    figure.setAttribute('data-category', category)
    if (category === filtre || filtre === "Tout") {
      figure.classList.remove("hidden")
    } else {
      figure.classList.add("hidden")
    }
  }
}

function setCategory(work) {
  let listOfCategories = new Set()
  //récupération de chaque categories de data en chaine de caractères
  work.forEach((objet) => {
    listOfCategories.add(JSON.stringify(objet.category))
  })
  //ajout de chaque catégorie dans un tableau
  const tableauCategories = [...listOfCategories]
  //récupération des tableaux d'objets en objet javascript
  uniqueCategories = tableauCategories.map((s) => JSON.parse(s))
  //ajout de la catégorie "Tout" en première position
  uniqueCategories.unshift({ id: 0, name: "Tout" })
}

function initFilterBtn() {
  for (const category of uniqueCategories) {
    const filterBtn = document.createElement("button")
    filterBtn.textContent = category.name
    filterBtn.classList.add("filter-btn")

    if (category.name === "Tout") {
      filterBtn.classList.add("active-filter-btn")
    }

    filterBtn.addEventListener("click", () => {
      const allFilterBtn = document.querySelectorAll(".filter-btn")
      filtrer(category.name)
      for (const currentFilterBtn of allFilterBtn) {
        if (currentFilterBtn === filterBtn) {
          currentFilterBtn.classList.add("active-filter-btn")
        } else {
          currentFilterBtn.classList.remove("active-filter-btn")
        }
      }
    })
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
  e.preventDefault()
  modal.style.display = "none"
  //retourner à la première vue automatiquement quand je ferme la modale
  returnToModalGallery()
}

const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelector(".js-modal").addEventListener("click", openModal)

//////////////////////////////// chemin première et seconde vue de la modale

const firstModal = document.querySelector(".modal-gallery-photo")
const secondModal = document.querySelector(".modal-add-photo")
const backArrow = document.querySelector(".back-modal-btn")
const toSecondViewBtn = document.querySelector(".submit-gallery-photo-btn")
const toFirstViewBtn = document.querySelector(".back-modal-btn")

function toSecondView() {

  //passer à la seconde vue 
  firstModal.style.display = "none"
  secondModal.style.display = "flex"
  backArrow.style.visibility = "visible"
}
toSecondViewBtn.addEventListener("click", toSecondView)
//retourner à la première vue
function returnToModalGallery() {
  firstModal.style.display = "flex"
  secondModal.style.display = "none"
  backArrow.style.visibility = "hidden"
}
toFirstViewBtn.addEventListener("click", returnToModalGallery)

//afficher les images dans la modale

const galleryPhotoDisplaySection = document.querySelector(".gallery-photo-section");

function galleryPhotoDisplay(work) {
  for (let i = 0; i < work.length; i++) {
    let divImage = document.createElement("div")
    divImage.classList.add("modal-gallery-div")
    divImage.id = work[i].id
    galleryPhotoDisplaySection.appendChild(divImage)

    const imagesToDelete = document.createElement("img")
    imagesToDelete.src = work[i].imageUrl
    imagesToDelete.alt = work[i].title
    imagesToDelete.classList.add("image-to-delete")
    divImage.appendChild(imagesToDelete)

    const deleteImagesBtn = document.createElement("button")
    deleteImagesBtn.classList.add("delete-image-btn")
    divImage.appendChild(deleteImagesBtn)
    deleteImagesBtn.setAttribute("onclick", `deleteWorkData(${work[i].id})`)

    const deleteImagesIcon = document.createElement("img")
    deleteImagesIcon.src = "assets/icons/trash-can-solid.svg"
    deleteImagesIcon.alt = `delete id="${work[i].id}" photo`
    deleteImagesBtn.appendChild(deleteImagesIcon)

    //supprimer le travail dans le dom sans recharger la page
    deleteImagesBtn.addEventListener("click", () => {
      divImage.remove()
      let figures = document.querySelectorAll(".figure")
      figures.forEach((figure) => {
        if (work[i].id == figure.id)
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
    formSubmitBtn.setAttribute("type", "submit")
  }
}

//////////////////////////////////////// Supprimer un travail /////////////////////////////////////////////

//suppression immédiate du travail dans le DOM ligne 220
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
        console.log("fichier supprimé !")
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
function addWorkGallery(newTemporaryWork) {

  const figure = document.createElement("figure")
  galleryElement.appendChild(figure)
  figure.classList.add("figure")
  figure.classList.add("new-work")
  figure.id = newTemporaryWork.id

  const image = new Image()
  image.src = newTemporaryWork.imageUrl
  image.alt = newTemporaryWork.title
  figure.appendChild(image)

  const figcaption = document.createElement("figcaption")
  figcaption.textContent = newTemporaryWork.title
  figure.appendChild(figcaption)

}

//ajouter la nouvelle figure dans la modale puis suppression au moment de l'actualisation
function addWorkModal(newTemporaryWork) {
  
  let divImage = document.createElement("div")
  divImage.classList.add("modal-gallery-div")
  divImage.classList.add("new-work-modal")
  divImage.id = newTemporaryWork.id
  galleryPhotoDisplaySection.appendChild(divImage)

  const imagesToDelete = document.createElement("img")
  imagesToDelete.src = newTemporaryWork.imageUrl
  imagesToDelete.alt = newTemporaryWork.title
  imagesToDelete.classList.add("image-to-delete")
  divImage.appendChild(imagesToDelete)

  const deleteImagesBtn = document.createElement("button")
  deleteImagesBtn.classList.add("delete-image-btn")
  divImage.appendChild(deleteImagesBtn)
  deleteImagesBtn.setAttribute("onclick", `deleteWorkData(${newTemporaryWork.id})`)

  const deleteImagesIcon = document.createElement("img")
  deleteImagesIcon.src = "assets/icons/trash-can-solid.svg"
  deleteImagesIcon.alt = `delete id="${newTemporaryWork.id}" photo`
  deleteImagesBtn.appendChild(deleteImagesIcon)
}

const form = document.forms.namedItem("fileinfo");
form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault()
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
          // Récupérer la réponse du serveur au format JSON
          return response.json()
        } else {
          console.log(response)
          alert(`Erreur ${response.status} lors de la tentative de téléversement du fichier.<br />`);
        }
      })
      .then(newTemporaryWork => {
        addWorkModal(newTemporaryWork)
        addWorkGallery(newTemporaryWork)
        // Supprimer la figure temporaire lors du rechargement de la page
        window.addEventListener('load', () => {
          const figureToRemove = document.querySelector(".new-work")
          const modalDivToRemove = document.querySelector(".new-work-modal")
          figureToRemove.remove()
          modalDivToRemove.remove()
        })
        closeModal(event)
      })
      .catch(error => {
        alert("Une erreur s'est produite lors de la tentative de téléversement du fichier.")
      })
  }
)

