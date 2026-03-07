const card = document.getElementById("card");

card.addEventListener("mousemove", (e) => {

  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = -(y - centerY) / 10;
  const rotateY = (x - centerX) / 10;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

card.addEventListener("mouseleave", () => {
  card.style.transform = "rotateX(0) rotateY(0)";
});

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
