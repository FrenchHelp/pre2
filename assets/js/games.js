document.addEventListener("DOMContentLoaded", () => {
  fetch("games/game-list.csv")
    .then(res => res.text())
    .then(data => {
      const rows = data.split("\n").slice(1); // skip header
      const container = document.getElementById("game-container");

      rows.forEach(row => {
        if (!row.trim()) return;
        const [name, link, img, iframeSrc, desc, working] = row.split(",").map(x => x.trim());

        if (working !== "yes") return; // only show working games

        // Create game card
        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
          <a href="${link}">
            <img src="${img}" alt="${name}">
          </a>
          <div class="game-overlay">
            <img src="assets/images/icons/share.png" alt="Share" class="share-btn">
            <img src="assets/images/icons/tab.png" alt="Launch" class="launch-btn">
          </div>
        `;

        // Share button logic
        card.querySelector(".share-btn").addEventListener("click", (e) => {
          e.preventDefault();
          if (navigator.share) {
            navigator.share({
              title: name,
              text: desc,
              url: window.location.origin + "/" + link
            }).catch(err => console.log("Share canceled", err));
          } else {
            alert("Sharing not supported in this browser.");
          }
        });

        // Launch button logic
        card.querySelector(".launch-btn").addEventListener("click", (e) => {
          e.preventDefault();

          // Open a blank tab
          const newTab = window.open("about:blank", "_blank");
          if (newTab) {
            // Wait for the iframe to load
            const iframe = newTab.document.createElement("iframe");
            iframe.style.border = "0";
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";

            // Append iframe to the body
            newTab.document.body.style.margin = "0";
            newTab.document.body.appendChild(iframe);

            // Create a load event listener
            iframe.onload = () => {
              // Inject content after iframe loads
              iframe.contentDocument.open();
              iframe.contentDocument.write(`
                <body style="margin:0;padding:0;">
                  <iframe src="${link}" style="border:0;width:100%;height:100%;"></iframe>
                </body>
              `);
              iframe.contentDocument.close();
            };

            // To trigger the load, set src or do other setup if needed
            // But since we are injecting an iframe inside, ensure the outer iframe is ready
            // For cross-origin links, this may be restricted
            // So alternatively, directly set the src of the outer iframe
            iframe.srcdoc = `<body style="margin:0;padding:0;">
              <iframe src="${link}" style="border:0;width:100%;height:100%;"></iframe>
            </body>`;
          } else {
            alert("Popup blocked! Please allow popups for this site.");
          }
        });

        container.appendChild(card);
      });
    })
    .catch(err => console.error("Error loading game list:", err));
});
