
function Pixel() {
    
}

Pixel.prototype.program = function (map, pos) {

    if (map) {
        this._map = map;

        // If we were given a position start there
        if (pos) {

            this.pos = pos;

            try {
                if (this.edges.top === false) {
                    this.edges.top = map[pos.y - 1][pos.x] ? true : false;
                }
            } catch (e) {}
            try {
                if (this.edges.right === false) {
                    this.edges.right = map[pos.y][pos.x + 1] ? true : false;
                }
            } catch (e) {}
            try {
                if (this.edges.bottom === false) {
                    this.edges.bottom = map[pos.y + 1][pos.x] ? true : false;
                }
            } catch (e) {}
            try {
                if (this.edges.left === false) {
                    this.edges.left = map[pos.y][pos.x - 1] ? true : false;
                }
            } catch (e) {}
        } else {
            throw new Error('TODO');
        }

        this.find(true);
    }

    return this._map;
}

Pixel.prototype.attach = function (pixel) {
    
    var i, more = false, edge, attached = false,
        pos = {
            x: 0,
            y: 0
        };

    for (i in this.edges) {
        
        edge = this.edges[i];

        if (attached === false && edge === true) {
            // attach the given pixel
            switch(i) {
                case 'top':
                    this.edges.top = pixel;
                    pixel.edges.bottom = this;
                    pixel.space.x = this.space.x;
                    pixel.space.y = this.space.y - 1;
                    pos.x = this.pos.x;
                    pos.y = this.pos.y - 1;
                    break;
                case 'right':
                    this.edges.right = pixel;
                    pixel.edges.left = this;
                    pixel.space.x = this.space.x + 1;
                    pixel.space.y = this.space.y;
                    pos.x = this.pos.x + 1;
                    pos.y = this.pos.y;
                    break;
                case 'bottom':
                    this.edges.bottom = pixel;
                    pixel.edges.top = this;
                    pixel.space.x = this.space.x;
                    pixel.space.y = this.space.y + 1;
                    pos.x = this.pos.x;
                    pos.y = this.pos.y + 1;
                    break;
                case 'left':
                    this.edges.left = pixel;
                    pixel.edges.right = this;
                    pixel.space.x = this.space.x - 1;
                    pixel.space.y = this.space.y;
                    pos.x = this.pos.x - 1;
                    pos.y = this.pos.y;
                    break;
                default:
                    throw new Error('Edge error');
            }
            
            attached = true;

            // Check to see if we need more pixels
            for (i in this.edges) {
               if (this.edges[i] === true) {
                    more = true;
               }
            }

            // If all our edges are full stop finding pixels
            if (more === false) {
                this.find(false);
            }
            
            // With the pixel attched we can program it.
            pixel.program(this.program(), pos);
        }
    }
};

Pixel.prototype.find = function (find) {

    if (typeof find !== 'undefined') {
        this._finding = find;
        if (find === true) {
            this.icon = 'X';
            this.available(false);
        } else {
            this.icon = '0';
        }
    }

    return this._finding;
};

Pixel.prototype.available = function (find) {

    if (typeof find !== 'undefined') {
        this._available = find;
    }

    return this._available;
};

exports.create = function() {
    
    var pixel = new Pixel();

    pixel._available = true;

    pixel._finding = false;

    pixel._map = null;

    /*
     * This is the pixels place in the real world
     */
    pixel.space = {
        x: 0,
        y: 0
    };

    pixel.pos = {
        x: 0,
        y: 0
    };

    /*
     * These are the edges and the attached pixels (if there).
     */
    pixel.edges = {
        top: false,
        right: false,
        bottom: false,
        left: false
    };

    pixel.icon = '0';

    return pixel;
};
