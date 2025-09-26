document.addEventListener("DOMContentLoaded", () => {

  // 1️⃣ Get the game ID from the URL query string
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("game"); // e.g., "monkey-mart"

  const notLoggedIn = document.getElementById("not-logged-in");
  const gameContainer = document.getElementById("game-container");
  const gameFrame = document.getElementById("game-frame");

  // 2️⃣ Check login
  const token = "Nf9qNFv9wLTHdvWrvgI0Sb89Tyysbj6r"; 
  if (localStorage.getItem("french_logged_in") !== token) {
    if (notLoggedIn) notLoggedIn.style.display = "block";
    if (gameContainer) gameContainer.style.display = "none";
    return; // stop loading game
  } else {
    if (notLoggedIn) notLoggedIn.style.display = "none";
    if (gameContainer) gameContainer.style.display = "block";
  }

  if (!gameId) {
    alert("No game selected!");
    return;
  }

  // 3️⃣ Load CSV and find game
  fetch("games/game-list.csv")
    .then(res => res.text())
    .then(data => {
      const rows = data.split("\n").slice(1); // skip header
      let found = false;

      for (let row of rows) {
        if (!row.trim()) continue;
        const [name, link, img, iframeSrc, desc, working] = row.split(",").map(x => x.trim());

        // Use name slug as ID
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        if (slug === gameId && working === "yes") {
          // Found the game
          found = true;

          // Update iframe src
          if (gameFrame) gameFrame.src = iframeSrc;

          // Update title
          document.title = `${name} | French Help For School`;

          // Optionally, you could add description below iframe if desired
          return;
        }
      }

      if (!found) {
        // Game not found
        if (gameFrame) gameFrame.src = "../navigation/404.html";
      }
    })
    .catch(err => {
      console.error("Error loading game CSV:", err);
      if (gameFrame) gameFrame.src = "../navigation/404.html";
    });

});
