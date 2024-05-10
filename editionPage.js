/************************************ Edit mode **********************************/
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
export { closeModal }

const stopPropagation = function (e) {
e.stopPropagation()
}

//document.querySelector(".js-modal").addEventListener("click", openModal)

let token = sessionStorage.getItem("authToken")

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
  
      const workTitle = document.createElement("div")
      workTitle.classList.add("mes-projets-title")
      portfolioSection.prepend(workTitle)
  
      const mesProjetsh2 = document.querySelector("#portfolio h2")
      workTitle.appendChild(mesProjetsh2)
  
      const openModalBtn = document.createElement("a")
      openModalBtn.href = "#modal"
      openModalBtn.classList.add("js-modal")
      openModalBtn.addEventListener("click", openModal)
      workTitle.appendChild(openModalBtn)
  
      const blackEditIcon = document.createElement("img")
      blackEditIcon.src = "assets/icons/pen-to-square-regular (1).svg"
      blackEditIcon.alt = "icone du bouton d'édition"
      openModalBtn.prepend(blackEditIcon)
  
      const openModalBtnText = document.createElement("p")
      openModalBtnText.innerHTML = "modifier"
      openModalBtn.appendChild(openModalBtnText)
      
      const filterElement = document.querySelector(".filter")
      filterElement.style.display = "none"
    }
}
editMode()
  
  
  
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

// selectionner une catégorie dans le formulaire
const selectCategory = (uniqueCategories) => {
    const selectBar = document.querySelector(".category-img")
  
    for (const category of uniqueCategories) {
      if (category.name !== "Tous") {
        const categoryOption = document.createElement("option")
        categoryOption.innerHTML = category.name
        categoryOption.id = category.id
        selectBar.appendChild(categoryOption)
      }
    }
}
export { selectCategory }

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
