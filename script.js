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

    //création de la section filtre

    for (const category of uniqueCategories) {
      const filterBtn = document.createElement("button");
      filterBtn.textContent = category;
      filterBtn.classList.add("filter-btn");
      // tout par défault
      filterBtn.addEventListener("click", () => {
        const allFilterBtn = document.querySelectorAll(".filter-btn");
        for (const currentFilterBtn of allFilterBtn) {
          if (currentFilterBtn === filterBtn) {
            currentFilterBtn.classList.add("active-filter-btn");
            //afficher
          } else {
            currentFilterBtn.classList.remove("active-filter-btn");
            //masquer
          }
        }
      });
      filterElement.appendChild(filterBtn);
    }
  } catch (err) {
    console.error(err);
  }
}

initGallery();
