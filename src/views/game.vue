<template>
    <div class="game-container">
  
      <div :class="'game-content '+(gameState != 'start' ? 'active' : '')">
            <div class="start-welcome-screen" v-if="gameState === 'start'">
                <div class="welcome-icon">
                  <i class="fas fa-trophy"></i>
                </div>
                <h1 class="welcome-title">טריוויה פרסים!</h1>
                <h2 class="welcome-subtitle">משחק חדש מעולם הילדים</h2>
                
                <div class="welcome-content">
                    <p class="welcome-intro">בכל חודש תוכלו ליהנות מהמשחק וגם לזכות בפרס</p>
                    
                    <div class="welcome-steps">
                        <div class="step-item">
                            <div class="step-number">1</div>
                            <p>להיות מנויים בעולם הילדים</p>
                        </div>
                        <div class="step-item">
                            <div class="step-number">2</div>
                            <p>לצבור את מספר הנקודות הגבוה ביותר</p>
                        </div>
                    </div>
                    
                    <div class="welcome-flow">
                        <span>לשחק</span>
                        <i class="fas fa-arrow-left"></i>
                        <span>ללמוד</span>
                        <i class="fas fa-arrow-left"></i>
                        <span>לצבור נקודות</span>
                        <i class="fas fa-arrow-left"></i>
                        <span>לזכות!</span>
                    </div>
                    
                    <p class="welcome-footer">עולם הילדים • כיף זה בטוח</p>
                </div>
                
                <button @click="startGame()" class="start-button">
                    התחל משחק
                    <i class="fas fa-arrow-left"></i>
                </button>
            </div>
          <div v-if="gameState === 'playing' || gameState === 'result'" key="playing" class="game-screen">
            <button @click="toggleMute" class="mute-button">
              <span v-if="isMuted"><i class="fas fa-volume-mute"></i></span>
              <span v-else><i class="fas fa-volume-up"></i></span>
            </button>
            <div class="score-display">ניקוד: {{ totalScore }}</div>
            
            <!-- Circular Timer -->
            <div class="circular-timer">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle
                  class="timer-circle-bg"
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#e0e7ff"
                  stroke-width="6"
                />
                <circle
                  class="timer-circle-progress"
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  :stroke="timerColor"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="circleCircumference"
                  :stroke-dashoffset="circleDashOffset"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div class="timer-content">
                <i class="fas fa-clock timer-icon"></i>
                <div class="timer-number">{{ Math.ceil(timer) }}</div>
              </div>
            </div>

            <div class="questoins-display">שאלה {{ currentQuestionIndex+1 }}/{{ ttl_questions }}</div>
            
            <transition name="question-transition" mode="out-in">
              <div class="question-container" :key="'q-'+currentQuestionIndex">
                <h2 class="question-text">{{ currentQuestion.question }}</h2>
              </div>
            </transition>
            
            <transition-group name="answer-list" tag="div" class="answers-grid" mode="out-in">
              <button
                v-for="(answer, index) in showAnswers ? currentQuestion.answers : []"
                :key="'a-'+currentQuestionIndex+'-'+answer.index"
                :data-index="index"
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
            </transition-group>

            
            <!-- Power-ups -->
            <transition name="fade">
              <div v-if="showPowerUps" class="power-ups-container">
                <div class="power-up-item">
                  <button 
                    @click="useFiftyFifty" 
                    :disabled="powerUps.fiftyFifty.used || answerSelected"
                    :class="['power-up-btn', { 'used': powerUps.fiftyFifty.used }]"
                    title="50/50 - הסר 2 תשובות שגויות">
                    <svg viewBox="0 0 24 24" class="power-up-icon">
                      <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.2"/>
                      <text x="12" y="16" text-anchor="middle" font-size="8" font-weight="bold" fill="currentColor">50:50</text>
                    </svg>
                  </button>
                  <span class="power-up-label">50:50</span>
                </div>
                
                <div class="power-up-item">
                  <button 
                    @click="useAddTime" 
                    :disabled="powerUps.addTime.used || answerSelected"
                    :class="['power-up-btn', { 'used': powerUps.addTime.used }]"
                    title="+זמן - מלא את הזמן מחדש">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 8V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 2H15" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                  </button>
                  <span class="power-up-label">תוספת זמן</span>
                </div>
                
                <div class="power-up-item">
                  <button 
                    @click="useSkipQuestion" 
                    :disabled="powerUps.skipQuestion.used || answerSelected"
                    :class="['power-up-btn', { 'used': powerUps.skipQuestion.used }]"
                    title="דלג על השאלה">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 8.33994V15.6599C2 17.1599 3.62999 18.0999 4.92999 17.3499L8.10001 15.5299L11.27 13.7C11.47 13.58 11.63 13.45 11.76 13.29V10.73C11.63 10.57 11.47 10.44 11.27 10.32L8.10001 8.48993L4.92999 6.66996C3.62999 5.89996 2 6.83994 2 8.33994Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.76 8.33994V15.6599C11.76 17.1599 13.39 18.0999 14.69 17.3499L17.86 15.5299L21.03 13.7C22.33 12.95 22.33 11.08 21.03 10.32L17.86 8.48993L14.69 6.66996C13.39 5.89996 11.76 6.83994 11.76 8.33994Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                  </button>
                  <span class="power-up-label">לשאלה הבאה</span>
                </div>
              </div>
            </transition>
            
            <!-- Result Overlay -->
            <transition name="result-overlay">
              <div v-if="gameState === 'result'" class="result-overlay">
                <div class="result-popup">
                  <div class="result-icon">
                    <!-- Success Icon -->
                    <svg v-if="isCorrect" viewBox="0 0 100 100" class="icon-success">
                      <circle cx="50" cy="50" r="45" fill="#10b981" />
                      <path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    </svg>
                    <!-- Timeout Icon -->
                    <svg v-else-if="isTimeout" viewBox="0 0 100 100" class="icon-timeout">
                      <circle cx="50" cy="50" r="45" fill="#fbbf24" />
                      <circle cx="50" cy="50" r="35" fill="#1a1a2e" />
                      <line x1="50" y1="50" x2="50" y2="25" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                      <line x1="50" y1="50" x2="65" y2="50" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                    </svg>
                    <!-- Error Icon -->
                    <svg v-else viewBox="0 0 100 100" class="icon-error">
                      <circle cx="50" cy="50" r="45" fill="#ef4444" />
                      <line x1="35" y1="35" x2="65" y2="65" stroke="white" stroke-width="8" stroke-linecap="round" />
                      <line x1="65" y1="35" x2="35" y2="65" stroke="white" stroke-width="8" stroke-linecap="round" />
                    </svg>
                  </div>
                  <h2 class="result-text" :class="{ 'correct': isCorrect, 'incorrect': !isCorrect, 'timeout': isTimeout }">
                    {{ isCorrect ? 'נכון מאוד!' : (isTimeout ? 'נגמר הזמן!' : 'אופס! טעות.') }}
                  </h2>
                  <p class="points-text">{{ isCorrect ? `+${earnedPoints} נקודות` : 'אין נקודות הפעם' }}</p>
                </div>
              </div>
            </transition>
          </div>
  
          <div v-else-if="gameState === 'gameOver'" key="gameOver" :class="'game-over-screen '+ (month_positon < 10 || all_time_positon < 10 ? 'active_success' : '')">
            <div class="game-over-icon">
              <i :class="month_positon < 10 || all_time_positon < 10 ? 'fas fa-trophy' : 'fas fa-flag-checkered'"></i>
            </div>
            <h2 class="game-over-title">המשחק נגמר!</h2>
            
            <div class="final-score-card">
              <div class="score-label">הניקוד הסופי שלך</div>
              <div class="final-score">{{ totalScore }}</div>
            </div>
            
            <div class="note-message" v-if="note">
              <i class="fas fa-info-circle"></i>
              {{ note }}
            </div>
            
            <div class="rankings">
              <div class="rank-item">
                <div class="rank-icon"><i class="fas fa-chart-line"></i></div>
                <div class="rank-content">
                  <div class="rank-label">טבלת ניקוד כללית</div>
                  <div class="rank-position">מקום {{ all_time_positon }}</div>
                </div>
              </div>
              <div class="rank-item">
                <div class="rank-icon"><i class="fas fa-calendar-alt"></i></div>
                <div class="rank-content">
                  <div class="rank-label">טבלת ניקוד חודשית</div>
                  <div class="rank-position">מקום {{ month_positon }}</div>
                </div>
              </div>
            </div>
            
            <button @click="restartGame" class="restart-button">
              שחק שוב
              <i class="fas fa-redo"></i>
            </button>
          </div>
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
        isMuted: false,
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
        showAnswers: false,
        showPowerUps: false,
        isTimeout: false,
        // Power-ups
        powerUps: {
          fiftyFifty: { used: false, available: true },
          addTime: { used: false, available: true },
          skipQuestion: { used: false, available: true }
        },
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
        const percentage = (this.timer / this.ttl_seconds) * 100;
        if (percentage > 50) return '#00b894'; // Green
        if (percentage > 25) return '#fdcb6e'; // Orange/Yellow
        return '#ff7675'; // Red
      },
      circleCircumference() {
        return 2 * Math.PI * 36; // 2πr where r=36
      },
      circleDashOffset() {
        const percentage = (this.timer / this.ttl_seconds);
        return this.circleCircumference * (1 - percentage);
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
            this.$emit('game_state_changed', 'playing');
           
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
                this.$emit('game_state_changed', 'gameOver');
                return;
            }
            this.questions.push(data.data);
            if(start){
                this.gameState = 'playing';
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.showAnswers = true;
                        this.$nextTick(() => {
                            this.startTimer();
                        });
                        // Show power-ups 1 second after answers
                        setTimeout(() => {
                            this.showPowerUps = true;
                        }, 1000);
                    }, 400);
                });
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
        this.isTimeout = (index === -1); // Check if timeout
        clearInterval(this.timerInterval);

        let token = this.currentQuestion.token;

        this.api({ action: 'trivia/answer', data:{token,game_token: this.game_token,answer:index}}, (data) => {
            // Show result immediately on the answers
            this.showResult = true;
            this.isCorrect = data.data.correct == index;
            this.earnedPoints = data.data.earnedPoints;
            this.correctAnswerIndex = data.data.correct;
            this.totalScore = data.data.score;

            if (this.isCorrect) {
                this.playSound('correct');
            } else {
                this.playSound('wrong');
            }
            
            // Show result screen after 1 second
            setTimeout(() => {
                this.gameState = 'result';
                this.$emit('game_state_changed', 'result');
                
                // Move to next question after 1.5 more seconds
                setTimeout(() => {
                    this.stopSound();
                    this.get_next_question();
                }, 1500);
            }, 1000);
        });
      },
    
      resetQuestion() {
        this.gameState = 'playing';
        this.$emit('game_state_changed', 'playing');
        this.selectedAnswerIndex = null;
        this.answerSelected = false;
        this.showResult = false;
        this.correctAnswerIndex = null;
        this.showAnswers = false;
        this.showPowerUps = false;
        this.isTimeout = false;
        // this.showLoader = false;
        
        // Use nextTick to ensure DOM is updated before showing answers
        this.$nextTick(() => {
            setTimeout(() => {
                this.showAnswers = true;
                this.$nextTick(() => {
                    this.startTimer();
                });
                // Show power-ups 1 second after answers
                setTimeout(() => {
                    this.showPowerUps = true;
                }, 1000);
            }, 400);
        });
      },
      restartGame() {
        this.gameState = 'start';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswerIndex = null;
        this.totalScore = 0;
        this.answerSelected = false;
        this.showResult = false;
        this.showAnswers = false;
        this.showPowerUps = false;
        this.showLeaderboards = false;
        // Reset power-ups
        this.powerUps = {
          fiftyFifty: { used: false, available: true },
          addTime: { used: false, available: true },
          skipQuestion: { used: false, available: true }
        };
        this.$emit('game_state_changed', 'start');
      },
      
      // Power-up methods
      useFiftyFifty() {
        if (this.powerUps.fiftyFifty.used || this.answerSelected) return;
        
        this.powerUps.fiftyFifty.used = true;
        
        let token = this.currentQuestion.token;
        
        this.api({ 
          action: 'trivia/use_fifty_fifty', 
          data: { token, game_token: this.game_token }
        }, (data) => {
          if (!data.data || !data.data.remove_indices) {
            this.toast('שגיאה בשימוש ב-50:50', 'error');
            this.powerUps.fiftyFifty.used = false;
            return;
          }
          
          const indicesToRemove = data.data.remove_indices;
          
          // Remove the answers with the indices returned from the server
          this.currentQuestion.answers = this.currentQuestion.answers.filter(
            answer => !indicesToRemove.includes(answer.index)
          );
          
          this.toast('2 תשובות שגויות הוסרו!', 'success');
        }, () => {
          // On error, reset the power-up
          this.powerUps.fiftyFifty.used = false;
          this.toast('שגיאה בשימוש ב-50:50', 'error');
        });
      },
      
      useAddTime() {
        if (this.powerUps.addTime.used || this.answerSelected) return;
        
        this.powerUps.addTime.used = true;
        this.timer = this.ttl_seconds;
        
        this.toast('הזמן התמלא מחדש!', 'success');
      },
      
      useSkipQuestion() {
        if (this.powerUps.skipQuestion.used || this.answerSelected) return;
        
        this.powerUps.skipQuestion.used = true;
        
        // Skip question without penalty
        clearInterval(this.timerInterval);
        this.get_next_question();
        
        this.toast('דילגת על השאלה!', 'info');
      },
      toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.audio) {
          this.audio.volume = this.isMuted ? 0 : 0.5;
        }
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
        if (this.isMuted) return;
        
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

  // Modern Mobile-First Design - Dark Mode
  .game-container {
    font-family: 'Varela Round', sans-serif;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    direction: rtl;
  }

  .game-content {
    width: 100%;
    max-width: 100vw;
    
    &.active {
      min-height: 100vh;
      
      @media (min-width: 640px) {
        min-height: auto;
      }
    }
  }

  // Start Welcome Screen
  .start-welcome-screen {
    background: rgba(30, 30, 50, 0.95);
    border-radius: 0;
    padding: 2.5rem 2rem;
    box-shadow: none;
    backdrop-filter: blur(10px);
    text-align: center;
    animation: slideInUp 0.6s ease;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    @media (min-width: 640px) {
      border-radius: 24px;
      max-width: 640px;
      margin: 2rem auto;
      min-height: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      padding: 3rem 2.5rem;
    }
  }

  .welcome-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
    animation: bounce 2s infinite;
    
    i {
      font-size: 2.5rem;
      color: #1a1a2e;
    }
  }

  .welcome-title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    
    @media (min-width: 640px) {
      font-size: 2.5rem;
    }
  }

  .welcome-subtitle {
    font-size: 1.1rem;
    color: #c4c4e0;
    font-weight: 500;
    margin-bottom: 2rem;
  }

  .welcome-content {
    margin: 2rem 0;
  }

  .welcome-intro {
    font-size: 1.1rem;
    color: #d1d5db;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  .welcome-steps {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    
    @media (max-width: 639px) {
      flex-direction: column;
    }
  }

  .step-item {
    flex: 1;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%);
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(167, 139, 250, 0.2);
    
    .step-number {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
      margin: 0 auto 0.75rem;
    }
    
    p {
      font-size: 0.95rem;
      color: #e5e7eb;
      line-height: 1.5;
      margin: 0;
    }
  }

  .welcome-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    
    span {
      font-size: 0.9rem;
      color: #c4b5fd;
      font-weight: 600;
      padding: 0.5rem 1rem;
      background: rgba(167, 139, 250, 0.2);
      border-radius: 20px;
    }
    
    i {
      font-size: 0.8rem;
      color: #9ca3af;
    }
  }

  .welcome-footer {
    font-size: 1rem;
    color: #9ca3af;
    margin: 0;
  }

  .start-button, .restart-button {
    font-size: 1.25rem;
    font-weight: 600;
    padding: 1rem 2.5rem;
    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(167, 139, 250, 0.5);
    display: inline-flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1rem;
    direction: rtl;
    
    i {
      font-size: 1rem;
      order: 2;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(236, 72, 153, 0.6);
      
      i {
        transform: translateX(-3px);
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  // Game Screen
  .game-screen {
    background: rgba(30, 30, 50, 0.95);
    border-radius: 0;
    padding: 1.5rem;
    box-shadow: none;
    backdrop-filter: blur(10px);
    position: relative;
    min-height: 100vh;
    
    @media (min-width: 640px) {
      border-radius: 24px;
      max-width: 640px;
      margin: 2rem auto;
      min-height: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      padding: 2.5rem;
    }
  }

  .mute-button {
    position: absolute;
    top: -20px;
    left: 1rem;
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
    background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 12px 30px rgba(99, 102, 241, 0.6);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  .score-display {
    position: absolute;
    top: -20px;
    right: 1rem;
    font-size: 1rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1a1a2e;
    padding: 0.75rem 1.25rem;
    border-radius: 50px;
    box-shadow: 0 8px 20px rgba(251, 191, 36, 0.5);
  }

  // Circular Timer
  .circular-timer {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    
    svg {
      transform: scaleX(-1); // Flip for RTL
    }
    
    .timer-circle-bg {
      stroke: rgba(167, 139, 250, 0.2);
    }
    
    .timer-circle-progress {
      transition: stroke-dashoffset 0.1s linear, stroke 0.3s ease;
    }
    
    .timer-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .timer-icon {
      font-size: 0.8rem;
      color: #a78bfa;
      margin-bottom: 2px;
    }
    
    .timer-number {
      font-size: 1.4rem;
      font-weight: 700;
      color: #f3f4f6;
      line-height: 1;
    }
  }

  .questoins-display {
    text-align: center;
    color: #c4b5fd;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  // Power-ups Container
  .power-ups-container {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin: 1.5rem 0 2rem;
    direction: rtl;
  }

  .power-up-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .power-up-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    opacity: 0.95;
    transition: all 0.3s ease;
    
    @media (min-width: 640px) {
      font-size: 0.85rem;
    }
  }

  .power-up-item:hover .power-up-label {
    opacity: 1;
    transform: scale(1.05);
  }

  .power-up-item:has(.used) .power-up-label {
    color: #6b7280 !important;
    opacity: 0.6;
    text-shadow: none !important;
  }

  .power-up-btn {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    border: 1px solid rgba(167, 139, 250, 0.3);
    background: rgba(139, 92, 246, 0.15);
    color: #c4b5fd;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    @media (min-width: 640px) {
      width: 64px;
      height: 64px;
    }
    
    .power-up-icon {
      width: 32px;
      height: 32px;
      
      @media (min-width: 640px) {
        width: 36px;
        height: 36px;
      }
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-4px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(-2px);
    }
  }
  
  // 50:50 Button - Gold/Yellow
  .power-up-item:nth-child(1) .power-up-btn {
    background: rgba(251, 191, 36, 0.2);
    border-color: rgba(251, 191, 36, 0.4);
    color: #fbbf24;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%);
      border-color: rgba(251, 191, 36, 0.6);
      box-shadow: 0 8px 20px rgba(251, 191, 36, 0.5);
    }
  }
  
  .power-up-item:nth-child(1) .power-up-label {
    color: #fbbf24;
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
  }
  
  .power-up-item:nth-child(1):hover .power-up-label {
    color: #fcd34d;
    text-shadow: 0 0 15px rgba(251, 191, 36, 0.7);
  }
  
  // Add Time Button - Cyan/Blue
  .power-up-item:nth-child(2) .power-up-btn {
    background: rgba(6, 182, 212, 0.2);
    border-color: rgba(6, 182, 212, 0.4);
    color: #06b6d4;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(8, 145, 178, 0.3) 100%);
      border-color: rgba(6, 182, 212, 0.6);
      box-shadow: 0 8px 20px rgba(6, 182, 212, 0.5);
    }
  }
  
  .power-up-item:nth-child(2) .power-up-label {
    color: #22d3ee;
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.4);
  }
  
  .power-up-item:nth-child(2):hover .power-up-label {
    color: #67e8f9;
    text-shadow: 0 0 15px rgba(6, 182, 212, 0.7);
  }
  
  // Skip Question Button - Green
  .power-up-item:nth-child(3) .power-up-btn {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.4);
    color: #10b981;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%);
      border-color: rgba(16, 185, 129, 0.6);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
    }
  }
  
  .power-up-item:nth-child(3) .power-up-label {
    color: #34d399;
    text-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
  }
  
  .power-up-item:nth-child(3):hover .power-up-label {
    color: #6ee7b7;
    text-shadow: 0 0 15px rgba(16, 185, 129, 0.7);
  }
  
  .power-up-btn {
    &.used {
      background: rgba(75, 75, 95, 0.3);
      color: #6b7280;
      cursor: not-allowed;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      border-color: rgba(107, 114, 128, 0.2);
      
      &::after {
        content: '';
        position: absolute;
        top: -6px;
        left: -6px;
        width: 18px;
        height: 18px;
        background: #10b981;
        border-radius: 50%;
        border: 2px solid #1e1e32;
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
      }
      
      &::before {
        content: '✓';
        position: absolute;
        top: -6px;
        left: -6px;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        color: white;
        font-weight: 700;
        z-index: 1;
      }
    }
    
    &:disabled:not(.used) {
      opacity: 0.4;
      cursor: not-allowed;
      filter: grayscale(0.5);
    }
  }

  .question-container {
    margin: 1rem 0 1.5rem;
  }

  .question-text {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: #f3f4f6;
    line-height: 1.5;
    
    @media (min-width: 640px) {
      font-size: 1.75rem;
    }
  }

  // Answers Grid with TransitionGroup
  .answers-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }

  .answer-button {
    font-size: 1.2rem;
    font-weight: 600;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
    color: #f3f4f6;
    border: 2px solid rgba(167, 139, 250, 0.3);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
    line-height: 1.4;
    
    @media (min-width: 640px) {
      font-size: 1.35rem;
      padding: 1.2rem 1.75rem;
    }
    @media (max-width: 640px) {
      padding: 0.6rem 1.5rem;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      background: linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%);
      border-color: rgba(167, 139, 250, 0.5);
      box-shadow: 0 8px 25px rgba(167, 139, 250, 0.4);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    
    &.selected {
      background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
      color: white;
      border-color: transparent;
      box-shadow: 0 8px 25px rgba(236, 72, 153, 0.6);
    }
    
    &.correct {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-color: transparent;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
      animation: correctPulse 0.6s ease;
    }
    
    &.incorrect {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border-color: transparent;
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.6);
      animation: shake 0.5s ease;
    }
    
    &.pulsing {
      animation: pulse 1s infinite;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  // Question Transition (Fade + Scale)
  .question-transition-enter-active,
  .question-transition-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .question-transition-enter-from {
    opacity: 0;
    transform: scale(0.8);
  }
  
  .question-transition-leave-to {
    opacity: 0;
    transform: scale(1.1);
  }

  // TransitionGroup Animations (Staggered with Scale + Fade)
  .answer-list-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .answer-list-leave-active {
    // position: absolute;
    opacity: 0 !important;
  }
  
  .answer-list-enter-from {
    opacity: 0;
    transform: scale(0.7) translateY(20px);
  }
  
  .answer-list-enter-active {
    &[data-index="0"] { transition-delay: 0.05s; }
    &[data-index="1"] { transition-delay: 0.15s; }
    &[data-index="2"] { transition-delay: 0.25s; }
    &[data-index="3"] { transition-delay: 0.35s; }
  }
  
  .answer-list-move {
    transition: transform 0.5s ease;
  }

  // Result Overlay
  .result-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    z-index: 100;
  }

  .result-popup {
    background: rgba(30, 30, 50, 0.98);
    border: 2px solid rgba(167, 139, 250, 0.3);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    text-align: center;
    max-width: 90%;
    min-width: 280px;
    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    @media (min-width: 640px) {
      min-width: 320px;
      padding: 3rem 2.5rem;
    }
  }

  .result-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 100%;
      height: 100%;
    }
    
    .icon-success {
      animation: checkBounce 0.6s ease;
    }
    
    .icon-error {
      animation: shakeFast 0.5s ease;
    }
    
    .icon-timeout {
      animation: clockTick 0.5s ease;
    }
  }

  .result-text {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
    
    &.correct {
      color: #10b981;
    }
    
    &.incorrect {
      color: #ef4444;
    }
    
    &.timeout {
      color: #fbbf24;
    }
    
    @media (min-width: 640px) {
      font-size: 2rem;
    }
  }

  .points-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  // Result Overlay Transitions
  .result-overlay-enter-active {
    transition: all 0.3s ease;
  }
  
  .result-overlay-leave-active {
    transition: none;
  }
  
  .result-overlay-enter-from {
    opacity: 0;
  }

  // Game Over Screen
  .game-over-screen {
    background: rgba(30, 30, 50, 0.95);
    border-radius: 0;
    padding: 2.5rem 2rem;
    box-shadow: none;
    backdrop-filter: blur(10px);
    text-align: center;
    animation: slideInUp 0.6s ease;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    @media (min-width: 640px) {
      border-radius: 24px;
      max-width: 640px;
      margin: 2rem auto;
      min-height: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      padding: 3rem 2.5rem;
    }
  }

  .game-over-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(236, 72, 153, 0.5);
    animation: scaleIn 0.8s ease;
    
    i {
      font-size: 2.5rem;
      color: white;
    }
  }

  .active_success .game-over-icon {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.6);
    animation: bounce 1s ease;
  }

  .game-over-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #f3f4f6;
  }

  .active_success .game-over-title {
    color: #10b981;
  }

  .final-score-card {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
    border: 1px solid rgba(167, 139, 250, 0.3);
    padding: 1.5rem 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
  }

  .score-label {
    font-size: 0.9rem;
    color: #c4b5fd;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .final-score {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .active_success .final-score {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .note-message {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
    border: 1px solid rgba(251, 191, 36, 0.3);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    color: #fbbf24;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    i {
      font-size: 1.2rem;
    }
  }

  .rankings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .rank-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(167, 139, 250, 0.2);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(167, 139, 250, 0.15);
      border-color: rgba(167, 139, 250, 0.4);
    }
  }

  .rank-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    i {
      font-size: 1.3rem;
      color: white;
    }
  }

  .rank-content {
    flex: 1;
    text-align: right;
  }

  .rank-label {
    font-size: 0.85rem;
    color: #c4b5fd;
    margin-bottom: 0.25rem;
  }

  .rank-position {
    font-size: 1.2rem;
    font-weight: 700;
    color: #f3f4f6;
  }

  .active_success .rank-position {
    color: #10b981;
  }

  // Animations
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  @keyframes correctPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-10px);
    }
    75% {
      transform: translateX(10px);
    }
  }

  @keyframes scaleIn {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes slideInUp {
    0% {
      transform: translateY(30px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes popIn {
    0% {
      transform: scale(0.7);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes checkBounce {
    0%, 100% {
      transform: scale(1);
    }
    25% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.2);
    }
    75% {
      transform: scale(0.95);
    }
  }

  @keyframes shakeFast {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-8px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(8px);
    }
  }

  @keyframes clockTick {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-10deg);
    }
    75% {
      transform: rotate(10deg);
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.4s ease;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  
  
  
  
  
  
  
  
  
  
  