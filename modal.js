import { token } from "./guest.js"
import { closeModal } from './editionPage.js'
import { galleryElement } from "./guest.js"
//afficher les images dans la modale

const galleryPhotoDisplaySection = document.querySelector(".gallery-photo-section");

function galleryPhotoDisplay(works) {
  for (let i = 0; i < works.length; i++) {
    let divImage = document.createElement("div")
    divImage.classList.add("modal-gallery-div")
    divImage.id = works[i].id
    galleryPhotoDisplaySection.appendChild(divImage)

    const imagesToDelete = document.createElement("img")
    imagesToDelete.src = works[i].imageUrl
    imagesToDelete.alt = works[i].title
    imagesToDelete.classList.add("image-to-delete")
    divImage.appendChild(imagesToDelete)

    const deleteImagesBtn = document.createElement("button")
    deleteImagesBtn.classList.add("delete-image-btn")
    divImage.appendChild(deleteImagesBtn)

    const deleteImagesIcon = document.createElement("img")
    deleteImagesIcon.src = "assets/icons/trash-can-solid.svg"
    deleteImagesIcon.alt = `delete id="${works[i].id}" photo`
    deleteImagesBtn.appendChild(deleteImagesIcon)

    //supprimer le travail dans le dom sans recharger la page
    deleteImagesBtn.addEventListener("click", async () => {
      try {
        // Appel de la fonction deleteWorkData
        await deleteWorkData(works[i].id)
        // Code à exécuter si deleteWorkData a réussi
        divImage.remove()
        let figures = document.querySelectorAll(".figure")
        figures.forEach((figure) => {
          if (works[i].id == figure.id) {
            figure.remove()
          }
        })
      } catch (error) {
        // Code à exécuter si deleteWorkData n'a pas pu fonctionner directement
        console.log("La fonction deleteWorkData n'a pas pu fonctionner directement.");
      }
    })
  }
}
export { galleryPhotoDisplay }


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

