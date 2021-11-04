// TODO(you): Write the JavaScript necessary to complete the assignment.
const btnStart = document.querySelector('.start-btn')
const startP = document.querySelector('.container')
const attemptP = document.querySelector('#attempt-quiz')
const text = document.querySelector('.start-txt')
const reviewPage = document.querySelector('#review-quiz')
const btnSubmit = document.querySelector('.submit')
const btnAgain = document.querySelector('.btn-again')
const question = document.querySelector('.question')
const submitCon = document.querySelector('.submit')
let Qid; //questions ID

btnStart.addEventListener("click", () => {
    startP.classList.toggle("hidden")
    attemptP.classList.toggle("hidden")
    text.classList.toggle("hidden")
})


btnSubmit.addEventListener("click", () => {
    reviewPage.classList.toggle("hidden")
    btnSubmit.classList.toggle("hidden")
    answersPack = getAnswers()
    disableAll();
    submitAnswers(answersPack).then(data => {
    highlightAns(answersPack, data.correctAnswers)
    document.querySelector('.score').innerHTML = data.score
    document.querySelector('.percent').innerHTML =`${data.score == 0 ? "" : data.score}0%`
    document.querySelector('.feedback').innerHTML = data.scoreText
    })
    
})

btnAgain.addEventListener("click", () => {
    window.location.reload();
})

// Calling API to get questions 
async function getQuestions() {
    let response = await fetch('https://wpr-quiz-api.herokuapp.com/attempts/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    })
    let package = await response.json();
    return package;
}

// Calling API to submit answers and then get response
async function submitAnswers(answersPack){
    let response = await fetch(`https://wpr-quiz-api.herokuapp.com/attempts/${Qid}/submit`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(answersPack)
    })
    return await response.json(answersPack)
}

getQuestions().then(data => {
    Qid = data._id;
    appendData(data.questions)
})

function appendData(data) {
    for (let i = 0; i < 10; i++) {
        divQ = createQuestion(data[i], i);
        // question.appendChild(divQ);
    }
}

// This function used to create and insert question to DOM
function createQuestion(data, i) {
        
        questionPack = document.createElement('div')
        questionPack.classList.add('question-container')
        questionCon = document.createElement('h1')
        questionCon.classList.add('question-title')
        questionCon.innerHTML = `Question ${i+1} of 10`
        questionList = document.createElement('div')
        questionList.classList.add('quesntion-list')
        num = document.createElement('p')
        num.classList.add('question-number')
        num.innerHTML = data.text
        questionPack.appendChild(questionCon)
        questionList.appendChild(num)
        console.log(num)
        for (answerIndex in data.answers) {
            console.log(answerIndex)
            answerCon = document.createElement('label')
            answerCon.classList.add('answer')
            choices = document.createElement('input')
            choices.id = answerIndex
            choices.type = "radio"
            choices.name = data._id
            questionPack.appendChild(questionCon)
            option = document.createTextNode(data.answers[answerIndex])
            checker = document.createElement('span')
            answerCon.appendChild(choices)
            answerCon.appendChild(checker)
            answerCon.appendChild(option)
            questionList.appendChild(answerCon)
            questionPack.appendChild(questionList)

        }
        attemptP.insertBefore(questionPack, submitCon)
            

}

function getAnswers() {
    answers = document.querySelectorAll('input:checked')
    answersPack = {
        "answers": {
            
        }        
    }
    for (ans of answers){
        answersPack["answers"][ans.name] = ans.id
    }
    return answersPack;
}

function highlightAns(submitAnswers, correctAnswers){
    for (const [key, value] of Object.entries(correctAnswers)){
        correctAns = document.getElementsByName(key)
        answerResult = document.createElement('p')
        answerResult.innerHTML = 'Correct Answer'
        correctAns[value].parentNode.appendChild(answerResult)
        if (parseInt(submitAnswers['answers'][key]) === value ){           
            console.log(document.getElementsByName(key))
            correctAns[value].nextSibling.classList.add('isCorrect')                   
        }else{
            correctAns.forEach(element => {
                if (element.checked === true){
                    element.nextSibling.classList.add('isWrong')
                    wrongResult = document.createElement('p')
                    wrongResult.innerHTML = 'Wrong Answer'
                    element.parentNode.appendChild(wrongResult)
                }
                if (parseInt(element.id) === value){
                    element.nextSibling.style.backgroundColor= '#ddd'
                }
            });
        }                 
    }
}

function disableAll(){
    document.querySelectorAll('input').forEach(e =>{
        e.disabled = true;
    })
}