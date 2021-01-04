// screen objects
var board = document.getElementById("board");
var title = document.getElementById("title");
var cubeDiv = document.getElementById("cube_div");
var cube = document.getElementById("cube");
var startGame = document.getElementById("startGame");
var statusBar = document.getElementById("status_bar");
var qustions = document.getElementById("qustions");

// css
var dy = 140;
var wS = window.innerHeight;
var boardWidth = wS - dy;
var cubeSize = boardWidth / 10;

// cube
var gettingCube = false;

// qustions
var correctAns = -1;
var choseAns = false;
var qustionsOnScreen = false;

var qustionsArr = [
    "מה מסמל הil בסיומת .co.il ?",
    "כדי לענות תשובה להודעת דואר רק לשולח יש לבחור באפשרות:",
    "מה אפשר להסיק על אתר אינטרנט שכתובתו מסתיימת ב  - gov.il ?",
    "WWW זה רשאי תיבות ל..?",
    "מתי התרחש החיבור הראשון לאינטרנט בארץ ישראל?",
    "באיזה שנה נוצר אתר האינטרנט הראשון",
    "באיזה שנה נוצר החיבור הראשון לאינטרנט בעולם?",
    "הכתובת המיוחדת לכל אתר נקראת גם..?",
    "עיצוב אתרי רשת מתרחש בשפת",
];
var answersArr = [
    ["סיומת הניתנת לאתרים רשמיים (כגון אתרים של מיקרוסופט וכו')", "את המדינה", "לאיזה מכשירים האתר מותאם (טלפון/מחשב...)", "סוג הדפדפן ממנו התחברנו לאתר", 1],
    ["To", "Replay to all", "Replay", "Forward", 3],
    ["זה אתר אינטרנט של רשות עירונית", "אתר המנוהל ומתוחזק בידי אחד ממשרדי הממשלה", "זה אתר המנוהל על ידי בית ספר", "זה אתר המיועד רק לעובדי ממשלה", 2],
    ["Whole World Web", "Which World Web", "Whole Wide Web", "World Wide Web", 4],
    ["בשנת 1978", "בשנת 1982", "בשנת 1980", "בשנת 1991", 2],
    ["1991", "1975", "1966", "1984", 1],
    ["1960", "1948", "1975", "1979", 1],
    ["ARL", "LUR", "RUL", "URL", 4],
    ["XNL", "HTML", "C#", "Java", 2],
];
var qustionsUsed = [];

// gameplay
var ledders = [
    [[9, 3], [8, 7], [6, 7], [5, 1], [5, 9], [3, 1], [2, 6]],
    [[[7, 4], 25], [[5, 5], 46], [[5, 8], 49], [[3, 2], 63], [[3, 8], 69], [[1, 0], 81], [[0, 8], 92]]
];
var snakes = [
    [[7, 6], [6, 0], [5, 2], [4, 6], [3, 5], [2, 4], [1, 8], [0, 1]],
    [[[9, 4], 5], [[9, 2], 3], [[8, 2], 18], [[6, 9], 31], [[5, 4], 45], [[4, 2], 58], [[4, 7], 53], [[5, 0], 41]]
];
var players = [];
var isOn = "block";
var playersCount = 0;
var currentTurn = 0;
var gameOver = false;

// Player Object
function Player(index){
    this.skin = document.getElementById("player" + index);
    this.pos = [9, 0];
    if(index == 0)
        this.color = 'green';
    else if(index == 1)
        this.color = 'red';
    else if(index == 2)
        this.color = 'yellow';
    else
        this.color = 'blue';
    this.posNum = 1;
}

// method that sets the initial css of the screen
const setCss = (start) => {
    if(start){
        startGame.style.top = "50%";
        startGame.style.right = "50%";
        startGame.style.marginRight = -1 * (parseInt(startGame.clientWidth) / 2) + "px";
        startGame.style.marginTop = -1 * (parseInt(startGame.clientHeight) / 2) + "px";    
    }
    else{
        board.style.height = boardWidth + "px";
        board.style.width = boardWidth + "px";
        board.style.top = "50%";
        board.style.right = "50%";
        board.style.marginRight = -1 * (boardWidth / 2) + "px";
        board.style.marginTop = -1 * (boardWidth / 2) + "px";

        title.style.margin = (dy - title.clientHeight) / 2;

        cubeDiv.style.right = dy + "px";
        cubeDiv.style.top = dy + "px";

        statusBar.style.left = dy + "px";
        statusBar.style.top = dy + "px";
    }
}

// method that is updating players position on the board by his index
const updatePos = (index) => {
    let player = players[index];
    let cPos = player.pos;

    let right = cubeSize / 2 + cubeSize * (9 - cPos[1]);
    right -= parseInt(player.skin.width) * (index + 0.5);

    let top = cubeSize / 2 + cubeSize * cPos[0];
    top -= parseInt(player.skin.height) / 2;

    player.skin.style.right = right + "px";
    player.skin.style.top = top + "px";

    if(ledders[0].join("|").includes(String(player.pos)))
        isOn = "ledder";
    else if(snakes[0].join("|").includes(String(player.pos)))
        isOn = "snake";
}

const generateCube = () => {
    if(!gettingCube && !gameOver && !qustionsOnScreen){
        let count = 0, angle = 90, n;
        gettingCube = true;
        
        let inter = setInterval(function(){
            n = Math.floor(Math.random() * 6) + 1;
            count += 1;
            angle += 30;
            
            cube.src = `cube-${n}.png`;
            cube.style.transform = `rotateZ(${angle}deg)`;
            
            if(count == 12){
                clearInterval(inter);
                movePlayer(n);
            }
        }, 70);
    }
}

function movePlayer(steps){
    let index = currentTurn;
    let player = players[index];
    console.log("cube:", steps);

    if(player.pos[0] % 2 == 1)
        player.pos[1] += steps;
    else
        player.pos[1] -= steps;
    
    player.posNum += steps;
    if(player.pos[0] == 0 && player.pos[1] <= 0)
    {
        gameOver = true;
        player.pos = [0, 0];
        player.posNum = 100;
        alertTime(500, player.color.toUpperCase() + " Is The WINNER!");
        updatePos(index);
        setPostionsTable();
    }
    else if(player.pos[1] > 9 && player.pos[0] % 2 == 1){
        over = player.pos[1] - 9;
        player.pos[1] = 9 - (over - 1);
        player.pos[0] -= 1;
    }
    else if(player.pos[1] < 0 && player.pos[0] % 2 == 0){
        over = player.pos[1] * -1;
        player.pos[1] = over - 1;
        player.pos[0] -= 1;
    }
    
    if(!gameOver){
        updatePos(index);
        setPostionsTable();
        if(isOn != "block")
            askQustion();
        else{
            currentTurn++;
            if(currentTurn == playersCount)
                currentTurn = 0;
            setPostionsTable();
        }
        gettingCube = false;
    }
}

// methos that show the positions of the players
const setPostionsTable = () => {
    let poses = document.getElementById("positions");
    poses.innerHTML = "";
    for(let i = 0; i < players.length; i++){
        let border = ['1px solid black', 0];
        if(currentTurn == i)
            border = ['3px dashed white', 3];
        poses.innerHTML += `
        <tr>
            <td><div style='background-color: ${players[i].color}; width: 30px; height: 30px; border:${border[0]}; border-radius: ${border[1]}px'></div></td>
            <th style='font-size: 140%'>במשבצת ${players[i].posNum} </th>
        </tr>`;
    }
}

const alertTime = (time, text) => {
    let inter = setInterval(function(){
        alert(text);
        clearInterval(inter);
    }, time);
}

// methos that show a qustion on the screen
const askQustion = () => {
    choseAns = false;
    qustionsOnScreen = true;

    let newQus = Math.floor(Math.random() * qustionsArr.length);
    
    if(qustionsUsed.length == qustionsArr.length)
        qustionsUsed.length = 0;

    while(qustionsUsed.includes(newQus))
        newQus = Math.floor(Math.random() * qustionsArr.length);
    qustionsUsed.push(newQus);

    let thisQus = qustionsArr[newQus];
    let thisAnswers = answersArr[newQus];
    correctAns = thisAnswers[4] - 1;

    document.getElementById("qus").innerHTML = thisQus;
    for(let i = 1; i <= 4; i++)
        document.getElementById("ans" + i).innerHTML = thisAnswers[i - 1];

    qustions.style.display = "block";
    qustions.style.top = "50%";
    qustions.style.right = "50%";
    qustions.style.marginRight = -1 * (parseInt(qustions.clientWidth) / 2) + "px";
    qustions.style.marginTop = -1 * (parseInt(qustions.clientHeight) / 2) + "px";

    let opa = 10;
    let opacityInter = setInterval(function(){
        opa -= 1;
        cubeDiv.style.opacity = opa / 10;
        board.style.opacity = opa / 10;
        statusBar.style.opacity = opa / 10;
        if(opa == 4)
            clearInterval(opacityInter);
    }, 110);
}

function findInArr(arr, item){
    for(let k = 0; k < arr.length; k++)
        if(String(arr[k]) == String(item))
            return k;
}

// main function
function main(){
    playersCount = parseInt(document.getElementById("players").value);
    document.getElementById("gameObjs").style.display = "block";
    document.getElementById("startGame").style.display = "none";
    
    setCss(false);
    for(let i = 0; i < playersCount; i++)
        board.innerHTML += `<img id='player${i}' src='Player-${i}.png' class='player' />`;
    
    for(let k = 0; k < playersCount; k++){
        players.push(new Player(k));
        updatePos(k);
    }
    setPostionsTable();
    
    for(let i = 1; i <= 4; i++)
    {
        document.getElementById("ans" + i).onmouseover = () =>{
            if(!choseAns)
                document.getElementById("ans" + i).style.backgroundColor = "lightblue";
        }

        document.getElementById("ans" + i).onmouseout = () =>{
            if(!choseAns)
                document.getElementById("ans" + i).style.backgroundColor = "pink";
        }

        document.getElementById("ans" + i).onclick = () =>{
            if(!choseAns){
                choseAns = true;

                if(i - 1 == correctAns){
                    let lPos = findInArr(ledders[0], players[currentTurn].pos);
                    document.getElementById("ans" + i).style.backgroundColor = "green";
                    console.log(lPos + ": " + ledders[1][lPos]);
                    if(isOn == "ledder"){
                        players[currentTurn].pos = ledders[1][lPos][0];
                        players[currentTurn].posNum = ledders[1][lPos][1];
                    }
                }
                else{
                    let sPos = findInArr(snakes[0], players[currentTurn].pos);
                    document.getElementById("ans" + i).style.backgroundColor = "red";
                    console.log(sPos + ": " + snakes[1][sPos]);
                    if(isOn == "snake"){
                        players[currentTurn].pos = snakes[1][sPos][0];
                        players[currentTurn].posNum = snakes[1][sPos][1];
                    }
                }
                updatePos(currentTurn);
                isOn = "block";
                correctAns = -1;

                currentTurn++;
                if(currentTurn == playersCount)
                    currentTurn = 0;
                setPostionsTable();

                let inter = setInterval(function(){
                    clearInterval(inter);
                    
                    let opa = 10;
                    let interIn = setInterval(function(){
                        opa -= 1
                        qustions.style.opacity = opa / 10;
                        if(opa == 0){
                            clearInterval(interIn);
                            qustions.style.display = "none";
                            qustions.style.opacity = 1;
                            
                            for(let k = 1; k <= 4; k++)
                                document.getElementById("ans" + k).style.backgroundColor = "pink";

                            opa = 4;
                            let showBoard = setInterval(function(){
                                opa += 1
                                cubeDiv.style.opacity = opa / 10;
                                board.style.opacity = opa / 10;
                                statusBar.style.opacity = opa / 10;
                                if(opa == 10){
                                    clearInterval(showBoard);
                                    qustionsOnScreen = false;
                                }
                            }, 80);
                        }
                    }, 80);
                }, 400);
            }
        }
    }
}

const cheat = (pos) => {
    if(1 <= pos && pos < 100 && !gettingCube && !gameOver && !qustionsOnScreen){
        let row, column;
        if(pos % 10 != 0){
            row = 9 - Math.floor(pos / 10);
            if(row % 2 == 0){
                column = 10 - (pos % 10);
                if(column == 10)
                    column = 0;
            }
            else
                column = (pos % 10) - 1;
        }
        else{
            row = 10 - Math.floor(pos / 10);
            if(pos / 10 % 2 == 0)
                column = 0;
            else
                column = 9;
        }
    
        players[currentTurn].pos = [row, column];
        players[currentTurn].posNum = pos;
    
        updatePos(currentTurn);
        setPostionsTable();
        if(isOn != "block")
            askQustion();
        else{
            currentTurn++;
            if(currentTurn == playersCount)
                currentTurn = 0;
            setPostionsTable();
        }
    }
}

setCss(true);
