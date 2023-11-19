const guessedLettersElement = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

let word = "magnolia"; // Default word if request is unsuccessful
let guessedLetters = [];
let remainingGuesses = 8; 

//  Choose a random word
const getWord = async function () {
  const response = await fetch("https://patwe.ch/endinna/words.txt");
  if (!response.ok) {
    // If we can't fetch the file for some reason, use default word
    placeholder(word);
    console.log("Response failed - using default word");
  } else {
    // go the desired response
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    if (word.length > 10) {
      getWord();
    } else {
      placeholder(word);
    }
  }
};

// Display our symbols as placeholders for the chosen word's letters
const placeholder = function (word) {
  // Focus on letter input
  letterInput.focus();
  const placeholderLetters = [];
  for (const letter of word) {
    console.log(letter);
    placeholderLetters.push("☀️");
  }
  wordInProgress.innerText = placeholderLetters.join("");
};

// Fire off the game
getWord();

guessLetterButton.addEventListener("click", function (e) {
  e.preventDefault();
  // Focus on letter input
  letterInput.focus();
  // Empty message paragraph
  message.innerText = "";
  // Let's grab what was entered in the input
  const guess = letterInput.value;
  // Let's make sure that it is a single letter
  const goodGuess = validateInput(guess);

  if (goodGuess) {
    // We've got a letter, let's guess!
    makeGuess(guess);
  }
  letterInput.value = "";
});

const validateInput = function (input) {
  const acceptedLetter = /[a-zA-Z,â,Â,ô,Ô,é,É,è,È,ê,Ê]/;
  if (input.length === 0) {
    // Is the input empty?
    message.innerText = "Tapa una lètra.";
  } else if (input.length > 1) {
    // Did you type more than one letter?
    message.innerText = "S'o-vos-plêt tapa ren que UNA lètra.";
  } else if (!input.match(acceptedLetter)) {
    // Did you type a number, a special character or some other non letter thing?
    message.innerText = "S'o-vos-plêt tapa una lètra de A tant que Z.";
  } else {
    // We finally got a single letter, omg yay
    return input;
  }
};

const makeGuess = function (guess) {
  guess = guess.toUpperCase();
  if (guessedLetters.includes(guess)) {
    message.innerText = "T'as ja tróvâ ceta lètra, tapou que t'és. Èprove un'ôtra!";
  } else {
    guessedLetters.push(guess);
    updateGuessesRemaining(guess);
    // Show user what they already guessed
    showGuessedLetters();
    // New letter guessed - let's see if we're right
    updateWordInProgress(guessedLetters);
  }
};

const showGuessedLetters = function () {
  // Clear the list first
  guessedLettersElement.innerHTML = "";

  for (const letter of guessedLetters) {
    const li = document.createElement("li");
    li.innerText = letter;
    guessedLettersElement.append(li);
  }
};

const updateWordInProgress = function (guessedLetters) {
  const wordUpper = word.toUpperCase();
  const wordArray = wordUpper.split("");
  const revealWord = [];
  for (const letter of wordArray) {
    if (guessedLetters.includes(letter)) {
      revealWord.push(letter.toUpperCase());
    } else {
      revealWord.push("☀️");
    }
  }
  // console.log(revealWord);
  wordInProgress.innerText = revealWord.join("");
  checkIfWin();
};

const updateGuessesRemaining = function (guess) {
  const upperWord = word.toUpperCase();
  if (!upperWord.includes(guess)) {
    // womp womp - bad guess, lose a chance
    message.innerText = `Dèsola/Délosa, li/lo mot 'la pas de ${guess}.`;
    remainingGuesses -= 1;
  } else {
    message.innerText = `T'as fèru! Li/Lo mot 'l at la lètra ${guess}.`;
  }

  if (remainingGuesses === 0) {
    message.innerHTML = `FIN DU JUÈ. Li/Lo mot ére <span class="highlight">${word}</span>.`;
    startOver();
  } else if (remainingGuesses === 1) {
    remainingGuessesSpan.innerText = `${remainingGuesses} viâjo`;
  } else {
    remainingGuessesSpan.innerText = `${remainingGuesses} viâjos`;
  }
};


const checkIfWin = function () {
  if (word.toUpperCase() === wordInProgress.innerText) {
    message.classList.add("win");
    message.innerHTML = `<p class="highlight">T'as endevinâ lo bon mot! Fèlicitacions!</p>`;
    startOver();
  }
};

const startOver = function () {
  // Show play again button and shift focus there - hide guess button and letters
  letterInput.blur();
  guessLetterButton.classList.add("hide");
  remainingGuessesElement.classList.add("hide");
  guessedLettersElement.classList.add("hide");
  playAgainButton.classList.remove("hide");
  playAgainButton.focus();
};

playAgainButton.addEventListener("click", function () {
  // reset all original values - grab new word
  message.classList.remove("win");
  guessedLetters = [];
  remainingGuesses = 8;
  remainingGuessesSpan.innerText = `${remainingGuesses} viâjos`;
  guessedLettersElement.innerHTML = "";
  message.innerText = "";
  getWord();
  // show the right UI elements
  guessLetterButton.classList.remove("hide");
  playAgainButton.classList.add("hide");
  remainingGuessesElement.classList.remove("hide");
  guessedLettersElement.classList.remove("hide");
});
