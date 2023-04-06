


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const won = urlParams.get('w');

function go_game() {
    window.location.href = './index.html';
}

if(won == 'true') {
    //has won game

    document.getElementById('confetti').style.display = 'block';
    document.getElementById('emoji').innerHTML = '🎉';
    document.getElementById('message').innerHTML = 'You won!'

    startConfetti();

} else if(won == 'false') {
    //has lost game

    document.getElementById('confetti').style.display = 'none';
    document.getElementById('emoji').innerHTML = '😔';
    document.getElementById('message').innerHTML = 'BOT won! Better luck next time!'

}
