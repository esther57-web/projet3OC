/*********************************** gallery + filter ***************************************/

const galleryElement = document.querySelector(".gallery");
const filterElement = document.querySelector(".filter");


const allFilterBtn = [];

async function initGallery() {
  try {
    const req = await fetch("http://localhost:5678/api/works");
    const data = await req.json();

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
    const uniqueCategories = [...new Set(categories)];
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

  const editBtn = document.createElement("button")
  editBtn.innerHTML = "modifier"
  mesProjetsTitle.appendChild(editBtn)

  const blackEditIcon = document.createElement("img")
  blackEditIcon.src = "assets/icons/pen-to-square-regular (1).svg"
  blackEditIcon.alt = "icone du bouton d'édition"
  editBtn.prepend(blackEditIcon)

  //suppression section filtre

  filterElement.style.display = "none"

  } 
}

editMode()


