const galleryElement = document.querySelector(".gallery")
export { galleryElement }
const filterElement = document.querySelector(".filter")
import { selectCategory } from './editionPage.js'
import { galleryPhotoDisplay } from './modal.js'

let work
let uniqueCategories
let token = sessionStorage.getItem("authToken")
export { token }

async function initData() {
  try {
    const req = await fetch("http://localhost:5678/api/works")
    work = await req.json()
    initGallery(work)
    setCategory(work)
    initFilterBtn()
    selectCategory(uniqueCategories)
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
  const categoriesTab = [...listOfCategories]
  //récupération des tableaux d'objets en objet javascript
  uniqueCategories = categoriesTab.map((s) => JSON.parse(s))
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


