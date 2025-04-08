import { db } from "../firebase/firebase-config.js";
import { showToast } from "./notifications.js";

export function categoryFilters(category) {
  const listingsContainer = document.getElementById("listings");
  listingsContainer.innerHTML = "";

  // Show loading skeletons
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton skeleton-card";
    listingsContainer.appendChild(skeleton);
  }

  db.collection("books")
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get()
    .then(snapshot => {
      listingsContainer.innerHTML = "";
      if (snapshot.empty) {
        listingsContainer.innerHTML = `<p style="padding: 1rem;">No books found in ${category}</p>`;
        return;
      }

      snapshot.forEach(doc => {
        const book = doc.data();
        const card = document.createElement("div");
        card.className = "listing-card";
        card.innerHTML = `
          <img src="${book.coverUrl || 'https://via.placeholder.com/150'}" width="100%">
          <h3>${book.title}</h3>
          <p><strong>${book.author}</strong></p>
          <p>Condition: ${book.condition || 'Unknown'}</p>
          <p>$${book.price || 'N/A'}</p>
          <a href="/book.html?id=${doc.id}">View Details</a>
        `;
        listingsContainer.appendChild(card);
      });
    })
    .catch(err => {
      showToast("error", "Filter failed");
      console.error(err);
    });
}
