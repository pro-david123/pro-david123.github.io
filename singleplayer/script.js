
const kick_url = '../error.html';
const unshuffled_array = ['S','S','S',      'C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C',    'B','B','B','B','B',    'I','I','I','I','I','I','I','I','I','I',    'M','M', 'T','T','T','T'];
const won_url = './end_of_game.html?w=true';
const lost_url = './end_of_game.html?w=false';

let money_in_pile = 40;

//money, stack
let game_array = [[0,0], []];
let turn = 0;

let bot_old_money = 0;
let player_old_money = 0;

let drawn = false;

const starting_array = shuffleArray(unshuffled_array);
game_array[1] = starting_array.concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array);

console.log(game_array);
console.log('Starting Game...');
document.getElementById('thecard').addEventListener('click', draw_card);

document.getElementById('thecard').style.pointerEvents = 'all';
document.getElementById('thecard').style.cursor = 'pointer';

//CSS functions:

function load_dice_indicator() {
  document.getElementById('roll_indicator').style.bottom = "80%";
} function hide_dice_indicator() {
  document.getElementById('roll_indicator').style.bottom = "120%";
}

hide_dice_indicator();

function load_money(amount) {
  document.getElementById('stack-brown-money').innerHTML = '';

  for(let y = 0; y < amount; y++) {
      //Saved as money_bill1
      document.getElementById('stack-brown-money').innerHTML += '<div id="money_bill' + y + '"><img src="./assets/icons/bill.PNG" id="brown_money" class="bill"  style="transform: translate(' + (y).toString() + 'px, ' + (500 - (y * 2)).toString() + '%);"></div>';
  }

}

load_money(money_in_pile);

function load_turn_indicator() {
  document.getElementById('turn_indicator').style.bottom = "90%";
} function hide_turn_indicator() {
  document.getElementById('turn_indicator').style.bottom = "110%";
}

document.getElementById('turn_indicator').style.bottom = "90%";

hide_turn_indicator();

function createRisingDiv(text, sign) {
  const div = document.createElement("div");
  div.textContent = sign + ' $' + (text).toString();
  div.style.position = "fixed";
  div.style.bottom = "15%";
  div.style.left = "65%";
  div.style.transform = "translateX(-50%)";
  div.style.opacity = "1";
  div.style.transition = "all 1s ease-in-out";
  div.style.zIndex = "10000";

  div.style.fontSize = "50px";
  div.style.fontWeight = "bold";
  div.style.fontFamily = "Helvetica";

  let movement = '0%';

  if(sign == '+') {
      div.style.color = "#5b8970";
      movement = '25%';
  } else {
      div.style.color = "#c55a48";
      movement = '0%';
  }

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.bottom = movement;
    div.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(div);
    }, 1000);
  }, 100);
}

function createRisingDivPlayer(text, sign) {
  setTimeout(() => {
      const div = document.createElement("div");
      div.textContent = sign + ' $' + (text).toString();
      div.style.position = "fixed";
      div.style.bottom = "90%";
      div.style.left = "20%";
      div.style.transform = "translateX(-50%)";
      div.style.opacity = "1";
      div.style.transition = "all 1s ease-in-out";
      div.style.zIndex = "10000";
  
      div.style.fontSize = "50px";
      div.style.fontWeight = "bold";
      div.style.fontFamily = "Helvetica";
  
      let movement = '0%';
  
      if(sign == '+') {
          div.style.color = "#5b8970";
          movement = '105%';
      } else {
          div.style.color = "#c55a48";
          movement = '75%';
      }
  
      document.body.appendChild(div);
    
      setTimeout(() => {
        div.style.bottom = movement;
        div.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(div);
        }, 1000);
      }, 100);
  }, 1500);
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}  

let dice = document.getElementById('dice');
var outputDiv = document.getElementById('diceResult');

function roll_dice_animation(result) {
  dice.dataset.side = result;
  dice.classList.toggle("reRoll");

  console.log(result);
}


//JS:

  //game start

  const num_rolled = rollDice();

  roll_dice_animation(num_rolled);

  const bot_num_rolled = rollDice();

  let started_sequence = false;

  document.getElementById('thecard').style.pointerEvents = 'none';
  document.getElementById('thecard').style.cursor = 'none';

  setInterval(() => {
    if(!started_sequence) {
      if(num_rolled < bot_num_rolled) {
        //bot starts
    
        load_dice_indicator();
        document.getElementById('who_rolls').innerHTML = 'BOT starts';
        document.getElementById('other_player').innerHTML = 'They rolled a ' + bot_num_rolled;
    
    
        setInterval(() => {
    
          if(drawn == false) {
            bot_draw_card();
          }
    
          drawn = true;
    
        }, 5000);
    
    
      } else {

        document.getElementById('thecard').style.pointerEvents = 'all';
        document.getElementById('thecard').style.cursor = 'pointer';
    
        load_dice_indicator();
        document.getElementById('who_rolls').innerHTML = 'You start!';
        document.getElementById('other_player').innerHTML = 'They rolled a ' + bot_num_rolled;
    
      }
    
      setInterval(() => {
        hide_dice_indicator();
        setInterval(() => {
            document.getElementById('roll_indicator').style.display = 'none';
        }, 500);
      }, 5000);
    }
    started_sequence = true;
  }, 1000);




function bot_draw_card() {
  const card_to_draw = game_array[1][turn];

  bot_old_money = game_array[0][1];

  game_array[0][1] = return_value(game_array[0][1], card_to_draw);

  if(bot_old_money < game_array[0][1]) {
    //gained money

    money_in_pile -= game_array[0][1] - bot_old_money;

    createRisingDivPlayer(game_array[0][1] - bot_old_money, '+');

  } else if(bot_old_money > game_array[0][1]) {
    //lost money

    money_in_pile += bot_old_money - game_array[0][1];

    createRisingDivPlayer(bot_old_money - game_array[0][1], '-');

  }

  setInterval(() => {
    document.getElementById('player_money_1').innerHTML = '$' + game_array[0][1];
  }, 5000)


  load_money(money_in_pile);

  if(game_array[0][1] >= 20) {
    //player lost

    move_card(1, card_to_draw);

    setTimeout(() => {
      window.location.href = lost_url;
    }, 1500);

  } else {

    move_card(1, card_to_draw);

    turn += 1;
  }

}

function draw_card() {
  
    //disabling card
    document.getElementById('thecard').style.pointerEvents = 'none';
    document.getElementById('thecard').style.cursor = 'none';

    hide_turn_indicator();

    const card_to_draw = game_array[1][turn];

    document.getElementById('back-card-image').src = './assets/icons/' + card_to_draw + '.PNG';

    document.getElementById("thecard").style.transform = "rotateY(180deg)";
  
    player_old_money = game_array[0][0];

    game_array[0][0] = return_value(game_array[0][0], card_to_draw);

    if(player_old_money < game_array[0][0]) {
      //gained money
  
      money_in_pile -= game_array[0][0] - player_old_money;

      createRisingDiv((game_array[0][0] - player_old_money), '+');
  
    } else if(player_old_money > game_array[0][0]) {
      //lost money
  
      money_in_pile += player_old_money - game_array[0][0];

      createRisingDiv((player_old_money - game_array[0][0]), '-');
  
    }

    load_money(money_in_pile);

    document.getElementById('player-stack-of-money').innerHTML = '';

    for(let y = 0; y < game_array[0][0]; y++) {
      document.getElementById('player-stack-of-money').innerHTML += '<img src="./assets/icons/bill.PNG" class="bill" id="bill_' + y +'" style="transform: translate(' + ((y) - 100).toString() + '%, ' + (85 - (y / 3)).toString() +'vh);">';
    }
                    
    document.getElementById('player_money_0').innerHTML = '$' + game_array[0][0];

    if(game_array[0][0] >= 20) {
      //player won

      move_card(0, card_to_draw);

      setTimeout(() => {
        window.location.href = won_url;
      }, 1000);

    } else {

      turn += 1;
      
      move_card(0, card_to_draw);

      //Bot draw card
      setTimeout(() => {
        console.log('Bot drawing card...');
  
  
        bot_draw_card();
      }, 1500);

    }

}

function return_value(money, card_to_draw) {

    let money_new = money;

    if(card_to_draw == 'S') {
      //+4

      money_new += 4;
      
    } else if(card_to_draw == 'C') {
        //+2

        money_new += 2;

    } else if(card_to_draw == 'B') {
        //-2

        if((money_new - 2) < 0) {

          money_new = 0;

        } else {

          money_new -= 2;

        }


    } else if(card_to_draw == 'I' && money_new >= 1) {
        //-1

        money_new -= 1;

    } else if(card_to_draw == 'M') {
        //+1

        money_new += 1;

    } else if(card_to_draw == 'T') {
      //-25%
      money_new = Math.floor(0.75 * money_new);

    }

    return money_new;

}

//HELPER FUNCTIONS
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  
//CSS FUNCTIONS
function move_card(player, card) {
  // Get the div to be animated
  let div = document.querySelector('#card');

  let targetElement = document.querySelector('#player' + player);

  if(player == 0) {
      
      // Calculate the starting and ending positions of the div
      setTimeout(() => {
          
          document.getElementById('card-image').src = './assets/icons/' + card + '.PNG';
              
          document.getElementById("thecard").classList.add('turned-over')
          document.getElementById("thecard").classList.remove('not-turned-over');

          document.getElementById("thecard").style.transform = "rotateY(0deg)";

          setTimeout(() => {

              document.getElementById("thecard").classList.remove('turned-over')
              document.getElementById("thecard").classList.add('not-turned-over');

          }, 500); 



            let startY =   window.innerHeight / 2 + document.getElementById('thecard').offsetHeight / 2;
            let endX = (document.getElementById('thecard').offsetLeft + (document.getElementById('thecard').offsetWidth / 2)) - (document.getElementById('card-image').offsetWidth / 2);
            let endY = 1400;

            // When the horizontal animation is finished, create an animation for the vertical movement
                let verticalAnimation = div.animate(
                [
                    { transform: `translate(${endX}px, ${startY}px)` },
                    { transform: `translate(${endX}px, ${endY}px)` },
                ],
                { duration: 1500 }
                );

                // When the vertical animation is finished, update the div's position
                verticalAnimation.onfinish = () => {
                div.style.transform = `translate(${endX - 100}px, ${endY}px)`;
                };


      }, 1500);


  } else {

      // Calculate the starting and ending positions of the div

      setTimeout(() => {

          
          document.getElementById('card-image').src = './assets/icons/' + card + '.PNG';

              
          document.getElementById("thecard").classList.add('turned-over')
          document.getElementById("thecard").classList.remove('not-turned-over');

          document.getElementById("thecard").style.transform = "rotateY(0deg)";

          setTimeout(() => {

              document.getElementById("thecard").classList.remove('turned-over')
              document.getElementById("thecard").classList.add('not-turned-over');

          }, 500); 

          let startX =  document.getElementById('thecard').offsetLeft + document.getElementById('thecard').offsetWidth / 2 - document.getElementById('card-image').offsetWidth / 2;
            let startY =   500;
            let endX = targetElement.offsetLeft + targetElement.offsetWidth / 2 - div.offsetWidth / 2;
            let endY = (targetElement.offsetTop + targetElement.offsetHeight / 2 - div.offsetHeight / 2) - 600;
            
            div.style.transform = `translate(${startX}px, ${startY}px)`;

            setTimeout(() => {
                // Create an animation for the horizontal movement of the div
                let horizontalAnimation = div.animate(
                    [
                    { transform: `translate(${startX}px, ${startY}px)` },
                    { transform: `translate(${endX - 100}px, ${startY}px)` },
                    ],
                    { duration: 1500 }
                );

                // When the horizontal animation is finished, create an animation for the vertical movement
                horizontalAnimation.onfinish = () => {
                    let verticalAnimation = div.animate(
                    [
                        { transform: `translate(${endX - 100}px, ${startY}px)` },
                        { transform: `translate(${endX - 100}px, ${endY}px)` },
                    ],
                    { duration: 1000 }
                    );

                    // When the vertical animation is finished, update the div's position
                    verticalAnimation.onfinish = () => {
                    div.style.transform = `translate(${endX - 100}px, ${endY}px)`;
                    
                    document.getElementById('thecard').style.pointerEvents = 'all';
                    document.getElementById('thecard').style.cursor = 'pointer';

                    load_turn_indicator();
                    };
                };
            }, 1000);
      }, 1500);
  }

}

function quit_game() {
  window.location.href = '../index.html';
}
