function setupCanvas(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = tileSize*(numTiles);
    canvas.height = tileSize*numTiles;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    
    ctx.imageSmoothingEnabled = false;
}

function drawSprite(sprite, x, y){
    ctx.drawImage(
        spritesheet,
        sprite*148,
        0,
        148,
        148,
        // x*tileSize,
        // y*tileSize,
        x*tileSize + shakeX,
        y*tileSize + shakeY,
        tileSize,
        tileSize
    );
}

function draw(){
    if(gameState == "running" || gameState == "dead" || gameState == 'win'){ 
        ctx.clearRect(0,0,canvas.width,canvas.height);

        screenshake();

        for(let i=0;i<numTiles;i++){
            for(let j=0;j<numTiles;j++){
                getTile(i,j).draw();
            }
        }

        for(let i=0;i<enemies.length;i++){
            enemies[i].draw();
        }

        player.draw();

        drawText("Testing: ", 30, false, 40, "violet");
    }

    // if (gameState == 'dead') {
    // }
}

function screenshake(){
    if(shakeAmount){
        shakeAmount--;
    }
    let shakeAngle = Math.random()*Math.PI*2;
    shakeX = Math.round(Math.cos(shakeAngle)*shakeAmount);
    shakeY = Math.round(Math.sin(shakeAngle)*shakeAmount);
}



function tick(){
    for(let k=enemies.length-1;k>=0;k--){
        if(!enemies[k].dead){
            enemies[k].update();
        } else{
            enemies.splice(k,1);
        }
    }
    if(player.dead){    
        gameState = "dead";
    }
    if (enemies.length === 0) {
        gameState = 'win';
    }
}

function showTitle(){                                          
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "title";

    drawText("Carnage", 70, true, canvas.height / 2 - 110, "white");
    drawText("by Wedwyn", 30, true, canvas.height / 2 - 50, "white");
    drawText("Use WASD to move, space to attack all enemies on neighboring tiles", 20, true, canvas.height / 2, "white");
    drawText("Press any button to start", 20, true, canvas.height - 50, "white");
}

function showDeadTitle() {
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "title";

    drawText("You died", 70, true, canvas.height/2 - 110, "white");
    drawText("Press any button to restart", 30, true, canvas.height/2 - 50, "white");
}

function showWinTitle() {
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "title";

    drawText("You Win!", 70, true, canvas.height / 2 - 110, "white");
    drawText("Press any button to restart", 30, true, canvas.height / 2 - 50, "white");

}

function startGame(){                                           
    startLevel(startingHp);

    gameState = "running";
}

function startLevel(playerHp){                          
    generateLevel();
    player = new Player(randomPassableTile());
    player.hp = playerHp;
}

function drawText(text, size, centered, textY, color){
    ctx.fillStyle = color;
    ctx.font = size + "px monospace";
    let textX;
    if(centered){
        textX = (canvas.width-ctx.measureText(text).width)/2;
    }else{
        textX = canvas.width-tileSize+25;
    }

    ctx.fillText(text, textX, textY);
}