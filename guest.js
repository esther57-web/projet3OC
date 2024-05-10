const galleryElement = document.querySelector(".gallery")
export { galleryElement }
const filterElement = document.querySelector(".filter")
import { selectCategory } from './editionPage.js'
import { galleryPhotoDisplay } from './modal.js'

let works
let uniqueCategories
const defaultCategory = "Tous"
let token = sessionStorage.getItem("authToken")
export { token }

async function initData() {
  try {
    const req = await fetch("http://localhost:5678/api/works")
    works = await req.json()
    initGallery(works)
    setCategory(works)
    initFilterBtn()
    selectCategory(uniqueCategories)
    galleryPhotoDisplay(works)
  } catch (error) {
    console.error(error)
  }
}
initData()

function initGallery(works) {
  for (const objet of works) {
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
function filterByCategory(filtre = defaultCategory) {
  const allFigure = document.querySelectorAll(".figure")

  for (const [index, figure] of allFigure.entries()) {
    //récupération des noms de catégories de chaque objets de data
    const category = works[index].category.name
    figure.setAttribute('data-category', category)
    if (category === filtre || filtre === defaultCategory) {
      figure.classList.remove("hidden")
    } else {
      figure.classList.add("hidden")
    }
  }
}

function setCategory(works) {
  let listOfCategory = new Set()
  //récupération de chaque categories de data en chaine de caractères
  works.forEach((objet) => {
    listOfCategory.add(JSON.stringify(objet.category))
  })
  //ajout de chaque catégorie dans un tableau
  const categoriesTab = [...listOfCategory]
  //récupération des tableaux d'objets en objet javascript
  uniqueCategories = categoriesTab.map((s) => JSON.parse(s))
  //ajout de la catégorie "Tout" en première position
  uniqueCategories.unshift({ id: 0, name: defaultCategory })
}

function initFilterBtn() {
  for (const category of uniqueCategories) {
    const filterBtn = document.createElement("button")
    filterBtn.textContent = category.name
    filterBtn.classList.add("filter-btn")

    if (category.name === defaultCategory) {
      filterBtn.classList.add("active-filter-btn")
    }

    filterBtn.addEventListener("click", () => {
      const allFilterBtn = document.querySelectorAll(".filter-btn")
      filterByCategory(category.name)
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