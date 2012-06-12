
function Pixel() {
    
}

Pixel.prototype.join = function (pixel) {
    
    pixel.available(false);
    pixel.find(true);
    pixel.move(this.space.x, this.space.y + 1);

    this.find(false);
};

Pixel.prototype.move = function (x, y) {

    this.space.x = x;
    this.space.y = y;

}

Pixel.prototype.find = function (find) {

    if (typeof find !== 'undefined') {
        this._finding = find;
        if (find) {
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

exports.create = function(HACK) {
    
    var pixel = new Pixel();

    pixel.HACK = HACK;

    pixel._available = true;

    pixel._finding = false;

    pixel.space = {
        x: 0,
        y: 0
    };

    pixel.icon = '0';

    return pixel;
};
