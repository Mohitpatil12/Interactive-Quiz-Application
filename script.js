const quizData = [
    {
        question: "What is JavaScript primarily used for?",
        options: [
            "Server-side scripting only",
            "Creating interactive web pages",
            "Database management",
            "Hardware programming"
        ],
        correctAnswer: 1,
        explanation: "JavaScript is primarily used for creating interactive elements on web pages, allowing dynamic content updates without page reloads."
    },
    {
        question: "Which of the following is NOT a JavaScript data type?",
        options: [
            "String",
            "Boolean",
            "Integer",
            "Undefined"
        ],
        correctAnswer: 2,
        explanation: "JavaScript does not have a specific 'Integer' type. Number is used for both integers and floating-point values."
    },
    {
        question: "What does DOM stand for in web development?",
        options: [
            "Document Object Model",
            "Data Object Management",
            "Digital Ordinance Model",
            "Document Orientation Module"
        ],
        correctAnswer: 0,
        explanation: "DOM stands for Document Object Model, which is a programming interface for web documents that represents the page structure."
    },
    {
        question: "Which method is used to add an element at the end of an array in JavaScript?",
        options: [
            "append()",
            "push()",
            "insert()",
            "addToEnd()"
        ],
        correctAnswer: 1,
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array."
    },
    {
        question: "What is the purpose of the 'async' keyword in JavaScript?",
        options: [
            "To define a synchronous function",
            "To prevent function execution",
            "To define an asynchronous function that returns a Promise",
            "To make loops run faster"
        ],
        correctAnswer: 2,
        explanation: "The 'async' keyword is used to define an asynchronous function that implicitly returns a Promise, allowing the use of 'await' inside the function."
    },
    {
        question: "Which of these is NOT a JavaScript framework or library?",
        options: [
            "React",
            "Angular",
            "Django",
            "Vue"
        ],
        correctAnswer: 2,
        explanation: "Django is a Python web framework, not a JavaScript framework. React, Angular, and Vue are all JavaScript frameworks/libraries."
    },
    {
        question: "How do you declare a constant variable in JavaScript?",
        options: [
            "var x = 10;",
            "constant x = 10;",
            "let x = 10;",
            "const x = 10;"
        ],
        correctAnswer: 3,
        explanation: "In JavaScript, you use the 'const' keyword to declare a constant variable whose value cannot be reassigned."
    },
    {
        question: "What is the output of '2' + 2 in JavaScript?",
        options: [
            "4",
            "22",
            "Error",
            "undefined"
        ],
        correctAnswer: 1,
        explanation: "In JavaScript, when you use the + operator with a string and a number, the number is converted to a string and concatenated."
    },
    {
        question: "What is event bubbling in JavaScript?",
        options: [
            "A method to create new events",
            "A process where events propagate from child to parent elements",
            "A way to prevent events from firing",
            "A special type of event for animations"
        ],
        correctAnswer: 1,
        explanation: "Event bubbling is the process where an event triggered on a nested element 'bubbles up' through its ancestor elements in the DOM hierarchy."
    },
    {
        question: "Which method is used to remove the last element from an array in JavaScript?",
        options: [
            "pop()",
            "remove()",
            "deleteLast()",
            "shift()"
        ],
        correctAnswer: 0,
        explanation: "The pop() method removes the last element from an array and returns that element."
    }
];

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let startTime;
let selectedOption = null;
let answered = false;

// DOM elements
const loadingElement = document.getElementById('loading');
const quizContentElement = document.getElementById('quiz-content');
const resultsElement = document.getElementById('results');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const feedbackElement = document.getElementById('feedback');
const feedbackTextElement = document.getElementById('feedback-text');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const scoreElement = document.getElementById('score');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const finalScoreElement = document.getElementById('final-score');
const correctAnswersElement = document.getElementById('correct-answers');
const incorrectAnswersElement = document.getElementById('incorrect-answers');
const completionTimeElement = document.getElementById('completion-time');
const resultsMessageElement = document.getElementById('results-message');

// Initialize the quiz
function initQuiz() {
    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = Array(quizData.length).fill(null);
    startTime = new Date();
    
    // Update UI
    totalQuestionsElement.textContent = quizData.length;
    
    // Simulate loading data
    setTimeout(() => {
        loadingElement.style.display = 'none';
        quizContentElement.style.display = 'block';
        displayQuestion();
    }, 1000);
}

// Display current question
function displayQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    
    // Reset state for new question display
    selectedOption = userAnswers[currentQuestionIndex];
    answered = selectedOption !== null;
    
    // Update question number
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    
    // Display question text
    questionElement.textContent = currentQuestion.question;
    
    // Clear previous options and generate new ones
    optionsElement.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-btn';
        
        // Create option label (A, B, C, D)
        const optionIcon = document.createElement('span');
        optionIcon.className = 'option-icon';
        optionIcon.textContent = String.fromCharCode(65 + index);
        
        optionButton.appendChild(optionIcon);
        optionButton.appendChild(document.createTextNode(option));
        
        // Add event listener
        optionButton.addEventListener('click', () => selectOption(index));
        
        // Apply styling if this question was previously answered
        if (selectedOption === index) {
            optionButton.classList.add('selected');
            
            if (answered) {
                if (index === currentQuestion.correctAnswer) {
                    optionButton.classList.add('correct');
                } else {
                    optionButton.classList.add('incorrect');
                }
            }
        } else if (answered && index === currentQuestion.correctAnswer) {
            optionButton.classList.add('correct');
        }
        
        optionsElement.appendChild(optionButton);
    });
    
    // Show/hide feedback based on whether question was answered
    if (answered) {
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        showFeedback(isCorrect, currentQuestion.explanation);
    } else {
        hideFeedback();
    }
    
    // Update navigation buttons
    updateNavButtons();
}

// Select an option
function selectOption(optionIndex) {
    // Prevent selecting after answering
    if (answered) return;
    
    const currentQuestion = quizData[currentQuestionIndex];
    selectedOption = optionIndex;
    answered = true;
    
    // Store the user's answer
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // Check if answer is correct and update score
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
        score++;
        scoreElement.textContent = score;
    }
    
    // Update option styling
    const optionButtons = optionsElement.querySelectorAll('.option-btn');
    optionButtons.forEach((button, index) => {
        if (index === optionIndex) {
            button.classList.add('selected');
            button.classList.add(isCorrect ? 'correct' : 'incorrect');
        } else if (index === currentQuestion.correctAnswer) {
            button.classList.add('correct');
        }
    });
    
    // Show feedback
    showFeedback(isCorrect, currentQuestion.explanation);
    
    // Enable next button
    nextButton.classList.remove('btn-disabled');
}

// Show feedback after answering
function showFeedback(isCorrect, explanation) {
    feedbackElement.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
    feedbackElement.querySelector('h3').textContent = isCorrect ? 'Correct!' : 'Incorrect';
    feedbackTextElement.textContent = explanation;
}

// Hide feedback
function hideFeedback() {
    feedbackElement.classList.remove('correct', 'incorrect');
    feedbackElement.style.display = 'none';
}

// Update navigation buttons
function updateNavButtons() {
    // Previous button
    if (currentQuestionIndex === 0) {
        prevButton.classList.add('btn-disabled');
    } else {
        prevButton.classList.remove('btn-disabled');
    }
    
    // Next button
    if (!answered) {
        nextButton.classList.add('btn-disabled');
    } else {
        nextButton.classList.remove('btn-disabled');
    }
    
    // Change next button text on last question
    if (currentQuestionIndex === quizData.length - 1) {
        nextButton.textContent = 'Finish Quiz';
    } else {
        nextButton.textContent = 'Next';
    }
}

// Navigate to previous question
function goToPrevious() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Navigate to next question or finish quiz
function goToNext() {
    if (!answered) return;
    
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        finishQuiz();
    }
}

// Finish the quiz and show results
function finishQuiz() {
    const endTime = new Date();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // in seconds
    
    // Format time as minutes:seconds
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Calculate score percentage
    const scorePercentage = Math.round((score / quizData.length) * 100);
    
    // Update results UI
    finalScoreElement.textContent = `${scorePercentage}%`;
    correctAnswersElement.textContent = score;
    incorrectAnswersElement.textContent = quizData.length - score;
    completionTimeElement.textContent = formattedTime;
    
    // Set appropriate message based on score
    if (scorePercentage >= 80) {
        resultsMessageElement.textContent = 'Excellent! You have a strong understanding of the subject.';
    } else if (scorePercentage >= 60) {
        resultsMessageElement.textContent = 'Good job! You have a solid grasp of most concepts.';
    } else if (scorePercentage >= 40) {
        resultsMessageElement.textContent = 'Not bad, but there room for improvement. Keep learning!';
    } else {
        resultsMessageElement.textContent = 'You might want to review the material and try again.';
    }
    
    // Hide quiz and show results
    quizContentElement.style.display = 'none';
    resultsElement.style.display = 'block';
}

// Restart the quiz
function restartQuiz() {
    resultsElement.style.display = 'none';
    loadingElement.style.display = 'flex';
    initQuiz();
}

// Event listeners
prevButton.addEventListener('click', goToPrevious);
nextButton.addEventListener('click', goToNext);
restartButton.addEventListener('click', restartQuiz);

// Start the quiz
initQuiz();
