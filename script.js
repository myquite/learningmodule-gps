// Course Configuration
const modules = [
    "courseInfo",
    "module1",
    "module2",
    "module3",
    "module4",
    "finalExam",
    "resultsContainer"
];

// Module answers
const moduleAnswers = {
    m1q1: "b",
    m1q2: "b",
    m2q1: "b",
    m2q2: "c",
    m3q1: "b",
    m3q2: "a",
    m4q1: "b",
    m4q2: "b"
};

// Exam answers
const examAnswers = {
    exam1: "b",
    exam2: "b",
    exam3: "b",
    exam4: "a",
    exam5: "a",
    exam6: "b",
    exam7: "a",
    exam8: "b"
};

// Current module index
let currentModuleIndex = 0;

// Track module completion
const moduleCompletion = {
    module1: false,
    module2: false,
    module3: false,
    module4: false
};

// Track exam completion
let examPassed = false;

// DOM elements
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

// Initialize the course
function initCourse() {
    // Show first module
    document.getElementById(modules[currentModuleIndex]).classList.add("active");
    updateNavButtons();
    updateProgress();
    
    // Add event listeners to navigation buttons
    prevBtn.addEventListener("click", prevModule);
    nextBtn.addEventListener("click", nextModule);
    
    // Add event listener to restart button
    document.getElementById("restartCourse").addEventListener("click", restartCourse);
    
    // Add event listeners to all quiz questions
    setupQuizListeners();
}

// Setup quiz listeners
function setupQuizListeners() {
    // Module quizzes
    for (const questionId in moduleAnswers) {
        const options = document.getElementsByName(questionId);
        options.forEach(option => {
            option.addEventListener("change", function() {
                checkModuleAnswer(questionId, this.value);
                // Convert m1 to module1, m2 to module2, etc.
                const moduleNumber = questionId.charAt(1);
                const moduleId = `module${moduleNumber}`;
                checkModuleCompletion(moduleId);
            });
        });
    }

    // Exam questions
    for (const questionId in examAnswers) {
        const options = document.getElementsByName(questionId);
        options.forEach(option => {
            option.addEventListener("change", function() {
                checkExamAnswer(questionId, this.value);
                checkExamCompletion();
            });
        });
    }
}

// Check module answers
function checkModuleAnswer(questionId, userAnswer) {
    const feedbackElement = document.getElementById(`${questionId}Feedback`);
    const correctAnswer = moduleAnswers[questionId];
    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.className = "feedback correct";
    } else {
        feedbackElement.textContent = "Incorrect. Please try again.";
        feedbackElement.className = "feedback incorrect";
    }
}

// Check exam answers
function checkExamAnswer(questionId, userAnswer) {
    const feedbackElement = document.getElementById(`${questionId}Feedback`);
    const correctAnswer = examAnswers[questionId];
    
    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.className = "feedback correct";
    } else {
        feedbackElement.textContent = "Incorrect. Please try again.";
        feedbackElement.className = "feedback incorrect";
    }
    
    checkExamCompletion();
}

// Check if all questions in a module are answered correctly
function checkModuleCompletion(moduleId) {
    // Convert module1 to m1, module2 to m2, etc.
    const moduleNumber = moduleId.replace('module', '');
    const modulePrefix = `m${moduleNumber}`;
    
    const moduleQuestions = Object.keys(moduleAnswers).filter(q => q.startsWith(modulePrefix));
    const allCorrect = moduleQuestions.every(questionId => {
        const selectedAnswer = document.querySelector(`input[name="${questionId}"]:checked`);
        return selectedAnswer && selectedAnswer.value === moduleAnswers[questionId];
    });
    
    moduleCompletion[moduleId] = allCorrect;
    updateNavButtons();
}

// Check exam completion
function checkExamCompletion() {
    let score = 0;
    let totalQuestions = Object.keys(examAnswers).length;
    let allQuestionsAnswered = true;
    
    for (const questionId in examAnswers) {
        const selectedAnswer = document.querySelector(`input[name="${questionId}"]:checked`);
        if (selectedAnswer) {
            if (selectedAnswer.value === examAnswers[questionId]) {
                score++;
            }
        } else {
            allQuestionsAnswered = false;
        }
    }
    
    const percentage = (score / totalQuestions) * 100;
    examPassed = percentage >= 70 && allQuestionsAnswered;
    
    // Update score display
    const scoreElement = document.getElementById("examScore");
    if (scoreElement) {
        scoreElement.textContent = `${percentage}%`;
        if (percentage >= 70) {
            scoreElement.style.color = "var(--success)";
        } else {
            scoreElement.style.color = "var(--error)";
        }
    }
    
    updateNavButtons();
}

// Update navigation buttons
function updateNavButtons() {
    // Handle Previous button
    prevBtn.disabled = currentModuleIndex === 0;
    
    // Handle Next button
    if (currentModuleIndex === 0) {
        // Course info module - always enable Next
        nextBtn.disabled = false;
        nextBtn.textContent = "Next";
    } else if (currentModuleIndex > 0 && currentModuleIndex < modules.length - 2) {
        // Regular modules - check completion
        const currentModule = modules[currentModuleIndex];
        nextBtn.disabled = !moduleCompletion[currentModule];
        nextBtn.textContent = "Next";
    } else if (currentModuleIndex === modules.length - 2) {
        // Final exam - check if passed
        nextBtn.disabled = !examPassed;
        nextBtn.textContent = "Submit";
    } else {
        // Results page
        nextBtn.disabled = true;
        nextBtn.textContent = "Next";
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentModuleIndex + 1) / modules.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Navigate to previous module
function prevModule() {
    if (currentModuleIndex > 0) {
        document.getElementById(modules[currentModuleIndex]).classList.remove("active");
        currentModuleIndex--;
        document.getElementById(modules[currentModuleIndex]).classList.add("active");
        updateNavButtons();
        updateProgress();
    }
}

// Navigate to next module
function nextModule() {
    if (currentModuleIndex < modules.length - 1) {
        // Check if current module is completed (except for course info and results)
        if (currentModuleIndex > 0 && currentModuleIndex < modules.length - 2) {
            const currentModule = modules[currentModuleIndex];
            if (!moduleCompletion[currentModule]) {
                alert("Please answer all questions correctly before proceeding.");
                return;
            }
        }
        
        // Check if exam is passed
        if (currentModuleIndex === modules.length - 2 && !examPassed) {
            alert("Please achieve a score of 70% or higher and correct all questions before proceeding.");
            return;
        }
        
        document.getElementById(modules[currentModuleIndex]).classList.remove("active");
        currentModuleIndex++;
        document.getElementById(modules[currentModuleIndex]).classList.add("active");
        updateNavButtons();
        updateProgress();
        
        // Scroll to the top of the current module
        const currentModule = document.getElementById(modules[currentModuleIndex]);
        if (currentModule) {
            currentModule.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Restart the course
function restartCourse() {
    // Reset module index
    currentModuleIndex = 0;
    
    // Hide all modules and show the first one
    modules.forEach(moduleId => {
        const element = document.getElementById(moduleId);
        if (element) {
            element.classList.remove("active");
        }
    });
    
    // Show the first module (course info)
    const firstModule = document.getElementById(modules[0]);
    if (firstModule) {
        firstModule.classList.add("active");
    }
    
    // Reset module completion
    Object.keys(moduleCompletion).forEach(key => {
        moduleCompletion[key] = false;
    });
    
    // Reset exam completion
    examPassed = false;
    
    // Reset all quiz answers
    const allInputs = document.querySelectorAll('input[type="radio"]');
    allInputs.forEach(input => {
        input.checked = false;
    });
    
    // Clear all feedback
    const allFeedback = document.querySelectorAll('.feedback');
    allFeedback.forEach(feedback => {
        feedback.textContent = "";
        feedback.className = "feedback";
    });
    
    // Reset exam score display
    const examScore = document.getElementById("examScore");
    if (examScore) {
        examScore.textContent = "0%";
        examScore.style.color = "var(--error)";
    }
    
    // Reset final score display
    const finalScore = document.getElementById("finalScore");
    if (finalScore) {
        finalScore.textContent = "";
    }
    
    // Reset navigation buttons
    if (prevBtn) {
        prevBtn.disabled = true;
    }
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.textContent = "Next";
    }
    
    // Set progress bar to first step (1/7 ≈ 14.3%)
    if (progressBar) {
        progressBar.style.width = "14.3%";
        // Force a reflow to ensure the progress bar updates
        progressBar.offsetHeight;
    }
    
    // Force a reflow to ensure the UI updates
    document.body.offsetHeight;
}

// Initialize the course when the DOM is loaded
document.addEventListener("DOMContentLoaded", initCourse); 