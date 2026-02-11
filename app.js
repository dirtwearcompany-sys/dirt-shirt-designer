// ========================================
// APPLICATION STATE
// ========================================
let state = {
    isAuthenticated: false,
    userEmail: '',
    shirtView: 'front',
    shirtSize: 'adult-m',
    sleeveType: 'short',
    logoImage: null,
    logoImageObj: null,
    logoPosition: { x: 50, y: 45 },
    logoScale: 40,
    isDragging: false,
    logoPlacement: 'center',
    shirtImagesLoaded: false
};

// Shirt images storage
const shirtImages = {
    shortSleeve: {
        front: null,
        back: null
    },
    longSleeve: {
        front: null,
        back: null
    }
};

// ========================================
// DOM ELEMENTS
// ========================================
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');

const signinTab = document.getElementById('signinTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');

const signupEmailInput = document.getElementById('signupEmailInput');
const signupPasswordInput = document.getElementById('signupPasswordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const signupErrorMessage = document.getElementById('signupErrorMessage');
const signupSuccessMessage = document.getElementById('signupSuccessMessage');
const signupBtn = document.getElementById('signupBtn');
const signupBtnText = document.getElementById('signupBtnText');

const userEmailDisplay = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

const shirtCanvas = document.getElementById('shirtCanvas');
const shirtRenderCanvas = document.getElementById('shirtRenderCanvas');
const ctx = shirtRenderCanvas.getContext('2d');
const emptyState = document.getElementById('emptyState');
const sizeWarning = document.getElementById('sizeWarning');
const measurementOverlay = document.getElementById('measurementOverlay');

const frontViewBtn = document.getElementById('frontViewBtn');
const backViewBtn = document.getElementById('backViewBtn');
const uploadBtn = document.getElementById('uploadBtn');
const logoUpload = document.getElementById('logoUpload');
const deleteBtn = document.getElementById('deleteBtn');
const downloadBtn = document.getElementById('downloadBtn');

const shirtSizeSelect = document.getElementById('shirtSize');
const shortSleeveBtn = document.getElementById('shortSleeveBtn');
const longSleeveBtn = document.getElementById('longSleeveBtn');

const logoAdjustments = document.getElementById('logoAdjustments');
const logoSizeSlider = document.getElementById('logoSize');
const sizeValue = document.getElementById('sizeValue');
const centerBtn = document.getElementById('centerBtn');
const centerLogoBtn = document.getElementById('centerLogoBtn');
const leftChestBtn = document.getElementById('leftChestBtn');

const liveSizeDisplay = document.getElementById('liveSizeDisplay');
const liveLogoWidth = document.getElementById('liveLogoWidth');
const liveLogoHeight = document.getElementById('liveLogoHeight');
const livePrintPercent = document.getElementById('livePrintPercent');
const liveShirtSize = document.getElementById('liveShirtSize');

const specsPanel = document.getElementById('specsPanel');
const maxPrintArea = document.getElementById('maxPrintArea');
const chestWidth = document.getElementById('chestWidth');
const collarDistance = document.getElementById('collarDistance');
const leftSeamDistance = document.getElementById('leftSeamDistance');
const recommendedLogoSize = document.getElementById('recommendedLogoSize');
const placementTitle = document.getElementById('placementTitle');
const leftChestSpecs = document.getElementById('leftChestSpecs');

const processingOverlay = document.getElementById('processingOverlay');

// ========================================
// UTILITY FUNCTIONS
// ========================================
function clearMessages() {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
    signupErrorMessage.classList.add('hidden');
    signupSuccessMessage.classList.add('hidden');
}

function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

function showProcessing(show = true) {
    if (show) {
        processingOverlay.classList.remove('hidden');
    } else {
        processingOverlay.classList.add('hidden');
    }
}

// ========================================
// IMAGE LOADING
// ========================================
function loadShirtImages() {
    return new Promise((resolve, reject) => {
        let loadedCount = 0;
        const totalImages = 4;
        let hasError = false;
        
        const checkComplete = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                if (hasError) {
                    reject(new Error('Some shirt images failed to load'));
                } else {
                    state.shirtImagesLoaded = true;
                    resolve();
                }
            }
        };
        
        const handleError = (imageName) => {
            console.error(`Failed to load ${imageName}`);
            hasError = true;
            checkComplete();
        };
        
        // Short sleeve front
        const shortFront = new Image();
        shortFront.onload = () => {
            shirtImages.shortSleeve.front = shortFront;
            checkComplete();
        };
        shortFront.onerror = () => handleError('short sleeve front');
        shortFront.src = SHIRT_IMAGE_URLS.shortSleeve.front;
        
        // Short sleeve back
        const shortBack = new Image();
        shortBack.onload = () => {
            shirtImages.shortSleeve.back = shortBack;
            checkComplete();
        };
        shortBack.onerror = () => handleError('short sleeve back');
        shortBack.src = SHIRT_IMAGE_URLS.shortSleeve.back;
        
        // Long sleeve front
        const longFront = new Image();
        longFront.onload = () => {
            shirtImages.longSleeve.front = longFront;
            checkComplete();
        };
        longFront.onerror = () => handleError('long sleeve front');
        longFront.src = SHIRT_IMAGE_URLS.longSleeve.front;
        
        // Long sleeve back
        const longBack = new Image();
        longBack.onload = () => {
            shirtImages.longSleeve.back = longBack;
            checkComplete();
        };
        longBack.onerror = () => handleError('long sleeve back');
        longBack.src = SHIRT_IMAGE_URLS.longSleeve.back;
    });
}

// ========================================
// TAB SWITCHING
// ========================================
signinTab.addEventListener('click', () => {
    signinTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    clearMessages();
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    signinTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    clearMessages();
});

// ========================================
// FIREBASE AUTHENTICATION
// ========================================
auth.onAuthStateChanged((user) => {
    if (user) {
        state.isAuthenticated = true;
        state.userEmail = user.email;
        showMainApp();
    } else {
        state.isAuthenticated = false;
        loginScreen.style.display = 'flex';
        mainApp.style.display = 'none';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    loginBtn.disabled = true;
    loginBtnText.innerHTML = '<span class="loading"></span>';
    clearMessages();
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('Login error:', error);
        let errorMsg = 'Login failed. Please try again.';
        
        switch(error.code) {
            case 'auth/invalid-email':
                errorMsg = 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMsg = 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMsg = 'No account found with this email. Please sign up first.';
                break;
            case 'auth/wrong-password':
                errorMsg = 'Incorrect password.';
                break;
            case 'auth/invalid-credential':
                errorMsg = 'Invalid email or password. If you don\'t have an account, please sign up.';
                break;
            case 'auth/too-many-requests':
                errorMsg = 'Too many failed attempts. Try again later.';
                break;
            default:
                errorMsg = error.message;
        }
        
        showError(errorMessage, errorMsg);
        loginBtn.disabled = false;
        loginBtnText.textContent = 'Sign In';
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    signupBtn.disabled = true;
    signupBtnText.innerHTML = '<span class="loading"></span>';
    clearMessages();
    
    if (password !== confirmPassword) {
        showError(signupErrorMessage, 'Passwords do not match.');
        signupBtn.disabled = false;
        signupBtnText.textContent = 'Create Account';
        return;
    }
    
    if (password.length < 6) {
        showError(signupErrorMessage, 'Password must be at least 6 characters.');
        signupBtn.disabled = false;
        signupBtnText.textContent = 'Create Account';
        return;
    }
    
    try {
        await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('Signup error:', error);
        let errorMsg = 'Sign up failed. Please try again.';
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMsg = 'An account with this email already exists. Please sign in instead.';
                break;
            case 'auth/invalid-email':
                errorMsg = 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                errorMsg = 'Email/password sign up is not enabled.';
                break;
            case 'auth/weak-password':
                errorMsg = 'Password is too weak. Please use a stronger password.';
                break;
            default:
                errorMsg = error.message;
        }
        
        showError(signupErrorMessage, errorMsg);
        signupBtn.disabled = false;
        signupBtnText.textContent = 'Create Account';
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
});

async function showMainApp() {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'block';
    userEmailDisplay.textContent = state.userEmail;
    
    loginForm.reset();
    signupForm.reset();
    loginBtn.disabled = false;
    signupBtn.disabled = false;
    loginBtnText.textContent = 'Sign In';
    signupBtnText.textContent = 'Create Account';
    clearMessages();
    
    // Load shirt images if not already loaded
    if (!state.shirtImagesLoaded) {
        try {
            showProcessing(true);
            await loadShirtImages();
            showProcessing(false);
        } catch (error) {
            showProcessing(false);
            console.error('Error loading shirt images:', error);
            alert('Some shirt images failed to load. Using fallback placeholders.');
        }
    }
    
    renderShirt();
}

// ========================================
// SHIRT RENDERING
// ========================================
function renderShirt() {
    const width = shirtRenderCanvas.width;
    const height = shirtRenderCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Get the appropriate shirt image
    const sleeveType = state.sleeveType === 'short' ? 'shortSleeve' : 'longSleeve';
    const view = state.shirtView;
    const shirtImg = shirtImages[sleeveType][view];
    
    if (shirtImg && shirtImg.complete) {
        // Draw shirt image
        const imgAspect = shirtImg.width / shirtImg.height;
        const canvasAspect = width / height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspect > canvasAspect) {
            // Image is wider than canvas
            drawHeight = height;
            drawWidth = height * imgAspect;
            offsetX = (width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Image is taller than canvas
            drawWidth = width;
            drawHeight = width / imgAspect;
            offsetX = 0;
            offsetY = (height - drawHeight) / 2;
        }
        
        ctx.drawImage(shirtImg, offsetX, offsetY, drawWidth, drawHeight);
    } else {
        // Fallback: draw a brown rectangle if image not loaded
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, width, height);
        
        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = '24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${state.sleeveType === 'short' ? 'Short' : 'Long'} Sleeve ${state.shirtView}`, width / 2, height / 2);
    }
    
    // Draw logo if exists
    if (state.logoImageObj) {
        drawLogo();
    }
    
    // Update measurements
    updateMeasurements();
}

function drawLogo() {
    if (!state.logoImageObj) return;
    
    const width = shirtRenderCanvas.width;
    const height = shirtRenderCanvas.height;
    
    // Print area dimensions (center of shirt)
    const printAreaWidth = width * 0.55;
    const printAreaHeight = height * 0.45;
    const printAreaX = width * 0.225;
    const printAreaY = height * 0.25;
    
    // Calculate logo dimensions
    const logoScale = state.logoScale / 100;
    const logoWidth = printAreaWidth * logoScale;
    const logoHeight = (state.logoImageObj.height / state.logoImageObj.width) * logoWidth;
    
    // Calculate position
    const x = printAreaX + (state.logoPosition.x / 100) * printAreaWidth - logoWidth / 2;
    const y = printAreaY + (state.logoPosition.y / 100) * printAreaHeight - logoHeight / 2;
    
    // Draw logo with realistic shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(state.logoImageObj, x, y, logoWidth, logoHeight);
    ctx.restore();
}

// ========================================
// MEASUREMENT DISPLAY
// ========================================
function updateMeasurements() {
    if (!state.logoImageObj) {
        measurementOverlay.innerHTML = '';
        return;
    }
    
    const specs = sizeSpecs[state.shirtSize];
    const placement = state.logoPlacement === 'center' ? specs.centerChest : specs.leftChest;
    
    const maxWidth = specs.printWidth;
    const logoWidthInches = (state.logoScale / 100) * maxWidth;
    const aspectRatio = state.logoImageObj.height / state.logoImageObj.width;
    const logoHeightInches = logoWidthInches * aspectRatio;
    
    const printAreaPercent = (logoWidthInches / maxWidth) * 100;
    
    liveLogoWidth.textContent = logoWidthInches.toFixed(2) + '"';
    liveLogoHeight.textContent = logoHeightInches.toFixed(2) + '"';
    livePrintPercent.textContent = printAreaPercent.toFixed(1) + '%';
    liveShirtSize.textContent = shirtSizeSelect.options[shirtSizeSelect.selectedIndex].text;
    
    const isOversized = logoWidthInches > placement.maxWidth;
    if (isOversized) {
        sizeWarning.classList.add('show');
        liveLogoWidth.parentElement.querySelector('.metric-value').classList.add('warning');
    } else {
        sizeWarning.classList.remove('show');
        liveLogoWidth.parentElement.querySelector('.metric-value').classList.remove('warning');
    }
    
    drawMeasurementLines(logoWidthInches, logoHeightInches);
}

function drawMeasurementLines(widthInches, heightInches) {
    const canvas = shirtRenderCanvas;
    const rect = canvas.getBoundingClientRect();
    
    if (!state.logoImageObj) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    const printAreaWidth = width * 0.55;
    const printAreaHeight = height * 0.45;
    const printAreaX = width * 0.225;
    const printAreaY = height * 0.25;
    
    const logoScale = state.logoScale / 100;
    const logoWidth = printAreaWidth * logoScale;
    const logoHeight = (state.logoImageObj.height / state.logoImageObj.width) * logoWidth;
    
    const x = printAreaX + (state.logoPosition.x / 100) * printAreaWidth;
    const y = printAreaY + (state.logoPosition.y / 100) * printAreaHeight;
    
    const scaleX = rect.width / width;
    const scaleY = rect.height / height;
    
    const screenX = x * scaleX;
    const screenY = y * scaleY;
    const screenWidth = logoWidth * scaleX;
    const screenHeight = logoHeight * scaleY;
    
    measurementOverlay.innerHTML = '';
    
    // Width measurement
    const widthLine = document.createElement('div');
    widthLine.className = 'measurement-line horizontal';
    widthLine.style.left = (screenX - screenWidth/2) + 'px';
    widthLine.style.top = (screenY + screenHeight/2 + 10) + 'px';
    widthLine.style.width = screenWidth + 'px';
    measurementOverlay.appendChild(widthLine);
    
    const widthLabel = document.createElement('div');
    widthLabel.className = 'measurement-label';
    widthLabel.textContent = widthInches.toFixed(2) + '" wide';
    widthLabel.style.left = screenX + 'px';
    widthLabel.style.top = (screenY + screenHeight/2 + 20) + 'px';
    widthLabel.style.transform = 'translateX(-50%)';
    measurementOverlay.appendChild(widthLabel);
    
    // Height measurement
    const heightLine = document.createElement('div');
    heightLine.className = 'measurement-line vertical';
    heightLine.style.left = (screenX + screenWidth/2 + 10) + 'px';
    heightLine.style.top = (screenY - screenHeight/2) + 'px';
    heightLine.style.height = screenHeight + 'px';
    measurementOverlay.appendChild(heightLine);
    
    const heightLabel = document.createElement('div');
    heightLabel.className = 'measurement-label';
    heightLabel.textContent = heightInches.toFixed(2) + '" tall';
    heightLabel.style.left = (screenX + screenWidth/2 + 20) + 'px';
    heightLabel.style.top = screenY + 'px';
    heightLabel.style.transform = 'translateY(-50%)';
    measurementOverlay.appendChild(heightLabel);
}

// ========================================
// PRINT SPECIFICATIONS
// ========================================
function updatePrintSpecs() {
    const specs = sizeSpecs[state.shirtSize];
    const placement = state.logoPlacement === 'center' ? specs.centerChest : specs.leftChest;
    
    maxPrintArea.textContent = specs.printWidth + '"';
    chestWidth.textContent = specs.chest + '"';
    collarDistance.textContent = placement.fromCollar + '"';
    recommendedLogoSize.textContent = placement.maxWidth + '" wide';
    
    if (state.logoPlacement === 'center') {
        placementTitle.textContent = 'Center Chest Placement';
        leftChestSpecs.style.display = 'none';
    } else {
        placementTitle.textContent = 'Left Chest Placement';
        leftChestSpecs.style.display = 'flex';
        leftSeamDistance.textContent = placement.fromSeam + '"';
        recommendedLogoSize.textContent = placement.maxWidth + '" × ' + placement.maxHeight + '"';
    }
}

// ========================================
// SHIRT CONTROLS
// ========================================
frontViewBtn.addEventListener('click', () => {
    state.shirtView = 'front';
    frontViewBtn.classList.add('active');
    backViewBtn.classList.remove('active');
    renderShirt();
});

backViewBtn.addEventListener('click', () => {
    state.shirtView = 'back';
    backViewBtn.classList.add('active');
    frontViewBtn.classList.remove('active');
    renderShirt();
});

shirtSizeSelect.addEventListener('change', (e) => {
    state.shirtSize = e.target.value;
    updatePrintSpecs();
    renderShirt();
});

shortSleeveBtn.addEventListener('click', () => {
    state.sleeveType = 'short';
    shortSleeveBtn.classList.add('active');
    longSleeveBtn.classList.remove('active');
    renderShirt();
});

longSleeveBtn.addEventListener('click', () => {
    state.sleeveType = 'long';
    longSleeveBtn.classList.add('active');
    shortSleeveBtn.classList.remove('active');
    renderShirt();
});

// ========================================
// LOGO UPLOAD
// ========================================
uploadBtn.addEventListener('click', () => logoUpload.click());

logoUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image file is too large. Please use an image under 10MB.');
            return;
        }
        
        showProcessing(true);
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageData = event.target.result;
            
            const img = new Image();
            img.onload = () => {
                state.logoImage = imageData;
                state.logoImageObj = img;
                emptyState.classList.add('hidden');
                downloadBtn.disabled = false;
                deleteBtn.style.display = 'block';
                logoAdjustments.style.display = 'block';
                liveSizeDisplay.style.display = 'block';
                specsPanel.style.display = 'block';
                showProcessing(false);
                renderShirt();
                updatePrintSpecs();
            };
            img.onerror = () => {
                showProcessing(false);
                alert('Failed to load image. Please try a different file.');
            };
            img.src = imageData;
        };
        reader.onerror = () => {
            showProcessing(false);
            alert('Failed to read file. Please try again.');
        };
        reader.readAsDataURL(file);
    }
});

// ========================================
// DELETE LOGO
// ========================================
function deleteLogo() {
    state.logoImage = null;
    state.logoImageObj = null;
    logoUpload.value = '';
    
    emptyState.classList.remove('hidden');
    downloadBtn.disabled = true;
    deleteBtn.style.display = 'none';
    logoAdjustments.style.display = 'none';
    liveSizeDisplay.style.display = 'none';
    specsPanel.style.display = 'none';
    
    renderShirt();
}

deleteBtn.addEventListener('click', deleteLogo);

// ========================================
// LOGO ADJUSTMENTS
// ========================================
logoSizeSlider.addEventListener('input', (e) => {
    state.logoScale = parseInt(e.target.value);
    sizeValue.textContent = state.logoScale + '%';
    renderShirt();
    updatePrintSpecs();
});

centerLogoBtn.addEventListener('click', () => {
    state.logoPlacement = 'center';
    centerLogoBtn.classList.add('active');
    leftChestBtn.classList.remove('active');
    
    state.logoPosition = { x: 50, y: 45 };
    state.logoScale = 40;
    logoSizeSlider.value = 40;
    sizeValue.textContent = '40%';
    
    renderShirt();
    updatePrintSpecs();
});

leftChestBtn.addEventListener('click', () => {
    state.logoPlacement = 'leftChest';
    leftChestBtn.classList.add('active');
    centerLogoBtn.classList.remove('active');
    
    state.logoPosition = { x: 25, y: 30 };
    state.logoScale = 20;
    logoSizeSlider.value = 20;
    sizeValue.textContent = '20%';
    
    renderShirt();
    updatePrintSpecs();
});

centerBtn.addEventListener('click', () => {
    if (state.logoPlacement === 'center') {
        state.logoPosition = { x: 50, y: 45 };
        state.logoScale = 40;
        logoSizeSlider.value = 40;
        sizeValue.textContent = '40%';
    } else {
        state.logoPosition = { x: 25, y: 30 };
        state.logoScale = 20;
        logoSizeSlider.value = 20;
        sizeValue.textContent = '20%';
    }
    renderShirt();
    updatePrintSpecs();
});

// ========================================
// DRAGGING
// ========================================
let dragStart = { x: 0, y: 0 };

shirtRenderCanvas.addEventListener('mousedown', (e) => {
    if (!state.logoImageObj) return;
    state.isDragging = true;
    shirtCanvas.classList.add('dragging');
    
    const rect = shirtRenderCanvas.getBoundingClientRect();
    const width = shirtRenderCanvas.width;
    const height = shirtRenderCanvas.height;
    
    const printAreaWidth = width * 0.55;
    const printAreaHeight = height * 0.45;
    
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * height;
    
    const printAreaX = width * 0.225;
    const printAreaY = height * 0.25;
    
    dragStart = {
        x: mouseX - printAreaX - (state.logoPosition.x / 100) * printAreaWidth,
        y: mouseY - printAreaY - (state.logoPosition.y / 100) * printAreaHeight
    };
    
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    
    const rect = shirtRenderCanvas.getBoundingClientRect();
    const width = shirtRenderCanvas.width;
    const height = shirtRenderCanvas.height;
    
    const printAreaWidth = width * 0.55;
    const printAreaHeight = width * 0.45;
    const printAreaX = width * 0.225;
    const printAreaY = height * 0.25;
    
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * height;
    
    const x = ((mouseX - printAreaX - dragStart.x) / printAreaWidth) * 100;
    const y = ((mouseY - printAreaY - dragStart.y) / printAreaHeight) * 100;
    
    state.logoPosition = {
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y))
    };
    
    renderShirt();
});

document.addEventListener('mouseup', () => {
    state.isDragging = false;
    shirtCanvas.classList.remove('dragging');
});

// ========================================
// DOWNLOAD
// ========================================
downloadBtn.addEventListener('click', () => {
    if (!state.logoImageObj) return;
    
    // Create high-res export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 2400;
    exportCanvas.height = 3000;
    const exportCtx = exportCanvas.getContext('2d');
    
    const scale = 2400 / 800;
    
    exportCtx.save();
    exportCtx.scale(scale, scale);
    
    // Create temp canvas with current design
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 800;
    tempCanvas.height = 1000;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.drawImage(shirtRenderCanvas, 0, 0);
    
    exportCtx.drawImage(tempCanvas, 0, 0);
    exportCtx.restore();
    
    // Download
    const link = document.createElement('a');
    link.download = `dirt-shirt-${state.shirtView}-${state.shirtSize}-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
});

// ========================================
// INITIALIZATION
// ========================================
console.log('Dirt Shirt Designer loaded successfully');
