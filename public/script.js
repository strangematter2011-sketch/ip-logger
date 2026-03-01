let btnEL = document.querySelector("button");
let headingEL = document.querySelector("h2");

btnEL.addEventListener("click", () => {
    headingEL.textContent = "Fetching...";

    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => {
            headingEL.textContent = data.ip;

            // Send to your backend
            fetch("/save-ip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ip: data.ip })
            });
        })
        .catch(err => console.log(err));
});