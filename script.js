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