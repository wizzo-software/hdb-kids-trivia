<template>
    <div class="leaderboards-container">
    <div class="leaderboard" v-if="my_last_games.length > 0">
        <h2>השיאים שלי</h2>
        <ul>
          <li v-for="(player, index) in my_last_games" :key="index" :class="{ 'top-three': index < 3 }">
            <span class="rank">{{ index + 1 }}</span>
            <span class="name">{{ player.name }}</span>
            <span class="score">{{ player.score }}</span>
            <span v-if="index < 3" class="crown" :class="getCrownClass(index)"></span>
          </li>
        </ul>
      </div>
      <div class="leaderboard">
        <h2> כל הזמנים</h2>
        <ul>
            <li>
                <span class="rank">מקום</span>
                <span class="name">שם</span>
                <span class="score">ניקוד</span>
            </li>
            <li v-for="(player, index) in all_time" :key="index" :class="{ 'top-three': index < 3 }">
            <span class="rank">{{ index + 1 }}</span>
            <span class="name">{{ player.name }}</span>
            <span class="score">{{ player.score }}</span>
            <span v-if="index < 3" class="crown" :class="getCrownClass(index)"></span>
          </li>
        </ul>
      </div>
      <div class="leaderboard">
        <h2>החודש האחרון</h2>
        <ul>
          <li v-for="(player, index) in monthly_leaders" :key="index" :class="{ 'top-three': index < 3 }">
            <span class="rank">{{ index + 1 }}</span>
            <span class="name">{{ player.name }}</span>
            <span class="score">{{ player.score }}</span>
            <span v-if="index < 3" class="crown" :class="getCrownClass(index)"></span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props:["monthly_leaders","all_time","my_last_games"],
    
    data() {
      return {
        
      };
    },
    methods: {
      getCrownClass(index) {
        switch(index) {
          case 0: return 'gold';
          case 1: return 'silver';
          case 2: return 'bronze';
          default: return '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .leaderboards-container {
    display: flex;
    gap: 30px;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  
  .leaderboard {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 1rem;
    flex: 1;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #FF6B6B;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }
  
  li:last-child {
    border-bottom: none;
  }
  
  .top-three {
    font-weight: bold;
  }
  
  .rank {
    width: 30px;
    text-decoration: underline;
    text-align: center;
  }
  
  .name {
    flex-grow: 1;
    text-align: right;
    padding-right: 15px;
  }
  
  .score {
    width: 60px;
    text-align: left;
  }
  
  .crown {
    width: 20px;text-align: center;
    height: 15px;
    right: -6px;
    mask-repeat: no-repeat;
    position: absolute;
    mask-image: url(../assets/crown.svg);
  }
  
  .gold {
    background: gold;
  }
  
  .silver {
    background: silver;
  }
  
  .bronze {
    background: #cd7f32;
  }
  
  @media (max-width: 768px) {
    .leaderboard {
      width: 100%;
    }
  }
  </style>
  
  