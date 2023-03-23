//Code Written by David - Fiverr Freelancer

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const local_game_id = urlParams.get('p');
const players_for_start = 2;
const kick_url = '[Your website url]';
const unshuffled_array = ['S','S','S',      'C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C',    'B','B','B','B','B',    'I','I','I','I','I','I','I','I','I','I',    'M','M'];
const won_url = './end_of_game.html?w=true';
const lost_url = './end_of_game.html?w=false';

let view_id = '';
let player_num;
let global;
let playing = false;

let singleplayer = urlParams.get('s');

if(singleplayer == true) {
    singleplayer = true;
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

function join_game() {
    const game_num = document.getElementById('game_id').value;

    if(game_num < global.length && game_num >= 0) {
        window.location.href = window.location.href + '?p=' + game_num;
    } else if(global.length == 0) {
        window.location.href = window.location.href + '?p=' + game_num;
    }

}

function create_game() {
    window.location.href = window.location.href + '?p=' + global.length;
}

function single_player() {
    window.location.href = './singleplayer/index.html';
}

function update_visuals(game_array) {

    for(let x = 0; x < game_array[0]; x++) {
        if(x == player_num) {
            document.getElementById('player_money_' + x).innerHTML = 'x ' + game_array[3][x];
        } else {
            document.getElementById('player_money_' + x).innerHTML = '$' + game_array[3][x];
        }
        
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

            let startY =   500;
            let endX = 1060;
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

            let startX =   960;
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
                };
            };
        }, 500);
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

        //Subscribes
        this.subscribe(this.id, 'player-join', this.player_join);
        this.subscribe(this.sessionId, "view-exit", this.reset);
        this.subscribe(this.id, 'card-drawn', this.card_drawn);

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
        this.publish(this.id, 'turn', [id, this.global_array]);

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

        } else {

            document.getElementById('thecard').style.pointerEvents = 'none';
            document.getElementById('thecard').style.cursor = 'default';

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

    }

    reset_check(id) {
        console.log('checking reset. Value obtained: ' + id);
        if(local_game_id == id) {
            window.location.href = kick_url;
        }
    }

    update_players() {

        if(!playing) {
            document.getElementById('game_id_waiting_display').innerHTML = 'ID: ' + local_game_id;
            document.getElementById('players_waiting_display').innerHTML = 'Waiting for player...';
        }

        this.future(100).update_players();

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
