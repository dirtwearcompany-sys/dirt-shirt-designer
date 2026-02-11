// ========================================
// FIREBASE CONFIGURATION
// ========================================
// IMPORTANT: Replace these with your own Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps
// https://console.firebase.google.com/

const firebaseConfig = {
    apiKey: "AIzaSyC7emcD5iDYSLsjOH0NwstwM_0rRhkDpDA",
    authDomain: "dirt-shirt-designer.firebaseapp.com",
    projectId: "dirt-shirt-designer",
    storageBucket: "dirt-shirt-designer.firebasestorage.app",
    messagingSenderId: "268887622342",
    appId: "1:268887622342:web:53d7386623156b06494dc7"
};

// Initialize Firebase
let app, auth;
try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    alert('Error initializing authentication. Please refresh the page.');
}

// ========================================
// SHIRT IMAGE URLs
// ========================================
// Host these images on a CDN or use relative paths
// For now, using placeholder - replace with your actual shirt images

const SHIRT_IMAGE_URLS = {
    shortSleeve: {
        front: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"%3E%3Crect fill="%23saddlebrown" width="800" height="1000"/%3E%3Ctext x="400" y="500" text-anchor="middle" fill="white" font-size="24" font-family="Arial"%3EShort Sleeve Front%3C/text%3E%3C/svg%3E',
        back: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"%3E%3Crect fill="%23saddlebrown" width="800" height="1000"/%3E%3Ctext x="400" y="500" text-anchor="middle" fill="white" font-size="24" font-family="Arial"%3EShort Sleeve Back%3C/text%3E%3C/svg%3E'
    },
    longSleeve: {
        front: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"%3E%3Crect fill="%23saddlebrown" width="800" height="1000"/%3E%3Ctext x="400" y="500" text-anchor="middle" fill="white" font-size="24" font-family="Arial"%3ELong Sleeve Front%3C/text%3E%3C/svg%3E',
        back: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"%3E%3Crect fill="%23saddlebrown" width="800" height="1000"/%3E%3Ctext x="400" y="500" text-anchor="middle" fill="white" font-size="24" font-family="Arial"%3ELong Sleeve Back%3C/text%3E%3C/svg%3E'
    }
};

// ========================================
// SIZE SPECIFICATIONS (Industry Standard)
// ========================================
const sizeSpecs = {
    'adult-s': { 
        chest: 36, 
        length: 28, 
        printWidth: 12,
        centerChest: {
            fromCollar: 3,
            maxWidth: 12
        },
        leftChest: {
            fromCollar: 3,
            fromSeam: 3,
            maxWidth: 4,
            maxHeight: 4
        }
    },
    'adult-m': { 
        chest: 40, 
        length: 29, 
        printWidth: 12,
        centerChest: {
            fromCollar: 3,
            maxWidth: 12
        },
        leftChest: {
            fromCollar: 3,
            fromSeam: 3.5,
            maxWidth: 4,
            maxHeight: 4
        }
    },
    'adult-l': { 
        chest: 44, 
        length: 30, 
        printWidth: 13,
        centerChest: {
            fromCollar: 3.5,
            maxWidth: 13
        },
        leftChest: {
            fromCollar: 3.5,
            fromSeam: 4,
            maxWidth: 4.5,
            maxHeight: 4.5
        }
    },
    'adult-xl': { 
        chest: 48, 
        length: 31, 
        printWidth: 13,
        centerChest: {
            fromCollar: 3.5,
            maxWidth: 13
        },
        leftChest: {
            fromCollar: 3.5,
            fromSeam: 4,
            maxWidth: 4.5,
            maxHeight: 4.5
        }
    },
    'adult-2xl': { 
        chest: 52, 
        length: 32, 
        printWidth: 14,
        centerChest: {
            fromCollar: 4,
            maxWidth: 14
        },
        leftChest: {
            fromCollar: 4,
            fromSeam: 4.5,
            maxWidth: 5,
            maxHeight: 5
        }
    },
    'youth-s': { 
        chest: 30, 
        length: 20, 
        printWidth: 8,
        centerChest: {
            fromCollar: 2.5,
            maxWidth: 8
        },
        leftChest: {
            fromCollar: 2.5,
            fromSeam: 2.5,
            maxWidth: 3,
            maxHeight: 3
        }
    },
    'youth-m': { 
        chest: 32, 
        length: 22, 
        printWidth: 9,
        centerChest: {
            fromCollar: 2.5,
            maxWidth: 9
        },
        leftChest: {
            fromCollar: 2.5,
            fromSeam: 2.5,
            maxWidth: 3.5,
            maxHeight: 3.5
        }
    },
    'youth-l': { 
        chest: 34, 
        length: 24, 
        printWidth: 10,
        centerChest: {
            fromCollar: 3,
            maxWidth: 10
        },
        leftChest: {
            fromCollar: 3,
            fromSeam: 3,
            maxWidth: 3.5,
            maxHeight: 3.5
        }
    },
    'youth-xl': { 
        chest: 36, 
        length: 26, 
        printWidth: 11,
        centerChest: {
            fromCollar: 3,
            maxWidth: 11
        },
        leftChest: {
            fromCollar: 3,
            fromSeam: 3,
            maxWidth: 4,
            maxHeight: 4
        }
    }
};
