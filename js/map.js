function generateLevel(){
    tryTo('generate map', function(){
        return generateTiles() == randomPassableTile().getConnectedTiles().length;
    });

    generateEnemies();
}

function generateTiles(){
    let countOfHeal = 10;
    let countOfSword = 2;
    let passableTiles=0;
    tiles = [];
    for(let i=0;i<numTiles;i++){
        tiles[i] = [];
        for(let j=0;j<numTiles;j++){
            if(Math.random() < 0.3 || !inBounds(i,j)) {
                tiles[i][j] = new Wall(i,j);
            }else if (i < numTiles / 2 && Math.random() < 0.05 && countOfHeal > 5) {
                tiles[i][j] = new Heal(i, j);
                countOfHeal -= 1;
                passableTiles += 1;
            
            } else if (i > numTiles / 2 && Math.random() < 0.05 && countOfHeal !== 0) {
                tiles[i][j] = new Heal(i, j);
                countOfHeal -= 1;
                passableTiles += 1;

            } else if (i < numTiles / 2 && Math.random() < 0.02 && countOfSword > 1 ) {
                tiles[i][j] = new Sword(i, j);
                countOfSword -= 1;
                passableTiles += 1;

            } else if (i > numTiles / 2 && Math.random() < 0.02 && countOfSword !== 0) {
                tiles[i][j] = new Sword(i, j);
                countOfSword -= 1;
                passableTiles += 1;

            } else {
                tiles[i][j] = new Floor(i,j);
                passableTiles += 1;
            }
        }
    }
    return passableTiles;
}

function inBounds(x,y){
    return x>0 && y>0 && x<numTiles-1 && y<numTiles-1;
}


function getTile(x, y){
    if(inBounds(x,y)){
        return tiles[x][y];
    }else{
        return new Wall(x,y);
    }
}

function randomPassableTile(){
    let tile;
    tryTo('get random passable tile', function(){
        let x = randomRange(0,numTiles-1);
        let y = randomRange(0,numTiles-1);
        tile = getTile(x, y);
        return tile.passable && !tile.enemy;
    });
    return tile;
}

function generateEnemies(){
    enemies = [];
    for(let i=0;i<numEnemies;i += 1){
        spawnEnemies();
    }
}

function spawnEnemies(){
    let enemy = new Warrior(randomPassableTile());
    enemies.push(enemy);
}