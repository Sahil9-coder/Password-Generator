// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show privacy popup when the page loads
    document.getElementById('privacy-popup').style.display = 'flex';
    
    // Run adblock detection
    setTimeout(checkAdBlocker, 500);
    
    // Add event listeners
    document.getElementById('generateBtn').addEventListener('click', generatePassword);
    document.getElementById('refreshBtn').addEventListener('click', generatePassword);
    document.getElementById('copyBtn').addEventListener('click', copyPassword);
    document.getElementById('agreeBtn').addEventListener('click', function() {
        document.getElementById('privacy-popup').style.display = 'none';
    });
    
    // Generate a password on page load
    generatePassword();
});

/**
 * Enhanced Adblock detection
 * Uses multiple test elements with different ad-related class names
 */
function checkAdBlocker() {
    // Create multiple ad elements with different classes for better detection
    const testElements = [
        { class: 'adsbox', style: 'height: 1px; width: 1px; position: absolute; left: -10000px; top: -10000px;' },
        { class: 'adsbygoogle', style: 'height: 1px; width: 1px; position: absolute; left: -10000px; top: -9000px;' },
        { class: 'ad-placement', style: 'height: 1px; width: 1px; position: absolute; left: -10000px; top: -8000px;' }
    ];
    
    // Initialize detection flag
    let adBlockDetected = false;
    
    // Create and add all test elements
    testElements.forEach(function(element) {
        const adTest = document.createElement('div');
        adTest.className = element.class;
        adTest.style = element.style;
        adTest.innerHTML = '&nbsp;';
        document.body.appendChild(adTest);
        
        // If any test element is hidden (height=0), AdBlock is detected
        if (adTest.offsetHeight === 0) {
            adBlockDetected = true;
        }
    });
    
    // Clean up test elements
    document.querySelectorAll('.adsbox, .adsbygoogle, .ad-placement').forEach(function(el) {
        el.remove();
    });
    
    // Show popup if AdBlock is detected
    if (adBlockDetected) {
        document.getElementById('adblock-popup').style.display = 'flex';
    }
}

/**
 * Generates a secure password based on user preferences
 * Ensures exact length and character type requirements
 */
function generatePassword() {
    try {
        // Get user preferences
        const lengthInput = document.getElementById('length');
        let length = parseInt(lengthInput.value);
        
        // Validate length
        if (isNaN(length) || length < 8 || length > 20) {
            showNotification("Please enter a valid password length between 8 and 20.");
            lengthInput.value = 12;
            length = 12;
        }
        
        const useUppercase = document.getElementById('uppercase').checked;
        const useLowercase = document.getElementById('lowercase').checked;
        const useNumbers = document.getElementById('numbers').checked;
        const useSymbols = document.getElementById('symbols').checked;
        const customText = document.getElementById('customText').value.trim();

        // Ensure at least one character type is selected
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            showNotification("Please select at least one character type.");
            document.getElementById('lowercase').checked = true;
            return;
        }

        // Define character sets based on user selection
        let charset = '';
        if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (useNumbers) charset += '0123456789';
        if (useSymbols) charset += '@#$&_!%*()-+=[]{}|:;<>,.?/~^';

        // Calculate how many random characters we need
        let randomCharCount = length;
        let finalPassword = '';
        
        // If custom text is provided, adjust the random character count
        if (customText) {
            // Option 1: If custom text is longer than desired length, truncate it
            if (customText.length >= length) {
                finalPassword = customText.substring(0, length);
            } 
            // Option 2: Insert the custom text and fill the rest with random chars
            else {
                randomCharCount = length - customText.length;
                
                // Generate random characters
                let randomPart = '';
                for (let i = 0; i < randomCharCount; i++) {
                    randomPart += charset.charAt(Math.floor(Math.random() * charset.length));
                }
                
                // Randomly position the custom text within the password
                const insertPosition = Math.floor(Math.random() * (randomCharCount + 1));
                finalPassword = randomPart.substring(0, insertPosition) + 
                               customText + 
                               randomPart.substring(insertPosition);
            }
        } 
        // If no custom text, just generate random characters
        else {
            for (let i = 0; i < randomCharCount; i++) {
                finalPassword += charset.charAt(Math.floor(Math.random() * charset.length));
            }
        }

        // Ensure the password has exactly the requested length
        finalPassword = finalPassword.substring(0, length);
        
        // Ensure at least one character from each selected type is included
        finalPassword = ensureCharacterTypes(finalPassword, useUppercase, useLowercase, useNumbers, useSymbols, charset);
        
        // Display the password
        const passwordOutput = document.getElementById('passwordOutput');
        passwordOutput.textContent = finalPassword;
        
        // Add highlight animation
        passwordOutput.classList.add('highlight');
        setTimeout(() => {
            passwordOutput.classList.remove('highlight');
        }, 500);
        
    } catch (error) {
        console.error("Error generating password:", error);
        showNotification("An error occurred while generating the password. Please try again.");
    }
}

/**
 * Ensures the password contains at least one character from each selected type
 */
function ensureCharacterTypes(password, useUppercase, useLowercase, useNumbers, useSymbols, charset) {
    const types = [
        { use: useUppercase, regex: /[A-Z]/, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
        { use: useLowercase, regex: /[a-z]/, chars: 'abcdefghijklmnopqrstuvwxyz' },
        { use: useNumbers, regex: /[0-9]/, chars: '0123456789' },
        { use: useSymbols, regex: /[^A-Za-z0-9]/, chars: '@#$&_!%*()-+=[]{}|:;<>,.?/~^' }
    ];
    
    let finalPassword = password;
    
    // Check if each required type is present
    types.forEach((type, index) => {
        if (type.use && !type.regex.test(finalPassword)) {
            // Replace a random character with a character from the missing type
            const replaceIndex = Math.floor(Math.random() * finalPassword.length);
            const replacementChar = type.chars.charAt(Math.floor(Math.random() * type.chars.length));
            
            finalPassword = 
                finalPassword.substring(0, replaceIndex) + 
                replacementChar + 
                finalPassword.substring(replaceIndex + 1);
        }
    });
    
    return finalPassword;
}

/**
 * Copies the generated password to clipboard
 */
function copyPassword() {
    const passwordOutput = document.getElementById('passwordOutput');
    const password = passwordOutput.textContent;
    
    if (password && password !== 'Your password will appear here...') {
        try {
            navigator.clipboard.writeText(password).then(() => {
                showNotification("Password copied to clipboard!");
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showNotification("Failed to copy password. Please try again.");
            });
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = password;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                showNotification("Password copied to clipboard!");
            } catch (err) {
                showNotification("Failed to copy password. Please try again.");
            }
            
            document.body.removeChild(textArea);
        }
    }
}

/**
 * Shows a temporary notification
 */
function showNotification(message) {
    // Check if notification already exists
    let notification = document.getElementById('notification');
    
    if (!notification) {
        // Create notification element
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(notification);
    }
    
    // Update message and show
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add this style for password highlighting
document.head.insertAdjacentHTML('beforeend', `
<style>
.highlight {
    animation: highlight-pulse 0.5s ease;
}

@keyframes highlight-pulse {
    0% { background-color: #112d4e; }
    50% { background-color: #2a5298; }
    100% { background-color: #112d4e; }
}

#notification {
    opacity: 0;
}
</style>
`);

