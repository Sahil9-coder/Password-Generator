/**
 * Ultimate Password Generator
 * Advanced Configuration File
 * 
 * This optional file allows for more advanced customization.
 * To use: Add a script tag for this file before the main script.js
 */

// Password Generator Configuration
const PASSWORD_CONFIG = {
    // Minimum and maximum password length limits
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
    DEFAULT_LENGTH: 12,
    
    // Character sets
    CHAR_SETS: {
        UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
        NUMBERS: '0123456789',
        SYMBOLS: '@#$&_!%*()-+=[]{}|:;<>,.?/~^'
    },
    
    // Default selections
    DEFAULTS: {
        INCLUDE_UPPERCASE: true,
        INCLUDE_LOWERCASE: true,
        INCLUDE_NUMBERS: true,
        INCLUDE_SYMBOLS: true
    },
    
    // Encryption strength assessment
    STRENGTH_LEVELS: [
        { min: 0, max: 7, level: 'Very Weak', color: '#e74c3c' },
        { min: 8, max
