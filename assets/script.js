const startBtn = document.getElementById('start-btn')
const nextBtn = document.getElementById('next-btn')
const submitBtn = document.getElementById('submit-btn')
const questionContainerEL = document.getElementById('question-container')
const questionsEl = document.getElementById('question')
const answerBtnsEL = document.getElementById('answer-buttons')
const timeLeftEl = document.getElementById('time') 
const highscoreEl = document.getElementById('highscores')
const startEl = document.getElementById('start-screen')  
const initialsEl = document.querySelector("#initials");

// starting time, made this way to suit if i add more question later
var time = questions.length * 15;
var timeStop;

let shuffledQuestions, currentQuestionIndex

// add listener to start the game
startBtn.addEventListener('click', startGame)
// add listener to go to next question
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++
    // run next question fuction    
    setNextQuestion()
})

function startGame() {
    // run the timer function once start game button has been pressed
    timer()
    // hide unnecessary containers
    startBtn.classList.add('hide')
    highscoreEl.classList.add('hide')
    startEl.classList.add('hide')
    // shuffle question so you dont get the same one everytime
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerEL.classList.remove('hide')
    // run next question fuction
    setNextQuestion()
}

function setNextQuestion() {
    // run resetState function
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    // grab question from question list
    questionsEl.innerText = question.question
    question.answers.forEach(answer => {
    const button = document.createElement('button')
    // replace the text on the answers buttons to match the answer to the questions
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
        button.dataset.correct = answer.correct
    }
        button.addEventListener('click', selectAnswer)
        answerBtnsEL.appendChild(button)
    })
}

// timer
function timer() {

    var Timer = setInterval(function(){
    // change time till timeleft is equal to or less than zero
    if(time <= 0){
        clearInterval(Timer);
        timeLeftEl.innerHTML = "Your ran out of time";
    } else {
        timeLeftEl.innerHTML = time;
    } 
    // take one every second      
    time -= 1;
    }, 1000);

}

function resetState() {
    // clear the body of the page
    clearStatusClass(document.body)
    nextBtn.classList.add('hide')
    while (answerBtnsEL.firstChild) {
        answerBtnsEL.removeChild(answerBtnsEL.firstChild)
    }
}

function selectAnswer(event) {
    // add new Constants for this function
    const selectedBtn = event.target
    const correct = selectedBtn.dataset.correct
    // set class to correct
    setStatusClass(document.body, correct)
    // start array for answers
    Array.from(answerBtnsEL.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    if (!correct) {
        // penalize time if you get the wrong answer
        time -= 15;        
    }

    currentQuestionIndex++;
    
    // not sure why this wont work
    if (shuffledQuestions.length === currentQuestionIndex) {
        gameOverEl()
    } else {
        setNextQuestion()
    }    

}

function setStatusClass(element, correct) {
    // set status class as per answer
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    // clear status class so it can be reset as per next question    
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

function gameOverEl() {
    // stop timer
    clearInterval(timeStop);
  
    // show end screen
    var endScreenEl = document.getElementById("game-over-screen");
    endScreenEl.removeAttribute("class");
  
    // show final score
    var finalScoreEl = document.getElementById("final-score");
    finalScoreEl.textContent = time;
  
    // hide questions section
    questionContainerEL.classList.add("hide");
}

function outOfTime() {
    // update time
    time--;
    timeLeftEl.textContent = time;
  
    // check if user ran out of time
    if (time <= 0) {
        gameOverEl();
    }
}

function saveHighscore() {
    // get value of input box
    var initials = initialsEl.value.trim();
  
    if (initials !== "") {
      // get saved scores from localstorage, or if not any, set to empty array
      var highscores =
        JSON.parse(window.localStorage.getItem("highscores")) || [];
  
      // format new score object for current user
      var newScore = {
        score: time,
        initials: initials
      };
  
      // save to localstorage
      highscores.push(newScore);
      window.localStorage.setItem("highscores", JSON.stringify(highscores));
  
      // redirect to next page
      window.location.href = "scoreboard.html";
    }
}

// submit initials
submitBtn.onclick = saveHighscore;