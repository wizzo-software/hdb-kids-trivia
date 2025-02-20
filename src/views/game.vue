<template>
    <div class="game-container">
  
      <div :class="'game-content '+(gameState != 'start' ? 'active' : '')">
        <transition name="fade" mode="out-in">
            <div class="box" v-if="gameState === 'start'">
                <h2 >הגיע לעולם הילדים משחק חדש! טריוויה פרסים! </h2>
                <p >בכל חודש תוכלו ליהנות מהמשחק וגם לזכות בפרס. 
                    מה צריך כדי לזכות?<br>
                    פשוט!<br>
                    1. להיות מנויים בעולם הילדים<br>
                    2. לצבור את מספר הנקודות הגבוה ביותר<br>

                    מתחילים לשחק >>> לומדים דברים מעניינים בכל התחומים >>> צוברים נקודות >>> זוכים!<br>

                    עולם הילדים. כיף זה בטוח</p>     
                    <div v-if="gameState === 'start'" key="start" class="start-screen">
                        <button @click="startGame()" class="start-button">התחל משחק</button>
                    </div>
            </div>
        </transition>
        <transition name="fade" mode="out-in">
          <div v-if="gameState === 'playing'" key="playing" class="game-screen">
            <div class="score-display">ניקוד: {{ totalScore }}</div>
            <div class="questoins-display">שאלה {{ currentQuestionIndex+1 }}/{{ ttl_questions }}</div>
            <div class="question-container">
              <h2 class="question-text">{{ currentQuestion.question }}</h2>
              <div class="timer-bar-container" >
                <div class="timer-bar" :style="{ width: `${timerWidth}%`, backgroundColor: timerColor }"></div>
              </div>
            </div>
            <div class="answers-grid">
              <button
                v-for="(answer, index) in currentQuestion.answers"
                :key="index"
                @click="selectAnswer(answer.index)"
                :class="['answer-button', { 
                  'selected': selectedAnswerIndex === answer.index,
                  'correct':showResult && correctAnswerIndex === answer.index,
                  'incorrect': showResult && selectedAnswerIndex === answer.index && !isCorrect,
                  'pulsing': !showResult && selectedAnswerIndex === answer.index
                }]"
                :disabled="answerSelected"
              >
                {{ answer.content }}
              </button>
            </div>
          </div>
  
          <div v-else-if="gameState === 'result'" key="result" class="result-screen">
            <h2 class="result-text" :class="{ 'correct': isCorrect, 'incorrect': !isCorrect }">
              {{ isCorrect ? 'נכון מאוד!' : 'אופס! טעות.' }}
            </h2>
            <p class="points-text">{{ isCorrect ? `+${earnedPoints} נקודות` : 'אין נקודות הפעם' }}</p>
          </div>
  
          <div v-else-if="gameState === 'gameOver'" key="gameOver" :class="'game-over-screen '+ (month_positon < 10 || all_time_positon < 10 ? 'active_success' : '')">
            <h2 class="game-over-title">המשחק נגמר!</h2>
            <p class="final-score">הניקוד הסופי שלך: {{ totalScore }}</p>
            <p>{{ note }}</p>
            <p>מיקומכם בטבלת הניקוד הכללית: {{ all_time_positon }}</p>
            <p>מיקומכם בטבלת הניקוד החודשית: {{ month_positon }}</p>
            <button @click="restartGame" class="restart-button">שחק שוב</button>
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script>



  export default {
    components: {
    },
    data() {
      return {
        gameState: 'start',
        ttl_questions: 0,
        all_time_positon: null,
        month_positon: null,
        note: null,
        audio: null,
        game_token: null,
        ttl_seconds:20,
        questions: [],
        currentQuestionIndex: 0,
        timer: 10,
        timerInterval: null,
        selectedAnswerIndex: null,
        answerSelected: false,
        isCorrect: false,
        earnedPoints: 0,
        totalScore: 0,
        showResult: false,
        correctAnswerIndex: null,
        // showLoader: false,
        showLeaderboards: false,
      };
    },
    computed: {
      currentQuestion() {
        return this.questions[this.currentQuestionIndex];
      },
      timerWidth() {
        return (this.timer / this.ttl_seconds) * 100;
      },
      timerColor() {
        if (this.timer > 7) return '#4CAF50';
        if (this.timer > 3) return '#FFC107';
        return '#F44336';
      },
    },
    methods: {
      startGame() {

        this.api({ action: 'trivia/start_game'}, (data) => {
            if(!data.data){
                alert("אירעה שגיאה בהתחלת המשחק");
                return;
            }
            this.game_token = data.data.game_token;
            this.ttl_questions = data.data.ttl_questions;
            
            this.get_next_question(true);
           
        });
      },
    get_next_question(start = false){


        this.api({ action: 'trivia/get_question', data:{game_token: this.game_token}}, (data) => {
            if(!data.data){
                alert("אירעה שגיאה בהתחלת המשחק");
                return;
            }
            if(data.data.status == 'game_over'){   
                this.gameState = 'gameOver';
                this.note = data.data.note;
                this.month_positon = data.data.month_position;
                this.all_time_positon = data.data.all_time_position;
                this.$emit('game_ended');
                return;
            }
            this.questions.push(data.data);
            if(start){
                this.gameState = 'playing';
                this.startTimer();
                //if screen width is less than 600px scroll to the game container
                if(window.innerWidth < 600)
                {
                    document.querySelector('.game-container').scrollIntoView({ behavior: 'smooth' });    
                }
                

            }
            else{
                this.currentQuestionIndex++;
                this.resetQuestion();
            }
        });
        setTimeout(() => {
            return true;

        }, 3000);
      },
      startTimer() {
        this.timer = this.ttl_seconds;
        this.timerInterval = setInterval(() => {
          if (this.timer > 0) {
            this.timer -= 0.1;
          } else {
            this.selectAnswer(-1);
          }
        }, 100);
      },
      selectAnswer(index) {
        if (this.answerSelected) return;
        this.answerSelected = true;
        this.selectedAnswerIndex = index;
        clearInterval(this.timerInterval);

        let token = this.currentQuestion.token;

        this.api({ action: 'trivia/answer', data:{token,game_token: this.game_token,answer:index}}, (data) => {
            setTimeout(() => {
                this.showResult = true;
                this.isCorrect = data.data.correct == index;
                this.earnedPoints = data.data.earnedPoints;
                this.correctAnswerIndex = data.data.correct;

                if (this.isCorrect) {
                    this.playSound('correct');
                } else {
                    this.playSound('wrong');
                }
                setTimeout(() => {
                this.gameState = 'result';
                    setTimeout(() => {
                        // this.showLoader = true;
                        setTimeout(() => {
                            this.stopSound();
                            this.totalScore = data.data.score;
                            this.get_next_question();
                        }, 1000);
                    }, 2000);
                }, 2000);
            }, 2000);

        });

  
        // Show the result after 2 seconds
      
      },
    
      resetQuestion() {
        this.gameState = 'playing';
        this.selectedAnswerIndex = null;
        this.answerSelected = false;
        this.showResult = false;
        this.correctAnswerIndex = null;
        // this.showLoader = false;
        this.startTimer();
      },
      restartGame() {
        this.gameState = 'start';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswerIndex = null;
        this.totalScore = 0;
        this.answerSelected = false;
        this.showResult = false;
        this.showLeaderboards = false;

      },
      stopSound() {
        setTimeout(() => {
            this.audio.volume = 0.4;
            setTimeout(() => {
                this.audio.volume = 0.3;
                setTimeout(() => {
                    this.audio.volume = 0.2;
                    setTimeout(() => {
                        this.audio.volume = 0.1;
                        setTimeout(() => {
                            this.audio.pause();
                            this.audio.currentTime = 0;
                            this.audio = null;
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
      },
     
      playSound(type) {
        let audioPath = '';

        if (type === 'correct') {
        audioPath = require('@/assets/correct.mp3');
        } else if (type === 'submit') {
            audioPath = require('@/assets/submit.mp3');
        }
        else if (type === 'wrong') {
            audioPath = require('@/assets/wrong.mp3');
        }  

        this.audio = new Audio(audioPath);
        this.audio.volume = 0.5;
        this.audio.play();
    },

    
    },
 
    mounted() {

    },
    beforeUnmount() {
      clearInterval(this.timerInterval);
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
  .box{    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 1rem;
    flex: 1;
    margin-bottom: 1rem;line-height: 2;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    p{line-height: 1.5;}
}
  h2{    text-align: center;
    color: #FF6B6B;
    /* text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); */
    font-weight: 500;}
    p{font-size: 17px;
    line-height: 1.2;
    color: #FF6B6B;
    text-align: center;
    margin: 20px 0;}
  .questoins-display{text-align: center;
    color: #FF6B6B;
    font-weight: 500;
    font-size: 22px;}
  .game-container {
    font-family: 'Varela Round', sans-serif;
    padding-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    color: #333;
    direction: rtl;
  }
 

  
  .game-content {
    z-index: 10;
    width: 90%;
    max-width: 800px;
    &.active{    min-height: 60vh;
        @media screen and (max-width: 600px)
        {
            min-height: 100vh;
        }
    }
    &:not(.active){    min-height: 30vh;}
  }
  
  .game-title, .game-over-title {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #FF6B6B;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
  .start-screen{display: flex;justify-content: center;padding: 20px 0;} 
  .start-button, .restart-button {
    font-size: 1.5rem;
    padding: 1rem 2rem;
    background-color: #4ECDC4;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .restart-button{margin:  0 auto;display: block;}
  .start-button:hover, .restart-button:hover {
    background-color: #45b7a7;
    transform: scale(1.05);
  }
  
  .game-screen, .result-screen, .game-over-screen {
    position: relative;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
  
  .score-display {
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 1.2rem;
    background-color: #FF6B6B;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    @media screen and (max-width: 600px) {
      top: -25px;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: fit-content;
      padding: 10px 20px
        
    }
  }
  
  .question-container {
    margin: 40px 0 20px;
  }
  
  .question-text {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #45b7a7;
  }
  
  .timer-bar-container {
    width: 100%;
    height: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .timer-bar {
    height: 100%;
    transition: width 0.1s linear, background-color 0.5s ease;
  }
  
  .answers-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    @media screen and (max-width: 600px) {
      grid-template-columns: 1fr;
        
    }
  }
  
  .answer-button {
    font-size: 1.2rem;
    padding: 1rem;
    background-color: #FFD93D;
    color: #333;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .answer-button:hover {
    background-color: #FFC300;
    transform: translateY(-3px);
  }
  
  .answer-button.selected {
    background-color: #4ECDC4;
    color: white;
  }
  .active_success p,.active_success h2{color:#4CAF50 !important;;}
  .answer-button.correct {
    background-color: #4CAF50;
    color: white;
  }
  
  .answer-button.incorrect {
    background-color: #F44336;
    color: white;
  }
  
  .pulsing {
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.015);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .result-text {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .result-text.correct {
    color: #4ECDC4;
  }
  
  .result-text.incorrect {
    color: #FF6B6B;
  }
  
  .points-text {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
    color: #FFD93D;
  }
  
  .final-score {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #4ECDC4;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  
  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .leaderboard-button {
    font-size: 1.2rem;
    padding: 0.8rem 1.5rem;
    background-color: #FFD93D;
    color: #333;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-right: 1rem;
  }
  
  .leaderboard-button:hover {
    background-color: #FFC300;
    transform: scale(1.05);
  }
  </style>
  
  