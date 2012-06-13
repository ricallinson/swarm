
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
                    if (this.edges.top === true) {
                        this.want = this.want + 1;
                    }
                }
            } catch (e) {}
            try {
                if (this.edges.right === false) {
                    this.edges.right = map[pos.y][pos.x + 1] ? true : false;
                    if (this.edges.right === true) {
                        this.want = this.want + 1;
                    }
                }
            } catch (e) {}
            try {
                if (this.edges.bottom === false) {
                    this.edges.bottom = map[pos.y + 1][pos.x] ? true : false;
                    if (this.edges.bottom === true) {
                        this.want = this.want + 1;
                    }
                }
            } catch (e) {}
            try {
                if (this.edges.left === false) {
                    this.edges.left = map[pos.y][pos.x - 1] ? true : false;
                    if (this.edges.left === true) {
                        this.want = this.want + 1;
                    }
                }
            } catch (e) {}
        } else {
            throw new Error('TODO');
        }

        this.available = false;
    }

    return this._map;
}

Pixel.prototype.attach = function (pixel) {
    
    var i,
        attached = false,
        edge,
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

            this.want = this.want - 1;

            // With the pixel attched we can now program it.
            pixel.program(this.program(), pos);
        }
    }
};

exports.create = function() {
    
    var pixel = new Pixel();

    /*
     * Is this pixel free to use by other pixels
     */
    pixel.available = true;

    /*
     * Holds the map for the pixel
     */
    pixel._map = null;

    /*
     * This is the pixels place in the real world
     */
    pixel.space = {
        x: 0,
        y: 0
    };

    /*
     * This is the pixels place in the map
     */
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

    pixel.want = 0;

    return pixel;
};
