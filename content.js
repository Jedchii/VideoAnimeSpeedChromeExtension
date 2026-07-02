let holdTimer;
let speedEnforcer; 
let isSpeedingUp = false;
let originalSpeeds = new Map();
let targetSpeed = 2.0; 
let isEnabled = true; // Added toggle state
const HOLD_DELAY = 300; 

// Get the saved speed AND toggle state
chrome.storage.sync.get({ targetSpeed: 2.0, isEnabled: true }, (data) => {
    targetSpeed = data.targetSpeed;
    isEnabled = data.isEnabled;
});

// Listen for updates from the popup menu
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.targetSpeed) targetSpeed = changes.targetSpeed.newValue;
    if (changes.isEnabled) isEnabled = changes.isEnabled.newValue;
});

document.addEventListener('keydown', (e) => {
    // NEW: If the extension is disabled via the toggle, stop here!
    if (!isEnabled || e.key !== 'Alt' || e.repeat) return;
    
    e.preventDefault();

    holdTimer = setTimeout(() => {
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            isSpeedingUp = true;
            
            videos.forEach(video => {
                originalSpeeds.set(video, video.playbackRate);
                video.playbackRate = targetSpeed;
            });

            speedEnforcer = setInterval(() => {
                videos.forEach(video => {
                    if (video.playbackRate !== targetSpeed) {
                        video.playbackRate = targetSpeed;
                    }
                });
            }, 50); 
        }
    }, HOLD_DELAY);
}, { capture: true });

document.addEventListener('keyup', (e) => {
    if (e.key !== 'Alt') return;
    
    clearTimeout(holdTimer);
    clearInterval(speedEnforcer); 

    if (isSpeedingUp) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            const normalSpeed = originalSpeeds.get(video) || 1.0;
            video.playbackRate = normalSpeed;
        });
        
        isSpeedingUp = false;
        originalSpeeds.clear();
    }
}, { capture: true });