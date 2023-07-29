// Modified with demon love by MarkusoOoO
// Original Pen by https://codepen.io/rattatat at https://codepen.io/rattatat/pen/mXqJEq
// Streamer bot connection variables
const ADDRESS = "127.0.0.1"; // IP of SB instance
const PORT = "8080"; // port of SB instance
const ENDPOINT = "/"; // endpoint of SB instance
const WEBSOCKET_URI = "ws://" + ADDRESS + ":" + PORT + ENDPOINT; 
const EVENT_LISTENER_NAMEID = "Slot machine"; // Can be anything
const ws = new WebSocket(WEBSOCKET_URI);

// Item Names
const itemOneName = "Lemon";
const itemTwoName = "Melon";
const itemThreeName = "Grapes";
const itemFourName = "Cherry";
const jackpotName = "MarkusoOoO";

// Item Image media
const itemOneImagePath = "./images/item1.png";
const itemTwoImagePath = "./images/item2.png";
const itemThreeImagePath = "./images/item3.png";
const itemFourImagePath = "./images/item4.png";
const itemFiveImagePath = "./images/item5.png"; // Jackpot image path

// Audio media
const insertCoinAudioPath = "./sounds/insertCoin.mp3";
const spinAudioPath = "./sounds/spin.mp3";
const spinEndAudioPath = "./sounds/spinEnd.mp3";
const lockAudioPath = "./sounds/lock.mp3";
const winAudioPath = "./sounds/win.mp3";
const bigwinAudioPath = "./sounds/bigWin.mp3";
const jackpotAudioPath = "./sounds/jackpot.mp3";
const jackpotWinAudioPath = "./sounds/jackpotWin.mp3";

Vue.component('slot-reel', {
  props: ['valueItemOne', 'valueItemTwo', 'valueItemThree', 'valueItemFour', 'valueItemFive', 'value', 'canlock'],
  data() {
    return {
      momentum: null,
      audio: {
        jackpot: new Audio(jackpotAudioPath),
        jackpotWin: new Audio(jackpotWinAudioPath),
        spin: new Audio(spinAudioPath),
        spinEnd: new Audio(spinEndAudioPath),
        lock: new Audio(lockAudioPath) },

      reelTileCount: 20,
      reelTileData: null,
      reelSourceData: [
        {
          name: itemOneName,
          value: 40,
          image: itemOneImagePath 
        },

        {
          name: itemTwoName,
          value: 80,
          image: itemTwoImagePath 
        },

        {
          name: itemThreeName,
          value: 160,
          image: itemThreeImagePath 
        },

        {
          name: itemFourName,
          value: 320,
          image: itemFourImagePath 
        },

        {
          name: jackpotName,
          value: 1240,
          image: itemFiveImagePath 
        }
      ],

	  // Depends on number of reels 3 reels => (0,1,2) => reelIndex: 2
      reelIndex: 2,
	  // Determines how many different types of items is on reels
      tile1Index: 0,
      tile2Index: 1,
      tile3Index: 2,
      tile4Index: 3,
      tile5Index: 4,
      locked: false };

  },
  beforeMount() {
    // Build up the reelTileData array with random tiles
    let frs = [];
    let count = this.reelTileCount;
    this.audio.spin.volume = 0.3;
    this.audio.spinEnd.volume = 0.8;
    this.audio.lock.volume = 0.2;
    this.audio.spin.currentTime = 0.2;
    // Method 1, random until count is reached
    // while (count > 0) {
    //   const fruitIndex = Math.floor(Math.random() * this.reelSourceData.length)
    //   const fruitObject = this.reelSourceData[fruitIndex]
    //   frs.push(fruitObject)
    //   count--
    // }

    // Recalculate values of items based on bet inserted
    this.reelSourceData[0].value = this.valueItemOne;
    this.reelSourceData[1].value = this.valueItemTwo;
    this.reelSourceData[2].value = this.valueItemThree;
    this.reelSourceData[3].value = this.valueItemFour;
    this.reelSourceData[4].value = this.valueItemFive;

    // Method 2, sort on value, use index to determine entry count, shuffle
    let reelSourceData = this.reelSourceData.slice(0);
    reelSourceData.sort((a, b) => b.value - a.value);
    reelSourceData.forEach((sd, i) => {
      let times = i + 1 + i; // 0+1+0=1, 3+2+3=8
      // if (sd.name === 'Bar') times += 40 // TEST
      while (times > 0) {
        frs.push(sd);
        times--;
      }
    });

    function shuffle(array) {
      var currentIndex = array.length,temporaryValue,randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    this.reelTileData = shuffle(frs);
  },
  mounted() {
    this.$el.addEventListener("transitionend", this.animateEnd);
  },
  computed: {},

  methods: {
    run() {
      console.log('Run method start!');
      this.recalculatePrices();
      if (!this.locked) {
        const min = 10;
        const max = 40;
        const momentum = Math.floor(Math.random() * (max - min + 1) + min);
        this.momentum = momentum;
        this.audio.spin.play();
        this.animate();
      } else {
        this.locked = false;
        this.$emit('stopped', this.reelTileData[this.reelIndex], true);
      }
    },
    recalculatePrices() {
      this.reelSourceData[0].value = this.valueItemOne;
      this.reelSourceData[1].value = this.valueItemTwo;
      this.reelSourceData[2].value = this.valueItemThree;
      this.reelSourceData[3].value = this.valueItemFour;
      this.reelSourceData[4].value = this.valueItemFive;
    },
    animate() {
      this.$el.classList.add('move');
    },
    animateEnd() {
      this.$el.classList.remove('move');
      this.reIndex();
      this.momentum = this.momentum - 1;
      if (this.momentum > 0) {
        setTimeout(this.animate, 10);
      } else {
        const reelTileData = this.reelTileData[this.reelIndex];
        this.$emit('stopped', reelTileData);
        if (reelTileData.name === jackpotName) {
          this.audio.jackpotWin.play();
        } else {
          this.audio.spinEnd.play();
        }
        this.audio.spin.pause();
        this.audio.spin.currentTime = 0.3;
      }
    },
    reIndex() {
      const end = this.reelTileData.length - 1; //this.reelTileCount - 1
      const index = this.reelIndex === 0 ? end : this.reelIndex - 1;
      // const index = this.index === end ? 0 : this.index + 1
      this.reelIndex = index;
      this.tile1Index = index === 1 ? end : index === 0 ? end - 1 : index - 2;
      this.tile2Index = index === 0 ? end : index - 1;
      this.tile3Index = index;
      this.tile4Index = index === end ? 0 : index + 1;
      this.tile5Index = index === end - 1 ? 0 : index === end ? 1 : index + 2;
    },
    lock() {
      if (this.canlock) {
        this.locked = !this.locked;
        this.audio.lock.play();
      } else {
        
      }
    }
  },


  template: 
    `<div class="Reel" :class="{'is-locked':locked}" @mousedown="lock()">
      <div class="Reel-inner">
        <img class="Reel-image" :src="reelTileData[tile1Index].image" />
        <img class="Reel-image" :src="reelTileData[tile2Index].image" />
        <img class="Reel-image" :src="reelTileData[tile3Index].image" />
        <img class="Reel-image" :src="reelTileData[tile4Index].image" />
        <img class="Reel-image" :src="reelTileData[tile5Index].image" />
      </div>  
    </div>` 
});

Vue.component('slot-machine', {
  data() {
    return {
      slotsPlayer: "empty",
      currency: "chimi",
      spend: 100,
      credits: 100,
      spinCost: 10,
      obsSceneName: null,
      obsSourceName: null,
      spinActionName: null,
      lockActionName: null,
      transferActionName: null,
      endgameActionName: null,
      forceEndgameActionName: null,
      cashoutActionName: null,
      reactionsActionName: null,
      win: 0,
      resultData: false,
      canlock: true,
      waslocked: false,
      audio: {
        jackpotWin: new Audio(jackpotWinAudioPath),
        win: new Audio(winAudioPath),
        insertCoin: new Audio(insertCoinAudioPath),
        bigwin: new Audio(bigwinAudioPath) 
      } 
    };
  },
  beforeMount() {
	  // Streamer bot connection
    ws.addEventListener("open", (event) => {	
	  console.log("Connected to Streamer.bot");

    // Subscribing to listen for all Actions triggered inside SB
	  ws.send(
	    JSON.stringify({
		  request: "Subscribe",
		  id: EVENT_LISTENER_NAMEID,
		  events: {
		    Raw: ["Action", "SubAction"]
		  }
	    })
	  );
	});
  },
  mounted() {
    // Disabling keydown listening - window.addEventListener('keydown', this.keydown);

    // Listening to all trafic on WS connection
    ws.addEventListener("message", (event) => {
      // Check if data is empty or it is from listener/generic doaction
      if (!event.data) return;
      const jsonData = JSON.parse(event.data);
      if (jsonData.id === EVENT_LISTENER_NAMEID) return;
      if (jsonData.id === "DoAction") return;
     
      const eventActionName = jsonData.data.name;

      // Check if game started with defined SubAction
      if (jsonData.event.type == "SubAction" && eventActionName == `Get temp global "slotsPlayer" to "slotsPlayer", with default value of 'empty'`) {
        const parentName = jsonData.data.parentName;
        const startActionName = jsonData.data.arguments.slotsStartActionName;
        if (parentName == startActionName) {
          this.spend = parseInt(jsonData.data.arguments.slotsBet);
          this.slotsPlayer = jsonData.data.arguments.user;
          this.credits = this.spend;
          this.spinCost = this.spend / 10;
          this.currency = jsonData.data.arguments.pointsname;
          this.obsSceneName = jsonData.data.arguments.slotsSceneName;
          this.obsSourceName = jsonData.data.arguments.slotsSourceName;
          this.spinActionName = jsonData.data.arguments.slotSpinActionName;
          this.lockActionName = jsonData.data.arguments.slotLockActionName;
          this.transferActionName = jsonData.data.arguments.slotTransferActionName;
          this.endgameActionName = jsonData.data.arguments.slotEndgameActionName;
          this.forceEndgameActionName = jsonData.data.arguments.slotForceEndgameActionName;
          this.cashoutActionName = jsonData.data.arguments.slotCashoutActionName; 
          this.reactionsActionName = jsonData.data.arguments.slotReactionsActionName;

          ws.send(
            JSON.stringify({
            request: "UnSubscribe",
            id: EVENT_LISTENER_NAMEID,
            events: {
              Raw: ["SubAction"]
            }
            })
          );
        }
      }

      if (jsonData.event.type == "Action") {
        // Force End the game for user
        if (eventActionName == this.forceEndgameActionName) {
          this.cashOut();
        }

        // Check if user initiating the command is same as slotsPlayer
        const commandUserName =  jsonData.data.arguments.user;
        if (commandUserName == this.slotsPlayer) {
          if (eventActionName === this.spinActionName) {        
            this.spin();
          }
          if (eventActionName === this.lockActionName) {
            const lockOptions = String(jsonData.data.arguments.rawInput);
  
            for (let i = 0; i < lockOptions.length; i++) {
              let reelNumber = lockOptions[i];
              switch (reelNumber) {
                case '1':
                  this.$refs.reel1.lock();
                  break;
                case '2':
                  this.$refs.reel2.lock();
                  break;
                case '3':
                  this.$refs.reel3.lock();
                  break;
                default:
                  console.log("We are getting invalid character from SB: " + reelNumber);
              }
            }
          }
          if (eventActionName === this.transferActionName) {
            this.takeWin();
          } 
          if (eventActionName === this.endgameActionName) {
            this.cashOut();
          }
        }
      }
      
    });
  },
  computed: {
    valueItemOne() {
      return this.spinCost * 4
    },
    valueItemTwo() {
      return this.spinCost * 8
    },
    valueItemThree() {
      return this.spinCost * 16
    },
    valueItemFour() {
      return this.spinCost * 32
    },
    valueItemFive() {
      return this.spinCost * 124
    },
    valueOneJackpot() {
      return this.spinCost * 3
    },
    valueTwoJackpot() {
      return this.spinCost * 18
    }
  },

  methods: {
    /* Disabling keydown method
    keydown(e) {
      console.log(e.which);
      const key = {
        one: 49,
        two: 50,
        three: 51,
        space: 32 };

      if (e.which === key.one) {
        this.$refs.reel1.lock();
        e.preventDefault();
      } else if (e.which === key.two) {
        this.$refs.reel2.lock();
        e.preventDefault();
      } else if (e.which === key.three) {
        this.$refs.reel3.lock();
        e.preventDefault();
      } else if (e.which === key.space) {
        this.spin();
        e.preventDefault();
      }
    },*/
    spin() {
      if (this.credits > 0 && !this.resultData) {
        this.resultData = [];
        this.credits = this.credits - this.spinCost;
        this.$refs.reel1.run();
        this.$refs.reel2.run();
        this.$refs.reel3.run();
      }
    },
    insertCoin() {
      this.audio.insertCoin.currentTime = 0;
      this.audio.insertCoin.play();
      this.credits += this.spinCost;
      this.spend += this.spinCost;
    },
    takeWin() {
      if (this.win > 0) {
        this.credits += this.win;
        this.win = 0;
      }
    },
    reelStopped(resultData, wasLocked) {
      if (wasLocked) this.waslocked = wasLocked;
      this.resultData.push(resultData);
      if (this.resultData.length === 3) {
        this.checkWin(this.resultData);
        if (this.waslocked) {
          this.waslocked = false;
          this.canlock = false;
        } else {
          this.canlock = true;
        }
      }
    },
    checkWin() {
      const v1 = this.resultData[0];
        if (this.resultData.length === 3) {// ;-)  
          const v2 = this.resultData[1];
          const v3 = this.resultData[2];
          if (v1.name === v2.name && v2.name === v3.name) {
            if (v1.value >= this.valueItemThree) {
              this.audio.bigwin.play();
            } else {
              this.audio.win.play();
            }
            this.win += v1.value;
            this.waslocked = true; // prevent lock after an unlocked win
          } else {

            const jackpot1 = v1.name === jackpotName;
            const jackpot2 = v2.name === jackpotName;
            const jackpot3 = v3.name === jackpotName;
            if (jackpot1 && jackpot2 || jackpot1 && jackpot3 || jackpot2 && jackpot3) {
              this.audio.bigwin.play();
              this.win += this.valueTwoJackpot;
              this.waslocked = true; // prevent lock after an unlocked win
            } else if (jackpot1 || jackpot2 || jackpot3) {
              // this.audio.win.play()
              // this.audio.barWin.play()
              this.win += this.valueOneJackpot;
              this.waslocked = true; // prevent lock after an unlocked win
            } else {
              if (this.win + this.credits == 0) {
                this.cashOut();
              }
            }
          }
        }
        this.resultData = false;
    },
    cashOut() {
      ws.send(JSON.stringify({
        request: 'DoAction',
        id: 'DoAction',
        action: {
            name: this.cashoutActionName,
        },
        args: {
            slotsWinnings: this.win + this.credits,
            slotsSpend: this.spend,
            slotsPlayer: this.slotsPlayer,
            slotsSceneName: this.obsSceneName,
            slotsSourceName: this.obsSourceName
        }
      }));
    }
  },

  template: `<div class="SlotMachine">
    <div class="SlotMachine-reels">
      <div class="SlotMachine-shadow"></div>
      <div class="SlotMachine-payline"></div>
      <slot-reel :value-item-one="valueItemOne" :value-item-two="valueItemTwo" :value-item-three="valueItemThree" :value-item-four="valueItemFour" :value-item-five="valueItemFive" ref="reel1" :canlock="canlock" @stopped="reelStopped"></slot-reel>
      <slot-reel :value-item-one="valueItemOne" :value-item-two="valueItemTwo" :value-item-three="valueItemThree" :value-item-four="valueItemFour" :value-item-five="valueItemFive" ref="reel2" :canlock="canlock" @stopped="reelStopped"></slot-reel>
      <slot-reel :value-item-one="valueItemOne" :value-item-two="valueItemTwo" :value-item-three="valueItemThree" :value-item-four="valueItemFour" :value-item-five="valueItemFive" ref="reel3" :canlock="canlock" @stopped="reelStopped"></slot-reel>
    </div>
    <div class="SlotMachine-stats">
      <div class="SlotMachine-coin" @mousedown="insertCoin()"></div>
      <div class="SlotMachine-stat is-credit">
        <div class="SlotMachine-statTitle">Credits</div>
        <div class="SlotMachine-statValue">{{ credits.toFixed(2) }} {{ currency }}</div>
        <div class="SlotMachine-statSub">spend {{spend.toFixed(2)}} {{ currency }}</div>
      </div>
      <div class="SlotMachine-stat is-win">
        <div class="SlotMachine-statTitle">Won</div>
        <div class="SlotMachine-statValue">{{ win.toFixed(2) }} {{ currency }}</div>
      </div>
    </div>
    <div class="SlotMachine-actions">
      <div>
        <p id="SlotMachine-playerNameTitle">Player:</p>
        <p class="SlotMachine-playerName">{{ slotsPlayer }}</p>
      </div>
      <button class="SlotMachine-button is-spin" @mousedown="spin()">!spin</button>
      <div class="SlotMachine-button is-win" :class="{'has-win':win}" @mousedown="takeWin()">!transfer</div>
      <button class="SlotMachine-button">!withdraw</button>     
    </div>
    <div class="Legend">
      <div class="Legend-item">
        <div class="Legend-itemTitle">{{ this.valueItemOne }} {{ currency }}</div>
        <img class="Legend-itemImage" src="./images/item1.png" />
        <img class="Legend-itemImage" src="./images/item1.png" />
        <img class="Legend-itemImage" src="./images/item1.png" />
      </div>
      <div class="Legend-item">
        <div class="Legend-itemTitle">{{ this.valueItemTwo }} {{ currency }}</div>
        <img class="Legend-itemImage" src="./images/item2.png" />
        <img class="Legend-itemImage" src="./images/item2.png" />
        <img class="Legend-itemImage" src="./images/item2.png" />
      </div>
      <div class="Legend-item">
        <div class="Legend-itemTitle">{{ this.valueItemThree }} {{ currency }}</div>
        <img class="Legend-itemImage" src="./images/item3.png" />
        <img class="Legend-itemImage" src="./images/item3.png" />
        <img class="Legend-itemImage" src="./images/item3.png" />
      </div>
      <div class="Legend-item">
        <div class="Legend-itemTitle">{{ this.valueItemFour }} {{ currency }}</div>
        <img class="Legend-itemImage" src="./images/item4.png" />
        <img class="Legend-itemImage" src="./images/item4.png" />
        <img class="Legend-itemImage" src="./images/item4.png" />
      </div>
      <div class="Legend-item">
        <div class="Legend-itemTitle">{{ this.valueOneJackpot }} {{ currency }}</div>
        <img class="Legend-itemImage" src="./images/item5.png" />
      </div>
      <div class="Legend-item">
        <div class="Legend-itemTitle">{{ this.valueTwoJackpot }} {{ currency }}</div>
        <img class="Legend-itemImage" src="./images/item5.png" />
        <img class="Legend-itemImage" src="./images/item5.png" />
      </div>      
      <div class="Legend-item">
        <div class="Legend-itemTitle">{{ this.valueItemFive }} {{ currency }}</div>
        <img class="Legend-itemImage" src="./images/item5.png" />
        <img class="Legend-itemImage" src="./images/item5.png" />
        <img class="Legend-itemImage" src="./images/item5.png" />
      </div>
    </div>
    <div class="Legend-tip">Add coins to add credit. Press space to Play. Click reel or press 1, 2 or 3 to lock. Brought to you by Timo & Lex Hofmeijer</div>
  </div>` 
});

var app = new Vue({
  el: '#app' });