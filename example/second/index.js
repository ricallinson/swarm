
var arena,
    Pixel = require('../../lib/pixel'),
    pixels = [],
    counter = 0;

function makeArena(x, y) {
    var arena = [],
        maxX,
        maxY;

    for (maxY = 0; maxY < y; maxY = maxY + 1) {
        arena[maxY] = [];
        for (maxX = 0; maxX < x; maxX = maxX + 1) {
            arena[maxY][maxX] = null;
        }
    }

    return arena;
}

function addPixelsToArena(pixels, arena) {
    var y = arena.length - 1,
        x = arena[0].length - 1,
        randY,
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
}

function findClosestPixel(pixels, pixel) {

    var i, match,
        current,
        currentDist,
        toX,
        toY,
        fromX = pixel.space.x,
        fromY = pixel.space.y;

    for (i in pixels) {
        current = pixels[i];

        if (current.available()) {
            toX = current.space.x;
            toY = current.space.y;

            var dx = toX - fromX;
            var dy = toY - fromY;
            var dist = Math.sqrt(dx*dx + dy*dy);

            if (!currentDist || dist < currentDist) {
                currentDist = dist;
                match = current;
            }
        }
    }

    return match;
}

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

function cycle(pixels) {
    var i, pixel,
        match;
    
    for (i in pixels) {
        pixel = pixels[i];
        if (pixel.find()) {
            match = findClosestPixel(pixels, pixel);
            if (match) {
                if (movePixel(match, pixel)) {
                    pixel.attach(match);
                }
            }
        }
    }
}

function paint(arena, pixels, current) {
    var frame = '',
        pixel,
        x, y,
        pX, pY;

    /*
     * For each pixel if it within the arena draw it.
     */
    for (pixel in pixels) {
        pX = pixels[pixel].space.x;
        pY = pixels[pixel].space.y;

        if (arena[pY] && arena[pY][pX] === null) {
            arena[pY][pX] = pixels[pixel].icon;
        }
    }

    /*
     * Now paint the frame
     */
    for (y = 0; y < arena.length; y = y + 1) {
        frame = frame = frame + '\n';
        for (x = 0; x < arena[y].length; x = x + 1) {
            frame = frame + (arena[y][x] ? arena[y][x] : ' ') + ' ';
        }
    }

    console.log('\033[2J');
    console.log('Frame: ' + current);
    console.log(frame);
}

/*
 * Ganerate Pixels
 */
for (var i = 0; i < 20; i++) {
    pixels.push(Pixel.create());
}

pixels[0].program([[0,1,0],[1,1,1],[0,1,0],[0,1,0],[1,1,1]], {x: 1, y: 2});

/*
 * Make the arena
 */
arena = makeArena(30, 30);

addPixelsToArena(pixels, arena);

var id = setInterval(function () {
    if (counter >= 400) {
        clearInterval(id);
    }
    paint(makeArena(30, 30), pixels, counter);
    cycle(pixels);
    counter = counter + 1;
}, 20);