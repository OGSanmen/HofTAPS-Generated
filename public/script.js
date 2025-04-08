import { db, auth } from '../firebase/firebase-config.js';
import { showToast } from '../utils/notifications.js';
import { getPlatformStats } from '../utils/stats.js';
import { categoryFilters } from '../utils/filters.js';

// === Auth Status Bar ===
auth.onAuthStateChanged(user => {
    const status = document.getElementById("auth-status");
    const buttons = document.getElementById("auth-buttons");
  
    if (user && user.emailVerified) {
      if (status) status.innerHTML = `Welcome, ${user.displayName || user.email.split('@')[0]} <button onclick="logout()">Logout</button>`;
      if (buttons) buttons.style.display = "none";
    } else {
      if (status) status.innerHTML = `<a href="login.html">Login</a>`;
      if (buttons) buttons.style.display = "flex";
    }
  });
  
  window.logout = () => {
    auth.signOut().then(() => location.reload());
  };

function logout() {
  auth.signOut().then(() => {
    showToast("success", "Logged out");
    window.location.reload();
  });
}

// === Quick Filter Chips ===
const filters = ['Math', 'Science', 'CS', 'Engineering', 'Literature'];
const filterContainer = document.getElementById('quick-filters');

filters.forEach(cat => {
  const btn = document.createElement('button');
  btn.className = 'chip';
  btn.innerText = cat;
  btn.onclick = () => categoryFilters(cat);
  filterContainer.appendChild(btn);
});

// === Load Platform Stats ===
getPlatformStats().then(stats => {
  document.getElementById("book-count").innerText = stats.totalBooks;
  document.getElementById("user-count").innerText = stats.totalUsers;
  document.getElementById("today-count").innerText = stats.todayListings;
});

// === Featured Books Carousel ===
db.collection("books")
  .where("featured", "==", true)
  .limit(10)
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      const book = doc.data();
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <img src="${book.coverUrl || 'https://via.placeholder.com/150'}" width="100%" />
        <strong>${book.title}</strong><br/>
        <small>${book.author}</small>
      `;
      document.getElementById("featuredCarousel").appendChild(slide);
    });

    new Swiper('#featured-carousel', {
      slidesPerView: 3,
      spaceBetween: 10,
    });
  });

// === Recently Viewed Carousel ===
const viewed = JSON.parse(localStorage.getItem('viewedBooks') || "[]");

viewed.slice(-10).reverse().forEach(id => {
  db.collection("books").doc(id).get().then(doc => {
    if (doc.exists) {
      const book = doc.data();
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <img src="${book.coverUrl || 'https://via.placeholder.com/150'}" width="100%" />
        <strong>${book.title}</strong><br/>
        <small>${book.author}</small>
      `;
      document.getElementById("recentCarousel").appendChild(slide);
    }
  });
});

new Swiper('#recent-carousel', {
  slidesPerView: 3,
  spaceBetween: 10,
});

// === Load Listings with Skeleton Loader ===
const listingsContainer = document.getElementById("listings");

// Show loading skeletons
for (let i = 0; i < 6; i++) {
  const skeleton = document.createElement("div");
  skeleton.className = "skeleton skeleton-card";
  listingsContainer.appendChild(skeleton);
}

db.collection("books")
  .orderBy("createdAt", "desc")
  .limit(20)
  .get()
  .then(snapshot => {
    listingsContainer.innerHTML = ""; // Clear skeletons
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
        <a href="book.html?id=${doc.id}">View Details</a>
      `;
      listingsContainer.appendChild(card);
    });
  })
  .catch((err) => {
    showToast("error", "Failed to load listings");
    console.error(err);
  });
