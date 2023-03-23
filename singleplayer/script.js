
const kick_url = '[Your website url]';
const unshuffled_array = ['S','S','S',      'C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C',    'B','B','B','B','B',    'I','I','I','I','I','I','I','I','I','I',    'M','M'];
const won_url = './end_of_game.html?w=true';
const lost_url = './end_of_game.html?w=false';

//money, stack
let game_array = [[0,0], []];
let turn = 0;

const starting_array = shuffleArray(unshuffled_array);
game_array[1] = starting_array.concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array).concat(starting_array);

console.log(game_array);
console.log('Starting Game...');
document.getElementById('thecard').addEventListener('click', draw_card);

document.getElementById('thecard').style.pointerEvents = 'all';
document.getElementById('thecard').style.cursor = 'pointer';

function bot_draw_card() {
  const card_to_draw = game_array[1][turn];

  game_array[0][1] = return_value(game_array[0][1], card_to_draw);

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

    const card_to_draw = game_array[1][turn];

    document.getElementById('back-card-image').src = './assets/icons/' + card_to_draw + '.PNG';

    document.getElementById("thecard").style.transform = "rotateY(180deg)";
  
    game_array[0][0] = return_value(game_array[0][0], card_to_draw);

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

          let startY =   500;
          let endX = window.innerWidth / 2;
          let endY = 1500;

          // When the horizontal animation is finished, create an animation for the vertical movement
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

                document.getElementById('player_money_0').innerHTML = 'x ' + game_array[0][0];

              };

      }, 500);


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

          let startX =   window.innerWidth / 2;
          let startY =   500;
          let endX = targetElement.offsetLeft + targetElement.offsetWidth / 2 - div.offsetWidth / 2;
          let endY = (targetElement.offsetTop + targetElement.offsetHeight / 2 - div.offsetHeight / 2) - 600;

          // Create an animation for the horizontal movement of the div
          let horizontalAnimation = div.animate(
              [
              { transform: `translate(${startX}px, ${startY}px)` },
              { transform: `translate(${endX - 100}px, ${startY}px)` },
              ],
              { duration: 1000 }
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
                
                document.getElementById('player_money_1').innerHTML = game_array[0][1] + '$';
                document.getElementById('thecard').style.pointerEvents = 'all';
                document.getElementById('thecard').style.cursor = 'pointer';

              };
          };
      }, 500);
  }

}

function quit_game() {
  window.location.href = '../index.html';
}