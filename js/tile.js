class Tile{
	constructor(x, y, sprite, passable){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
	}

    dist(other){
        return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
    }

	draw(){
        drawSprite(this.sprite, this.x, this.y);
	}
    getNeighbor(dx, dy){
        return getTile(this.x + dx, this.y + dy)
    }
    getAllNeighbors() {
        return [getTile(this.x + 1, this.y), getTile(this.x - 1, this.y),
                getTile(this.x, this.y + 1), getTile(this.x, this.y - 1)];
    }

    getAdjacentNeighbors(){
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ]);
    }

    getAdjacentPassableNeighbors(){
        return this.getAdjacentNeighbors().filter(t => t.passable);
    }

    getConnectedTiles(){
        let connectedTiles = [this];
        let frontier = [this];
        while(frontier.length){
            let neighbors = frontier.pop()
                                    .getAdjacentPassableNeighbors()
                                    .filter(t => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        return connectedTiles;
    }
}



class Floor extends Tile{
    constructor(x,y){
        super(x, y, 1, true);
    };
}

class Wall extends Tile{
    constructor(x, y){
        super(x, y, 2, false);
    }
}

class Heal extends Tile{
    constructor(x, y) {
        super(x, y, 5, true);
        this.heal = true;
    }
}

class Sword extends Tile {
    constructor(x, y) {
        super(x, y, 6, true);
        this.sword = true;

    }
}