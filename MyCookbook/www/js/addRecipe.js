import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyAzkP0HsaAmoG_BAU31vE8vZbNrjqTX3M0",
    authDomain: "my-cookbook-65b42.firebaseapp.com",
    projectId: "my-cookbook-65b42",
    storageBucket: "my-cookbook-65b42.appspot.com",
    messagingSenderId: "115421909243",
    appId: "1:115421909243:web:7a17ee80e33750aa54605e",
    databaseURL: "https://my-cookbook-65b42-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);

import { getDatabase, set, ref as dbRef }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { getStorage, ref as sRef, uploadBytes, getDownloadURL }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Get references to Storage and Database
const storage = getStorage();
const database = getDatabase();

const btnSubmit = document.getElementById('btnSubmit');

btnSubmit.addEventListener('click', async () => {
    const title = document.getElementById('inputTitle').value;
    const description = document.getElementById('inputDescription').value;
    const picture = document.getElementById('inputPicture').files[0]; // Get the first selected file
    const ingredients = document.getElementById('inputIngredients').value;
    const instructions = document.getElementById('inputInstructions').value;

    // Basic validation (replace with more comprehensive checks)
    if (!title || !description || !picture || !ingredients || !instructions) {
        alert('Please fill in all fields!');
        return;
    }

    // Upload image to Firebase Storage
    try {
        if (picture) {
        const imageRef = sRef(storage, `images/${picture.name}`); // Create a reference in the "images" folder
        await uploadBytes(imageRef, picture); // Upload the image

        // Get the download URL for the uploaded image
        const imageUrl = await getDownloadURL(imageRef);

        // Create the recipe object with the image URL
        const recipe = {
            title,
            description,
            picture: imageUrl,
            ingredients,
            instructions,
        };

        // Add recipe data to Firebase Realtime Database (replace with Cloud Firestore if needed)
        const recipeRef = dbRef(database, 'recipes/' + title); // Reference the "recipes" collection
        await set(recipeRef, recipe);

        alert('Recipe added successfully!');
        // Clear the form after successful addition (optional)
        } else {
        alert('Please select an image!');
        }
    } catch (error) {
        console.error('Error adding recipe:', error);
        alert('An error occurred. Please try again.');
    }
});