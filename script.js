// Dados do jogo
let questions = [];
let currentQuestionIndex = 0;
let usedQuestions = [];

// Carregar perguntas
document.getElementById('questionsFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            questions = JSON.parse(e.target.result);
            document.getElementById('playButton').disabled = false;
        } catch (error) {
            alert('Erro ao carregar arquivo!');
        }
    };
    reader.readAsText(file);
});

// Iniciar jogo
function startGame() {
    currentQuestionIndex = 0;
    usedQuestions = [];
    document.getElementById('uploadArea').classList.add('d-none');
    document.getElementById('gameArea').classList.remove('d-none');
    showRandomQuestion();
}

// Mostrar questão aleatória
function showRandomQuestion() {
    if (usedQuestions.length === questions.length) {
        alert('Fim do quiz! Todas as perguntas foram respondidas.');
        location.reload();
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questions.length);
    } while (usedQuestions.includes(randomIndex));

    usedQuestions.push(randomIndex);
    currentQuestionIndex = randomIndex;
    showQuestion();
}

// Mostrar questão atual
function showQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question').textContent = q.quiz;
    document.getElementById('alternatives').innerHTML = 
        ['a', 'b', 'c', 'd'].map(alt => `
            <button class="list-group-item list-group-item-action" 
                onclick="checkAnswer('${alt}')">
                ${q[alt]}
            </button>
        `).join('');
    
    // Resetar elementos
    document.getElementById('feedback').classList.add('d-none');
    document.getElementById('reference').classList.add('d-none');
    document.getElementById('nextButton').disabled = true;
}

// Verificar resposta
function checkAnswer(selected) {
    const q = questions[currentQuestionIndex];
    const correct = q.x;
    const feedback = document.getElementById('feedback');
    const reference = document.getElementById('reference');
    const audioAcerto = document.getElementById('audioAcerto');
    const audioErro = document.getElementById('audioErro');
    
    // Destacar respostas
    document.querySelectorAll('#alternatives button').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q[correct]) {
            btn.classList.add('btn-success');
        } else if (btn.textContent === q[selected]) {
            btn.classList.add('btn-danger');
        }
    });

    // Mostrar feedback
    feedback.classList.remove('d-none');
    if (selected === correct) {
        feedback.classList.remove('alert-danger');
        feedback.classList.add('alert-success');
        feedback.textContent = "Resposta Correta! ✅";
        audioAcerto.play(); // Toca som de acerto
    } else {
        feedback.classList.remove('alert-success');
        feedback.classList.add('alert-danger');
        feedback.textContent = `Resposta Incorreta! ❌ A resposta correta é: ${q[correct]}`;
        audioErro.play(); // Toca som de erro
    }

    // Mostrar referência se existir
    if (q.ref) {
        reference.classList.remove('d-none');
        reference.textContent = `Referência: ${q.ref}`;
    }

    document.getElementById('nextButton').disabled = false;
}

// Próxima questão
function nextQuestion() {
    showRandomQuestion();
}