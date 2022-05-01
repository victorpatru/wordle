import { WORDS } from './words.js'

// Set global variables that we are going to modifying as we play the game
    // Placeholder value for the maximum number of guesses given to a user
    const NUMBER_OF_GUESSES = 6
    let guessesRemaining = NUMBER_OF_GUESSES
    // Place to store the variables
    let currentGuess = []
    // The current letter we are looping over
    let nextLetter = 0
    // Picking our correct wordle guess randomly from the array in our words.js file
    let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]


// Create a 5 (length) by 6 (width) letter board
function initBoard() {
    // Store the HTML element with the id of game-board inside the variable board
    let board = document.getElementById('game-board')

    // Loop through the number of guesses given to a user
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        // Create each row of the wordle board
        let row = document.createElement('div')
        row.className = 'letter-row'

        // For every new row create five letter boxes matching one user guess.
        for (let j = 0; j < 5; j++) {
            let box = document.createElement('div')
            box.className = 'letter-box'
            row.appendChild(box)
        }

        // Each iteration append the full row (1 by 5) to the existing board. 
        board.appendChild(row)

    }
}

// Initialize the board
initBoard()

// Event listener that ensures the user's input is valid and runs the necessary functions based on his actions
document.addEventListener('keyup', event => {
    // Stop the function if the user has no more guesses left
    if (guessesRemaining === 0) {
        return
    }

    // Store the key pressed
    let pressedKey = String(event.key)

    // If the key pressed is backspace and the user has at least 1 box filled, run the deleterLetter() function and return
    if (pressedKey === 'Backspace' && nextLetter !== 0) {
        deleteLetter()
        return
    }

    // If the key pressed is enter run the function checkGuess() to see if the word guesses matches the right word; return the function
    if (pressedKey === 'Enter') {
        checkGuess()
        return
    }

    // Store the key that matches any one of the letters in the alphabet (from a to z)
    let found = pressedKey.match(/[a-z]/gi)

    // If our letter is in the alphabet and it isn't a word, run the insertLetter() function
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

// Adding letters to the board
function insertLetter(pressedKey) {
    // Stop the function if the user has no more letters he can add to the board
    if (nextLetter === 5) {
        return
    }

    // Preventive input check
    pressedKey = pressedKey.toLowerCase()

    // Store the row that coincides with our guess
    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
    
    // Store the next empty box on our current row
    // For example, if we are on the first row, and we haven't types anything yet, box will return the first box of the first row
    let box = row.children[nextLetter]

    // Add to the current (empty) box the letter of the pressed key plus the class of 'filled-box' for a visual contrast
    box.textContent = pressedKey
    box.classList.add('filled-box')

    // Push to the global variables the current key pressed and increment the nextLetter variable (to keep track of our our filled words)
    currentGuess.push(pressedKey)
    nextLetter += 1
}

// Deleting letters from the board

function deleteLetter() {
    // Get the current row
    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
    // Get the box that has already been filled
    let box = row.children[nextLetter - 1]

    // Remove the letter, its distinct styling and the letter stored in the global variable
    box.textContent = ''
    box.classList.remove('filled-box')
    currentGuess.pop()

    // Increment backwards to account for the removal
    nextLetter -= 1

}

function checkGuess() {
    // Get current row
    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]

    // String of the words guessed by the user
    let guessString = ''

    // Store the right guess in an array broken down letter by letter
    // eg. if the right word is 'place' the rightGuess will hold ['p','l','a','c','e']
    let rightGuess = Array.from(rightGuessString)

    // Take the user guess and store it a string format
    for (const val of currentGuess) {
        guessString += val
    }

    // Make sure that the user has inputted all five letters 
    if (guessString.length != 5) {
        alert('Not enough letters!')
        return
    }

    // Make sure that the user's word is in our list of accepted words
    if (!WORDS.includes(guessString)) {
        alert('Word not in list!')
        return
    }

    // After having passed preliminary checks loop through the entire row

    for (let i = 0; i < 5; i++) {
        // Empty variable to enable us to dynamically generate the color of our box
        let letterColor = ''
        // Get the box and the user's guess that matches our current loop
        let box = row.children[i]
        let letter = currentGuess[i]

        // Check if the current guess made by the user matches the right guess word
        // If it matches we will get an index value (from 0 to n) otherwise we will get -1 returned
        let letterPosition = rightGuess.indexOf(currentGuess[i])

        // Logic for our box color.
        // Grey => guessed letter does not exist in the correct word
        // Green => guessed letter is in the same place in the correct word
        // Yellow => guessed letter is in a different place in the correct word 
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'yellow'
            }
            rightGuess[letterPosition] = '#'

        }


        // Change the color of the boxes (using a small delay)
    let delay = 250 * i
    setTimeout(() => {
        box.style.backgroundColor = letterColor
        shadeKeyBoard(letter, letterBoard)
    }, delay)
    }


    

    // Feedback for the user based on his guess
    // Game stops if you have guessed the string
    // After each failed attempt we reset global variables and increment the guesses remaining down by one
    // Once the user runs out of guesses, inform them and provide the correct answer
    if (guessString === rightGuessString) {
        alert('You have guessed right! Game over!')
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1
        currentGuess = []
        nextLetter = 0

        if (guessesRemaining === 0) {
            alert(`You've run out of guesses! Game over!`)
            alert(`The right word was: ${rightGuessString}`)
        }
    }
}


// Function that after shades the keyboard provided to the user to match the wordle colors in the wordle guesses
function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName('keyboard-button')) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            }

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

// Make sure the keyboard we provide to our users is functional and accessible by the rest of the program
document.getElementById('keyboard-cont').addEventListener('click', event => {
    const target = event.target

    // Make sure that the only valid input we get is from clicks on the virtual keyboard 
    if (!target.classList.contains('keyboard-button')) {
        return
    }

    let key = target.textContent

    if (key === 'Del') {
        key = 'Backspace'
    }

    // Ensures our virtual keyboard has the same functionality as the physical one
    document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}))
})