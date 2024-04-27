
function login() {
    const logForm = document.querySelector(".log-form"); 
    logForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const user = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        const chargeUtile = JSON.stringify(user);
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
            const token = data.token;
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

