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
    background: rgba(30, 30, 50, 0.95);
    border: 2px solid rgba(167, 139, 250, 0.3);
    border-radius: 20px;
    padding: 1.5rem;
    flex: 1;
    margin-bottom: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    animation: fadeInUp 0.6s ease;
  }
  
  .leaderboard:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(167, 139, 250, 0.3);
    border-color: rgba(167, 139, 250, 0.5);
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  h2 {
    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
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
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid rgba(167, 139, 250, 0.2);
    color: #e5e7eb;
    transition: all 0.3s ease;
  }
  
  li:hover {
    background: rgba(167, 139, 250, 0.1);
    padding-right: 1rem;
    padding-left: 1rem;
    border-radius: 8px;
  }
  
  li:last-child {
    border-bottom: none;
  }
  
  li:first-child {
    color: #c4b5fd;
    font-weight: 600;
    border-bottom: 2px solid rgba(167, 139, 250, 0.4);
  }
  
  .top-three {
    font-weight: bold;
    color: #f3f4f6;
    background: linear-gradient(90deg, rgba(167, 139, 250, 0.15) 0%, transparent 100%);
    border-left: 3px solid rgba(167, 139, 250, 0.5);
  }
  
  .top-three:nth-child(2) {
    border-left-color: #fbbf24;
  }
  
  .top-three:nth-child(3) {
    border-left-color: #9ca3af;
  }
  
  .top-three:nth-child(4) {
    border-left-color: #cd7f32;
  }
  
  .rank {
    width: 40px;
    text-decoration: underline;
    text-align: center;
    font-weight: 600;
  }
  
  .name {
    flex-grow: 1;
    text-align: right;
    padding-right: 15px;
  }
  
  .score {
    width: 60px;
    text-align: left;
    font-weight: 600;
    color: #fbbf24;
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
  
  