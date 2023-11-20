const LEN = 20; //num of generated asteroids
const greyColors = ["#808080", "#818589", "#D3D3D3", "#C0C0C0", "#708090", "#848884"]

var myGamePieces, redGamePiece

var ctx

if (typeof localStorage !== 'undefined') {
    localStorage.setItem('key', 'value');
    if(localStorage.getItem('longest time') === null) {
        localStorage.setItem('longest time', 0)
    }
    
  }

function startGame() {
    
    myGamePieces = [];
    redGamePiece = new component(30, 30, "red", (window.innerWidth - 20) / 2, (window.innerHeight - 20) / 2, 135, "redPiece")
    let xAxisStart = true
    for (let i = 0; i < LEN; i++) {
        let x, y
        if (xAxisStart === true) {
            let startPosition = [0, window.innerWidth - 20]
            x = startPosition[getRandomInt(0, 1)]
            y = getRandomInt(0, window.innerHeight - 20)
        } else {
            let startPosition = [0, window.innerHeight - 20]
            y = startPosition[getRandomInt(0, 1)]
            x = getRandomInt(0, window.innerWidth - 20)
        }
        myGamePieces.push(new component(30, 30, greyColors[getRandomInt(0, 5)], x, y, "greyPiece"));
        xAxisStart = !xAxisStart

    }
    myGamePieces.forEach(element => console.log(element.speed_x))

    currStartTime = new Date()
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        console.log("game started");
        this.canvas.id = "myGameCanvas";
        this.canvas.width = window.innerWidth - 20;
        this.canvas.height = window.innerHeight - 20;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 25);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed_x = Math.random() * 3 + 0.5;
    this.speed_y = Math.random() * 3 + 0.5;
    this.x = x;
    this.y = y;
    if (type === "greyPiece") {
        this.update = function () {
            ctx = myGameArea.context;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = color;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        }
        this.newPos = function () {
            if (this.x - this.width / 2 < 0)
                this.speed_x = Math.random() * 3 + 0.5;
            else if ((this.x + this.width / 2) >= myGameArea.context.canvas.width)
                this.speed_x = -(Math.random() * 3 + 0.5);
            if (this.y - this.height / 2 < 0)
                this.speed_y = -(Math.random() * 3 + 0.5);
            else if ((this.y + this.height / 2) >= myGameArea.context.canvas.height)
                this.speed_y = Math.random() * 3 + 0.5;
            this.x += this.speed_x;
            this.y -= this.speed_y;
        }
    } else {
        this.update = function () {
            ctx = myGameArea.context;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = color;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        }
        this.newPos = function () {
        }

    }

}

function updateGameArea() {
    myGameArea.clear();
    myGamePieces.forEach(element => {
        element.newPos();
    });
    myGamePieces.forEach(element => {
        element.update();
    });
    redGamePiece.newPos();
    redGamePiece.update();
    var canvas = document.getElementById("myGameCanvas");
    ctx = canvas.getContext("2d");
    ctx.font = "16px Arial";
    let showedTime = new Date() - currStartTime
    gameDuration = showedTime
    let miliSeconds = showedTime % 1000
    let seconds = Math.floor(showedTime / 1000)
    let minutes = Math.floor(seconds / 60)
    checkCoalision(gameDuration);
    ctx.fillText("Game time: " + prependZero(minutes, 2) + ":" + prependZero(seconds, 2) + "." + prependZero(miliSeconds, 3), myGameArea.canvas.width - 200, 30);
    let longestTime = localStorage.getItem("longest time")
    miliSeconds = longestTime % 1000
    seconds = Math.floor(longestTime / 1000)
    minutes = Math.floor(seconds / 60)
    ctx.fillText("Longest time: " + prependZero(minutes, 2) + ":" + prependZero(seconds, 2) + "." + prependZero(miliSeconds, 3), myGameArea.canvas.width - 200, 60);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


document.addEventListener("keydown", function (e) {
    console.log("pressed");
    if (e.key === "ArrowLeft") { //left
        console.log("pressed left");
        redGamePiece.x = redGamePiece.x - 3
    } else if (e.key === "ArrowRight") { //right
        redGamePiece.x = redGamePiece.x + 3
    } else if (e.key === "ArrowUp") { //up
        redGamePiece.y = redGamePiece.y - 3
    } else if (e.key === "ArrowDown") { //down
        redGamePiece.y = redGamePiece.y + 3
    }
    updateGameArea();
})

function checkCoalision(gameDuration) {
    myGamePieces.forEach(element => {

        if (rectanglesTouching(convertToCustomRectObject(element), convertToCustomRectObject(redGamePiece)) === true) {
            myGameArea.stop();
            checkBestResult(gameDuration)
            //wait 5 seconds
            if(ctx !== null) {
                console.log(ctx)
            }
            ctx.fillText("Your current game result is: " + gameDuration, 200, 200)
            // alert("After 5 seconds game will restart")
            
            waitForNextGame(5000)
            
            startGame()


        }
    })
}


function waitForNextGame(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

function rectanglesTouching(a, b) {

    if (a.x1 > b.x2 || b.x1 > a.x2) return false;
    if (a.y1 > b.y2 || b.y1 > a.y2) return false;
    return true;

}

function convertToCustomRectObject(element) {
    let topLeftX = element.x - element.width / 2
    let topLeftY = element.y - element.height / 2
    let rightDownX = element.x + element.width / 2
    let rightDownY = element.y + element.height / 2
    return new customedComponent(topLeftX, topLeftY, rightDownX, rightDownY)
}

function customedComponent(topLeftX, topLeftY, rightDownX, rightDownY) {
    this.x1 = topLeftX
    this.y1 = topLeftY
    this.x2 = rightDownX
    this.y2 = rightDownY
}




// Prepend zeros to the digits in stopwatch
function prependZero(time, length) {
    time = new String(time);    // stringify time
    return new Array(Math.max(length - time.length + 1, 0)).join("0") + time;
}

function checkBestResult(currDuration) {
    console.log("Current game duration is: " + currDuration)
    console.log("Longest game duration:" + localStorage.getItem("longest time"))
    if (parseInt(currDuration) > parseInt(localStorage.getItem("longest time"))) {
        localStorage.setItem("longest time", currDuration)
    }
}
