<template>
    <div id="trivia_game" v-if="loaded">
        <div class="bubbles"></div>
        <div class="centered" id="trivia_content">
            <div class="page-header">
                <h1 class="game-title">טריויה עולם הילדים!</h1>
                <p class="game-subtitle">כיף, ידע ופרסים מחכים לכם</p>
            </div>
            
            <game @game_ended="load()" @game_state_changed="handleGameState" />
            
            <div class="leaderboard-section" v-if="!isGameActive">
                <div class="section-header">
                    <div class="section-icon">
                        <i class="fas fa-crown"></i>
                    </div>
                    <h2 class="section-title">לוח תוצאות</h2>
                </div>
                <leadboard :all_time="all_time_leaders" :monthly_leaders="monthly_leaders" :my_last_games="my_last_games" />
            </div>
        </div>
    </div>
</template>

<script>
import game from './game.vue';
import leadboard from './leadboard.vue';
export default {
    components: {
        leadboard,game
    },
    props: {
      
    },
    data(){
        return {
        loaded: false,
        isGameActive: false,
        my_last_games: [],
        all_time_leaders: [],
        monthly_leaders: [],
    
        }
    },
    methods:{
        createBubbles() {
        const bubbles = document.querySelector('.bubbles');
        for (let i = 0; i < 10; i++) {
          const bubble = document.createElement('div');
          bubble.classList.add('bubble');
          bubbles.appendChild(bubble);
        }
      },
      load(initial = false)
      {
        this.api({ action: 'trivia/general'}, (data) => {

            this.all_time_leaders = data.data.all_time_leaders;
            this.my_last_games = data.data.my_last_games;
            this.monthly_leaders = data.data.monthly_leaders;
            if(initial)
            {
                this.loaded = true;
                    setTimeout(() => {
                        this.createBubbles();
                    }, 1000);
            }
            
        });
      },
      handleGameState(state) {
        // Hide leaderboard when game is playing or showing results
        this.isGameActive = (state === 'playing' || state === 'result');
      },
    },
    mounted() {
        this.load(true);
    },
    // Add your graph component import and configuration here
}
</script>

<style scoped lang="scss">
#trivia_game {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    overflow-x: hidden;
    
    @media (min-width: 640px) {
        padding: 40px 0 100px;
    }
    
    @media (max-width: 640px) {
        padding: 0px;
    }
}


#trivia_content {
    position: relative;
    z-index: 2;
    margin: 0 auto;
    
    &:has(.game-screen) {
      padding: 0;
      max-width: 100%;
    }
    
    &:not(:has(.game-screen)) {
      padding: 0 1rem;
    }
}

// Page Header
.page-header {
    text-align: center;
    margin-bottom: 2rem;
    animation: fadeInDown 0.8s ease;
    
    @media (min-width: 640px) {
        margin-bottom: 3rem;
    }
}

.game-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 0.5rem;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    letter-spacing: -0.5px;
    
    @media (min-width: 640px) {
        font-size: 3.5rem;
    }
}

.game-subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    
    @media (min-width: 640px) {
        font-size: 1.3rem;
    }
}

// Leaderboard Section
.leaderboard-section {
    margin-top: 4rem;
    
    @media (min-width: 640px) {
        margin-top: 5rem;
    }
}

.section-header {
    text-align: center;
    margin-bottom: 2rem;
    animation: fadeInUp 0.8s ease 0.3s backwards;
}

.section-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(251, 191, 36, 0.5);
    animation: pulse 2s ease-in-out infinite;
    
    i {
        font-size: 1.8rem;
        color: #1a1a2e;
    }
}

.section-title {
    font-size: 2rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    
    @media (min-width: 640px) {
        font-size: 2.5rem;
    }
}

// Bubbles Animation Enhancement
.bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
}

// Animations
@keyframes fadeInDown {
    0% {
        opacity: 0;
        transform: translateY(-30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-15px);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}
</style>