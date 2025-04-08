import { db } from "../firebase/firebase-config.js";

export async function getPlatformStats() {
  let totalBooks = 0;
  let totalUsers = 0;
  let todayListings = 0;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayStart = firebase.firestore.Timestamp.fromDate(now);

  try {
    // Total books
    const booksSnap = await db.collection("books").get();
    totalBooks = booksSnap.size;

    // Total users
    const usersSnap = await db.collection("users").get();
    totalUsers = usersSnap.size;

    // Today's listings
    const todaySnap = await db
      .collection("books")
      .where("createdAt", ">=", todayStart)
      .get();
    todayListings = todaySnap.size;

    return {
      totalBooks,
      totalUsers,
      todayListings,
    };
  } catch (err) {
    console.error("Stats fetch failed:", err);
    return {
      totalBooks: 0,
      totalUsers: 0,
      todayListings: 0,
    };
  }
}
