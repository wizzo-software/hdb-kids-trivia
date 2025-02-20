<template>
    <div id="trivia_game" v-if="loaded">
        <div class="bubbles"></div>
        <div class="centered" id="trivia_content">
            <h1 class="game-title"> טריויה עולם הילדים!</h1>
            <game @game_ended="load()" />
            <div class="title_site">לוח תוצאות</div>
            <leadboard :all_time="all_time_leaders" :monthly_leaders="monthly_leaders" :my_last_games="my_last_games" />
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
    },
    mounted() {
        this.load(true);
    },
    // Add your graph component import and configuration here
}
</script>

<style scoped lang="scss">
#trivia_content{position: relative;z-index: 2;}
#trivia_game{
    &{padding: 170px 0;position: relative;}
}
.title_site{
    font-size: 30px;
    text-align: center;
    margin-top: 20px;
    color: #FF6B6B;
    margin-bottom: 20px;
}
</style>