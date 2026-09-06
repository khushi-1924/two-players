// =====================================================
// VALIDATE SECRET NUMBER
// =====================================================

const validateSecretNumber = (number, digitLength) => {

    if (typeof number !== "string") {
        return {
            valid: false,
            message: "Number must be a string"
        };
    }

    // Only digits
    if (!/^\d+$/.test(number)) {
        return {
            valid: false,
            message: "Number can contain digits only"
        };
    }

    // Correct length
    if (number.length !== digitLength) {
        return {
            valid: false,
            message: `Number must contain exactly ${digitLength} digits`
        };
    }

    // First digit cannot be zero
    if (number[0] === "0") {
        return {
            valid: false,
            message: "Number cannot start with 0"
        };
    }

    // No repeated digits
    const uniqueDigits = new Set(number);

    if (uniqueDigits.size !== digitLength) {
        return {
            valid: false,
            message: "Digits cannot repeat"
        };
    }

    return {
        valid: true
    };
};


// =====================================================
// VALIDATE GUESS
// =====================================================

const validateGuess = (guess, digitLength) => {

    if (typeof guess !== "string") {
        return {
            valid: false,
            message: "Guess must be a string"
        };
    }

    // Only digits
    if (!/^\d+$/.test(guess)) {
        return {
            valid: false,
            message: "Guess can contain digits only"
        };
    }

    // Correct length
    if (guess.length !== digitLength) {
        return {
            valid: false,
            message: `Guess must contain exactly ${digitLength} digits`
        };
    }

    // First digit cannot be zero
    if (guess[0] === "0") {
        return {
            valid: false,
            message: "Guess cannot start with 0"
        };
    }

    // No repeated digits
    const uniqueDigits = new Set(guess);

    if (uniqueDigits.size !== digitLength) {
        return {
            valid: false,
            message: "Digits cannot repeat"
        };
    }

    return {
        valid: true
    };
};


// =====================================================
// CALCULATE GUESS RESULT
// =====================================================

const calculateGuessResult = (
    secretNumber,
    guess
) => {

    let correctPositions = 0;
    let correctDigits = 0;


    // ---------------------------------------------
    // CORRECT POSITIONS
    // ---------------------------------------------

    for (let i = 0; i < secretNumber.length; i++) {

        if (secretNumber[i] === guess[i]) {
            correctPositions++;
        }

    }


    // ---------------------------------------------
    // CORRECT DIGITS
    // ---------------------------------------------

    for (const digit of guess) {

        if (secretNumber.includes(digit)) {
            correctDigits++;
        }

    }


    return {
        correctDigits,
        correctPositions
    };

};


export {
    validateSecretNumber,
    validateGuess,
    calculateGuessResult
};