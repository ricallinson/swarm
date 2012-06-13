
function findClosestPixel(pixels, pixel) {

    var i, match,
        current,
        currentDist = 1000000,
        toX,
        toY,
        fromX = pixel.space.x,
        fromY = pixel.space.y;

    for (i in pixels) {
        current = pixels[i];

        if (current !== pixel && current.available) {
            toX = current.space.x;
            toY = current.space.y;

            var dx = fromX - toX;
            var dy = fromY - toY;
            var dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < currentDist) {
                currentDist = dist;
                match = current;
            }
        }
    }

    return match;
};

function movePixel(from, to) {

    var fromX = from.space.x,
        fromY = from.space.y,
        toX = to.space.x,
        toY = to.space.y;

    /*
     * First see if they are touching
     */

    if ((toX === fromX || toX === fromX + 1 || toX === fromX - 1) && (toY === fromY || toY === fromY + 1 || toY === fromY - 1)) {
        return true;
    }

    /*
     * If they are not then move them
     */

    if (toX <= fromX) {
        fromX = fromX - 1;
    } else {
        fromX = fromX + 1;
    }

    if (toY <= fromY) {
        fromY = fromY - 1;
    } else {
        fromY = fromY + 1;
    }

    if (fromX < 0) {
        fromX = 0;
    }

    from.space.x = fromX;
    from.space.y = fromY;

    return false;
}

exports.plotPixelsToXY = function (pixels, x, y) {
    var randY,
        randX,
        pixel,
        store = {};

    for (pixel in pixels) {

        do {
            randY = Math.floor(Math.random()*y);
            randX = Math.floor(Math.random()*x);

            if (!store[randY+':'+randX]) {
                store[randY+':'+randX] = true;
                pixels[pixel].space.x = randX;
                pixels[pixel].space.y = randY;
            }

        } while (!store[randY+':'+randX]);
    }
};

exports.cycle = function (pixels) {
    var i, pixel,
        matched = false,
        match;

    for (i in pixels) {
        pixel = pixels[i];
        if (pixel.want > 0) {
            match = findClosestPixel(pixels, pixel);
            if (!matched && match) {
                matched = true;
                if (movePixel(match, pixel)) {
                    pixel.attach(match);
                }
            }
        }
    }
};

exports.paint = function (pixels, maxX, maxY) {
    var frame = '',
        stack = {},
        pixel,
        x, y,
        pX, pY;

    /*
     * For each pixel if it within the arena draw it.
     */
    for (pixel in pixels) {
        pX = pixels[pixel].space.x;
        pY = pixels[pixel].space.y;

        if (pX <= maxX || pX >= 0 || pY <= maxY || pY >= 0) {
            stack[pX+':'+pY] = pixels[pixel].want.toString();
        }
    }

    /*
     * Now paint the frame
     */
    for (y = 0; y < maxY; y = y + 1) {
        frame = frame = frame + '\n';
        for (x = 0; x < maxX; x = x + 1) {
            frame = frame + (stack[x+':'+y] ? stack[x+':'+y] : ' ') + ' ';
        }
    }

    return frame;
};