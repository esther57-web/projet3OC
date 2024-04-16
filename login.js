
function login() {
    const logForm = document.querySelector(".log-form");
    
    logForm.addEventListener("submit", function (event) {
        event.preventDefault();
        // Création de l’objet du nouvel avis.
        const user = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };

        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(user);
        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        })

        .then(response => {
            if (response.status !== 200) {
                alert("Erreur : les informations de connexion sont incorrectes. Veuillez réessayer.");
            } else {
                return response.json();
            }
            
        })
        .then(data => {
            // Récupération du token d'authentification
            const token = data.token;
           
            // Stockage du token dans Session Storage
            sessionStorage.setItem("authToken", token);
            window.location.href = "index.html";
            
            

        })
        .catch(err => {
            
            console.log(err);
            alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.");
        });

       
        
    });
    
}

login()

