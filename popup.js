const speedInput = document.getElementById('speed');
const enableToggle = document.getElementById('enableToggle');

// Load saved settings (Default: 2.0x speed, Enabled: true)
chrome.storage.sync.get({ targetSpeed: 2.0, isEnabled: true }, (data) => {
    speedInput.value = data.targetSpeed;
    enableToggle.checked = data.isEnabled;
});

// Save speed when changed
speedInput.addEventListener('change', () => {
    let newSpeed = parseFloat(speedInput.value);
    if (newSpeed < 0.1) newSpeed = 0.1; 
    chrome.storage.sync.set({ targetSpeed: newSpeed });
});

// Save toggle state when clicked
enableToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ isEnabled: enableToggle.checked });
});