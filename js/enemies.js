class Enemy{
	constructor(tile, sprite, hp){
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
        this.offsetX = 0;                                                   
        this.offsetY = 0;
        this.damage = 1;
	}

    update(){
        this.doStuff();
    }

    doStuff(){
       let neighbors = this.tile.getAdjacentPassableNeighbors();
       
       neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

       if(neighbors.length){ // seatch shortest way to player
           neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
           let newTile = neighbors[0];
           this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
       }
    }

    getDisplayX(){                     
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){                                                                  
        return this.tile.y + this.offsetY;
    }  

	draw(){
        drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY());
        this.drawHp();

        this.offsetX -= Math.sign(this.offsetX)*(1/8);     
        this.offsetY -= Math.sign(this.offsetY)*(1/8);
	}

    drawHp(){
        for(let i=0; i<this.hp; i++){
            drawSprite(
                4,
                this.getDisplayX() + (i%6)*(5/32),   
                this.getDisplayY() - Math.floor(i/6)*(5/32)
            );
        }
    }



    tryMove(dx, dy){
        let newTile = this.tile.getNeighbor(dx,dy);
        if(newTile.passable){
            if(!newTile.enemy){
                if (newTile.heal && this.isPlayer) {
                    this.hp += 1;
                    newTile.heal = false;
                    newTile.sprite = 1;
                } else if (newTile.sword && this.isPlayer) {
                    this.damage += 1;
                    newTile.sword = false;
                    newTile.sprite = 1;
                }
                this.move(newTile);

            } else{
                if(this.isPlayer != newTile.enemy.isPlayer){
                    newTile.enemy.hit(this.damage);

                    shakeAmount = 5;

                    this.offsetX = (newTile.x - this.tile.x)/2;         
                    this.offsetY = (newTile.y - this.tile.y)/2;
                }
            }
            return true;
        }
    }

    hit(damage){
        this.hp -= damage;
        if(this.hp <= 0){
            this.die();
        }
    }

    die(){
        this.dead = true;
        this.tile.enemy = null;
        this.sprite = 1;
    }

    move(tile){
        if(this.tile){
            this.tile.enemy = null;
            this.offsetX = this.tile.x - tile.x;    
            this.offsetY = this.tile.y - tile.y;
        }
        this.tile = tile;
        tile.enemy = this;
    }


}

class Player extends Enemy{
    constructor(tile){
        super(tile, 0, 6);
        this.isPlayer = true;
    }

    tryMove(dx, dy){
        if(super.tryMove(dx,dy)){
            tick();
        }
    }
    tryHit(dx, dy) {
        let tilesAround = this.tile.getAllNeighbors();
        for (let i = 0; i < 4; i += 1) {
            if (tilesAround[i].passable) {
                if (tilesAround[i].enemy) {
                    tilesAround[i].enemy.hit(this.damage);
                }
            }
        }
        tick();
        return true;
    }
}

class Warrior extends Enemy{
    constructor(tile){
        super(tile, 3, 3);
    }
}