//Code Written by David - Fiverr Freelancer

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const local_game_id = urlParams.get('p');
const players_for_start = 2;
const kick_url = './error.html';
const unshuffled_array = ['S','S','S',      'C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C',    'B','B','B','B','B',    'I','I','I','I','I','I','I','I','I','I',    'M','M', 'T','T','T','T'];
const won_url = './end_of_game.html?w=true';
const lost_url = './end_of_game.html?w=false';

let view_id = '';
let player_num;
let global;
let local = [];
let playing = false;

let singleplayer = urlParams.get('s');

if(singleplayer == true) {
    singleplayer = true;
}

let money_in_pile = 40;
let money_before = 0;
let money_player_before = 0;

//HELPER FUNCTIONS

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}  
  
//CSS FUNCTIONS

document.getElementById('game_id_display').style.display = 'none';
document.getElementById('player-stack-of-money').style.display = 'none';
document.getElementById('thecard').style.pointerEvents = 'none';

let dice = document.getElementById('dice');
var outputDiv = document.getElementById('diceResult');

function roll_dice_animation(result) {
    dice.dataset.side = result;
    dice.classList.toggle("reRoll");

    console.log(result);
}

function load_dice_indicator() {
    document.getElementById('roll_indicator').style.bottom = "80%";
} function hide_dice_indicator() {
    document.getElementById('roll_indicator').style.bottom = "120%";
}

hide_dice_indicator();

function load_turn_indicator() {
    document.getElementById('turn_indicator').style.bottom = "90%";
} function hide_turn_indicator() {
    document.getElementById('turn_indicator').style.bottom = "110%";
}

document.getElementById('turn_indicator').style.bottom = "90%";

hide_turn_indicator();

function join_game() {
    const game_num = document.getElementById('game_id').value;

    if(global[game_num] != null) {
        window.location.href = window.location.href + '?p=' + game_num;
    }

}

function load_money(amount) {
    document.getElementById('stack-brown-money').innerHTML = '';

    for(let y = 0; y < amount; y++) {
        //Saved as money_bill1
        document.getElementById('stack-brown-money').innerHTML += '<div id="money_bill' + y + '"><img src="./assets/icons/bill.PNG" id="brown_money" class="bill"  style="transform: translate(' + (y).toString() + 'px, ' + (500 - (y * 2)).toString() + '%);"></div>';
    }

}

load_money(money_in_pile);

function create_game() {

    let number = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111; // generate random number between 111111 and 999999
  
    // check if number is already in array
    while (global[number] != null) {
        number = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111; // generate new random number
    }

    window.location.href = window.location.href + '?p=' + number;
}

function single_player() {
    window.location.href = './singleplayer/index.html';
}

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

function update_visuals(game_array) {

    money_in_pile = 40;

    for(let x = 0; x < game_array[0]; x++) {

        if(x == player_num) {

            document.getElementById('player_money_' + x).innerHTML = '$' + game_array[3][x];
            document.getElementById('player-stack-of-money').innerHTML = '';

            money_in_pile -= game_array[3][x];

            for(let y = 0; y < game_array[3][x]; y++) {
                document.getElementById('player-stack-of-money').innerHTML += '<img src="./assets/icons/bill.PNG" class="bill" id="bill_' + y +'" style="transform: translate(' + ((y) - 100).toString() + '%, ' + (82.5 - (y / 3)).toString() +'vh);">';
            }

            if(money_before < game_array[3][x]) {
                //positive
                createRisingDiv((game_array[3][x] - money_before), '+');

            } else if(money_before > game_array[3][x]) {
                //negative
                createRisingDiv((money_before - game_array[3][x]), '-');

            }

            money_before = game_array[3][x];

        } else {

            document.getElementById('player_money_' + x).innerHTML = '$' + game_array[3][x];

            money_in_pile -= game_array[3][x];

            if(money_player_before < game_array[3][x]) {
                //positive
                createRisingDivPlayer((game_array[3][x] - money_player_before), '+');

            } else if(money_player_before > game_array[3][x]) {
                //negative
                createRisingDivPlayer((money_player_before - game_array[3][x]), '-');

            }
            
            money_player_before = game_array[3][x];

        }

        load_money(money_in_pile);

        console.log('Money left in pile: ' + money_in_pile);
        
    }

}

function move_card(player, card) {
    // Get the div to be animated
    let div = document.querySelector('#card');

    let targetElement = document.querySelector('#player' + player);

    if(player == player_num) {
        
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
            let endX = document.getElementById('thecard').offsetLeft + document.getElementById('thecard').offsetWidth / 2 - document.getElementById('card-image').offsetWidth / 2;
            let endY = 1500;

            // When the horizontal animation is finished, create an animation for the vertical movement
                let verticalAnimation = div.animate(
                [
                    { transform: `translate(${endX}px, ${startY}px)` },
                    { transform: `translate(${endX}px, ${endY}px)` },
                ],
                { duration: 1000 }
                );

                // When the vertical animation is finished, update the div's position
                verticalAnimation.onfinish = () => {
                div.style.transform = `translate(${endX - 100}px, ${endY}px)`;
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
                    { duration: 500 }
                );

                // When the horizontal animation is finished, create an animation for the vertical movement
                horizontalAnimation.onfinish = () => {
                    let verticalAnimation = div.animate(
                    [
                        { transform: `translate(${endX - 100}px, ${startY}px)` },
                        { transform: `translate(${endX - 100}px, ${endY}px)` },
                    ],
                    { duration: 500 }
                    );

                    // When the vertical animation is finished, update the div's position
                    verticalAnimation.onfinish = () => {
                    div.style.transform = `translate(${endX - 100}px, ${endY}px)`;
                    };
                };
            }, 1000);

        }, 100);
    }

  
}
function animate_money(player, card) {

}

function start_game(game_array) {
    console.log('Starting Game...');


    //Setting up the players part
    const location = document.getElementById('players');
    const location2 = document.getElementById('money');

    location.innerHTML = '';

    for(let x = 0; x < game_array[0]; x++) {

        if(game_array[1][x] == view_id) {

            player_num = x;

            location2.innerHTML += "<center><h1 class='player_money' id='player_money_" + x + "'>0$</h1></center>";
        
        } else {

            location.innerHTML += "<center><div id='player" + x + "' class='player_name_container_general'><h1 class='player_name'>" + game_array[2][x] + "</h1><h1 class='player_money' id='player_money_" + x + "'>0$</h1></div></center>";
        
        }
    }

}

class MyModel extends Croquet.Model {

    init(options) {

        super.init(options);

        //Saved as [[game 1]] -> global array
                    //[number of players, player ids, player names, money, stack, started, turn, drawn]

        this.global_array = [];
        this.views_array = [];
        this.rolled_array = [];

        //Subscribes
        this.subscribe(this.id, 'player-join', this.player_join);
        this.subscribe(this.sessionId, "view-exit", this.reset);
        this.subscribe(this.id, 'card-drawn', this.card_drawn);

        this.subscribe(this.id, 'dice-rolled', this.dice_rolled);

    }

    dice_rolled(data_array) {

        console.log("Rolling dice...")


        //local game id, player num, number rolled

        if(this.rolled_array[data_array[0]] == null) {

            this.rolled_array[data_array[0]] = [];

        }

        this.rolled_array[data_array[0]][data_array[1]] = data_array[2];

        if(this.rolled_array[data_array[0]][1] != null) {

            //both players rolled
            if(this.rolled_array[data_array[0]][0] < this.rolled_array[data_array[0]][1]) {
                //need to change places
                this.global_array[data_array[0]][6] = 1;
                this.publish(this.id, 'turn', [data_array[0], this.global_array]);

                //                                                      id, player won, 
                this.publish(this.id, 'both-die-rolled', [data_array[0], this.global_array[data_array[0]][6], this.rolled_array])

            } else {
                this.publish(this.id, 'turn', [data_array[0], this.global_array]);

                //                                                      id, player won, rolled
                this.publish(this.id, 'both-die-rolled', [data_array[0], this.global_array[data_array[0]][6], this.rolled_array])

            }

        }

        console.log(this.rolled_array);

    }

    card_drawn(array) {

        //0 -> view id
        //1 -> card drawn

        this.global_array[array[0]][7] += 1;    //adding 1 to the turn

        this.money_pos = this.global_array[array[0]][6];

        if(this.global_array[array[0]][0] - 1 == this.global_array[array[0]][6]) {
            
            this.global_array[array[0]][6] = 0;

        } else {

            this.global_array[array[0]][6] += 1;

        }

        if(array[1] == 'S') {
            //+4

            this.global_array[array[0]][3][this.money_pos] += 4;
            
        } else if(array[1] == 'C') {
            //+2

            this.global_array[array[0]][3][this.money_pos] += 2;

        } else if(array[1] == 'B') {
            //-2

            if((this.global_array[array[0]][3][this.money_pos] - 2) < 0) {

                this.global_array[array[0]][3][this.money_pos] = 0;

            } else {

                this.global_array[array[0]][3][this.money_pos] -= 2;

            }


        } else if(array[1] == 'I' && this.global_array[array[0]][3][this.money_pos] >= 1) {
            //-1

            this.global_array[array[0]][3][this.money_pos] -= 1;

        } else if(array[1] == 'M') {
            //+1

            this.global_array[array[0]][3][this.money_pos] += 1;

        } else if(array[1] == 'T') {
            //- 25%

            this.global_array[array[0]][3][this.money_pos] = Math.floor(this.global_array[array[0]][3][this.money_pos] * 0.75);
        }

        if(this.global_array[array[0]][3][this.money_pos] >= 20) {
            this.publish(this.id, 'won', [array[0], this.money_pos]);
        }

        this.publish(this.id, 'card-taken', [this.money_pos, array[1]])
        this.publish(this.id, 'turn', [array[0], this.global_array]);

    }

    player_join(formated_first_array) {

        this.local_game_id = formated_first_array[0];
        this.player_connecting_id = formated_first_array[1];

        if(this.global_array[formated_first_array[0]] != null) {

            this.num_of_players_format_array = this.global_array[this.local_game_id][0] - 1;

            //REMEMBER TO CHANGE

            if(this.global_array[this.local_game_id][0] == 1) {

                this.global_array[this.local_game_id][0] += 1;  //adding 1 to num of players
                this.global_array[this.local_game_id][1][1] = formated_first_array[1];             //pushing the id
                this.global_array[this.local_game_id][2][1] = 'Player ' + this.global_array[this.local_game_id][0];  //pushing the name
                this.global_array[this.local_game_id][3][1] = 0;

            } else if(this.global_array[this.local_game_id][0] == 2) {

                this.global_array[this.local_game_id][0] += 1;  //adding 1 to num of players
                this.global_array[this.local_game_id][1][2] = formated_first_array[1];             //pushing the id
                this.global_array[this.local_game_id][2][2] = 'Player ' + this.global_array[this.local_game_id][0];  //pushing the name
                this.global_array[this.local_game_id][3][2] = 0;

            } else if(this.global_array[this.local_game_id][0] == 3) {

                this.global_array[this.local_game_id][0] += 1;  //adding 1 to num of players
                this.global_array[this.local_game_id][1][3] = formated_first_array[1];             //pushing the id
                this.global_array[this.local_game_id][2][3] = 'Player ' + this.global_array[this.local_game_id][0];  //pushing the name
                this.global_array[this.local_game_id][3][3] = 0;

            }

            this.views_array[this.views_array.length] = [this.player_connecting_id, this.local_game_id];

            console.log('Updated Global Array:')
            console.log(this.global_array);

            console.log('Updated Views Array:')
            console.log(this.views_array);

            if(this.global_array[this.local_game_id][0] == players_for_start) {

                //start playing game
                this.commence_game(this.local_game_id);

            }

        } else {
            this.global_array[this.local_game_id] = [1, [formated_first_array[1]], ['Player 1'], [0], [], false, 0, 0];

            console.log('Updated Global Array:')
            console.log(this.global_array);

        }

    }

    commence_game(id) {

        //1 -> shuffle deck

        this.starting_array = shuffleArray(unshuffled_array);
        //4 rounds maby add more in future

        this.global_array[id][4] = this.starting_array.concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array).concat(this.starting_array);
        this.global_array[id][5] = true;

        this.commence_game_formatted_array = [id, this.global_array];

        this.publish(this.id, 'game-started', this.commence_game_formatted_array);
        
        //Change this:


    }

    reset(viewId) {

        console.log('Resetting... View id: ' + viewId);

        this.x_val = null;

        for(let x = 0; x < this.views_array.length; x++) {
            if(this.views_array[x][0] == viewId) {

                this.x_val = this.views_array[x][1];

                this.global_array[this.views_array[x][1]] = null;
            }
        }

        this.publish(this.id, 'reset', this.x_val);

    }

}

MyModel.register("MyModel");

class MyView extends Croquet.View {

    constructor(model) {

        super(model);

        this.sceneModel = model;
        this.global_array = this.sceneModel.global_array;
        global = this.global_array;
        this.game_array = [];

        
        if(local_game_id != null) {

            document.getElementById('initial').style.display = 'none';

            view_id = this.viewId

            this.game_array = this.global_array[local_game_id];
            local = this.global_array[local_game_id];

            this.bad = false;

            if(this.global_array[local_game_id] != null) {
                if(this.global_array[local_game_id][5] == true) {
                    
                    this.bad = true;

                    window.location.href = kick_url;
                }
            }

            if(!this.bad) {

                this.formated_first_array = [local_game_id, this.viewId];
                this.publish(this.sceneModel.id, 'player-join', this.formated_first_array);
                document.getElementById('thecard').addEventListener('click', this.draw_card.bind(this));

                //subscribes
                this.subscribe(this.sceneModel.id, 'reset', this.reset_check);
                this.subscribe(this.sceneModel.id, 'game-started', this.start_check);
                this.subscribe(this.sceneModel.id, 'turn', this.turn);
                this.subscribe(this.sceneModel.id, 'card-taken', this.card_animation);

                this.subscribe(this.sceneModel.id, 'both-die-rolled', this.roll_animation);

                this.subscribe(this.sceneModel.id, 'won', this.won_check);

                this.update_players();

            }

        } else {

            document.getElementById('bill').style.display = 'none';

            //show info boxes
            document.getElementById('info-boxes').style.display = 'block';
            document.getElementById('game_id_waiting_display').style.display = 'none';
            document.getElementById('players_waiting_display').style.display = 'none';

        }
    }

    roll_animation(array) {

        setInterval(() => {

            if(local_game_id == array[0]) {

                this.opponent = 0;
    
                if(player_num == 0) {
                    this.opponent = 1;
                }

    
                if(array[1] == player_num) {
    
                    //we start
                    load_dice_indicator();
    
                    document.getElementById('who_rolls').innerHTML = 'You start!';
                    document.getElementById('other_player').innerHTML = 'They rolled a ' + array[2][local_game_id][this.opponent];
    
                } else {
    
                    //they start
                    load_dice_indicator();
                    document.getElementById('who_rolls').innerHTML = 'Opponent starts';
                    document.getElementById('other_player').innerHTML = 'They rolled a ' + array[2][local_game_id][this.opponent];
    
                }
    
                setInterval(() => {
                    hide_dice_indicator();
                    setInterval(() => {
                        document.getElementById('roll_indicator').style.display = 'none';
                    }, 500);
                }, 5000);
    
            }

        }, 1500);


    }

    roll_dice() {

        this.num_rolled = rollDice();

        roll_dice_animation(this.num_rolled);

        this.publish(this.sceneModel.id, "dice-rolled", [local_game_id, player_num, this.num_rolled]);

    }

    won_check(data) {

        if(local_game_id == data[0]) {
            if(this.game_array[1][data[1]] == this.viewId) {
                //won the game
                document.getElementById('wrapper').pointerEvents = 'none';

                setTimeout(() => {
                    
                    window.location.href = won_url;

                }, 800);

            } else {
                document.getElementById('wrapper').pointerEvents = 'none';

                setTimeout(() => {

                    window.location.href = lost_url;

                }, 800);
            }
        }

    }

    card_animation(array) {
        //0 -> player
        //1 -> card

        move_card(array[0], array[1]);

    }

    draw_card() {

        this.card_to_draw = this.game_array[4][this.game_array[7]];

        document.getElementById('back-card-image').src = './assets/icons/' + this.card_to_draw + '.PNG';

        console.log('Label: card to draw');
        console.log(this.card_to_draw);
        console.log('Label: game array')
        console.log(this.game_array);

        document.getElementById("thecard").style.transform = "rotateY(180deg)";

        this.future(1000).wait_to_exe(this.card_to_draw);


    }

    wait_to_exe(card) {

        this.publish(this.sceneModel.id, 'card-drawn', [local_game_id, card]);   //Publish event

    }

    turn(array) {

        this.game_id = array[0];
        
        this.game_array = array[1][this.game_id];

        console.log('Game array after turn:');
        console.log(this.game_array)
    
        //Checking if our turn
        if(this.viewId == this.game_array[1][this.game_array[6]]) {

            //Our turn
            document.getElementById('thecard').style.pointerEvents = 'all';
            document.getElementById('thecard').style.cursor = 'pointer';

            load_turn_indicator();

        } else {

            document.getElementById('thecard').style.pointerEvents = 'none';
            document.getElementById('thecard').style.cursor = 'default';

            hide_turn_indicator();

        }

        update_visuals(this.game_array);

    }

    start_check(array) {

        this.game_array = array[1][local_game_id];
        if(local_game_id == array[0]) {
            start_game(this.game_array);
        }

        playing = true;
        document.getElementById('info-boxes').style.display = 'none';
        document.getElementById('player-stack-of-money').style.display = 'block';

        this.roll_dice();

    }

    reset_check(id) {
        console.log('checking reset. Value obtained: ' + id);
        if(local_game_id == id) {
            window.location.href = kick_url;
        }
    }

    update_players() {

        document.getElementById('game_id_display').style.display = 'block';

        if(!playing) {
            document.getElementById('game_id_waiting_display').innerHTML = local_game_id;
            document.getElementById('players_waiting_display').innerHTML = 'Waiting for players: 1/2';
        }

        this.future(1000).update_players();

    }

    

}

//Croquet session data
Croquet.Session.join({
    appId: "com.david-gs.david.microverse",
    apiKey: "1BH2pvso5j8J3m4JMNNzqi4pvMcpDe9NmDma16IHl",
    name: "unnamed", 
    password: "secret",
    model: MyModel, 
    view: MyView,
});
