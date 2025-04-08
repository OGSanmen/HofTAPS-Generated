const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.uploadBookSignedURL = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be signed in to upload files.",
    );
  }

  const { fileName, contentType } = data;

  if (!fileName || !contentType) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: fileName or contentType.",
    );
  }

  const uid = context.auth.uid;
  const timestamp = Date.now();
  const safeName = encodeURIComponent(fileName);
  const filePath = `book-photos/${uid}/${timestamp}-${safeName}`;
  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);

  try {
    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      contentType,
    });

    return {
      uploadUrl,
      path: filePath,
    };
  } catch (err) {
    console.error("Error generating signed URL:", err);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate signed URL.",
    );
  }
});