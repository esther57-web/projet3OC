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

    for (const category of uniqueCategories) {
      const filterBtn = document.createElement("button");
      filterBtn.textContent = category;
      filterBtn.classList.add("filter-btn");
      
      function filtrer(filtre) {
        filtre = "Tout";

        // Je veux ajouter une classe active au filterBtn qui a un textContext égal à "Tout" mais ça l'ajoute à tous les boutons
        if (filtre === "Tout") {
            filterBtn.classList.add("active-filter-btn");
        }

        filterBtn.addEventListener("click", () => {
            const allFilterBtn = document.querySelectorAll(".filter-btn");
            filtre = filterBtn.textContent;
            for (const currentFilterBtn of allFilterBtn) {
              if (currentFilterBtn === filterBtn) {
                currentFilterBtn.classList.add("active-filter-btn");
              } else {
                currentFilterBtn.classList.remove("active-filter-btn");
              }
            }
            // ici la valeur filtre est correctement mise à jour quand je clique sur une catégorie mais pas à l'extérieur du addEventlisteber
            //console.log(filtre)
        });

        //ici la valeur n'est pas mise à jour elle reste sur la valeur par défaut "Tout"
        console.log(filtre)

        const allFigure = document.querySelectorAll(".figure")
       
        for (const [index, figure] of allFigure.entries()) {
            const category = data[index].category.name;
            figure.setAttribute('data-category', category);
            if (category === filtre || filtre === "Tout" ) {
          figure.classList.remove("hidden")
            } else {
          figure.classList.add("hidden")
            }
        }


      }
      
      filtrer()
      filterElement.appendChild(filterBtn);
    }
  } catch (err) {
    console.error(err);
  }
}

initGallery();