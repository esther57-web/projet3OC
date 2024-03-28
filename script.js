/* galerie fonctionnelle affichée dynamiquement grâce à JavaScript + suppression du HTML */

let gallery = document.querySelector(".gallery")
let filter = document.querySelector(".filter")

fetch('http://localhost:5678/api/works')
  .then(r => r.json())
  .then(data => {
    // galerie fonctionnelle Javascript
    data.forEach(objet => {
      const figure = document.createElement("figure")
      gallery.appendChild(figure)

      const images = document.createElement("img")
      images.src = objet.imageUrl
      figure.appendChild(images)

      const figcaption = document.createElement("figcaption")
      figcaption.innerHTML = objet.title
      figure.appendChild(figcaption)
    })

    // Récupérer les différentes catégories d'objets
    const categories = data.map(objet => objet.category.name)
    const uniqueCategories = [...new Set(categories)]
    uniqueCategories.unshift("Tout")
    

    uniqueCategories.forEach(category => {
      const filterBtn = document.createElement("button")
      filterBtn.innerHTML = category
      filter.appendChild(filterBtn)
      filterBtn.classList.add("filter-btn")
      filterBtn.setAttribute("onclick", `filtrer('${category}')`)
    })

    // Système de filtrage

    window.onload = () => {
      filtrer("Tout")
    }

    function filtrer(value) {
      const filterBtn = document.querySelectorAll(".filter-btn")
      filterBtn.forEach((btn) => {
        if (btn.innerHTML.toUpperCase() === value.toUpperCase()) {
          btn.classList.add("active-filter-btn")
        } else {
          btn.classList.remove("active-filter-btn")
        }

        
      })   
    }
  
  })

  

  

  
     
