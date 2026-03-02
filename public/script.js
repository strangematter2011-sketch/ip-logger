let btnEL = document.querySelector("button");
let headingEL = document.querySelector("h2");
let nameInput = document.querySelector("#nameInput");

btnEL.addEventListener("click", () => {
    const name = nameInput.value.trim();

    if (!name) {
        alert("Please enter your name");
        return;
    }

    headingEL.textContent = "Fetching...";

    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => {
            headingEL.textContent = data.ip;

            // Send name + IP to backend
            fetch("/save-ip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    name: name,
                    ip: data.ip 
                })
            });
        })
        .catch(err => console.log(err));
});
