
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
    var y = arena.length,
        x = arena[0].length,
        randY,
        randX,
        pixel;

    for (pixel in pixels) {
        
        do {
            randY = Math.floor(Math.random()*y);
            randX = Math.floor(Math.random()*x);
            
            if (arena[randY][randX] === null) {
                arena[randY][randX] = pixels[pixel];
            }
            
        } while (arena[randY][randX] === null);
    }
}

function findClosestPixel(arena, toX, toY) {

    var match,
        x, y,
        maxY = arena.length,
        maxX = arena[0].length;

    /*
     * Get the current pixel locations
     */
    for (y = 0; y < maxY; y = y + 1) {
        for (x = 0; x < maxX; x = x + 1) {
            if (x === toX && y === toY) {
                // nothing here yet
            } else {
                if (arena[y][x] && arena[y][x].available) {
                    // distance from enemy to to player
                    var dx = toX - x;
                    var dy = toY - y;
                    var dist = Math.sqrt(dx*dx + dy*dy);

                    if (!match) {
                        match = {
                            dist: dist,
                            x: x,
                            y: y
                        }
                    } else if (match.dist > dist) {
                        match.dist = dist;
                        match.x = x;
                        match.y = y;
                    }
                }
            }
        }
    }
//    console.log(toX, toY, match);//process.exit();
    return match;
}

function movePixel(arena, fromX, fromY, toX, toY) {

    var pixel = arena[fromY][fromX];

    if (!pixel) {
        throw new Error('No Pixel found at x:' + fromX + ' y:' + fromY);
    }

    /*
     * First see if they are touching
     */

    if ((toX === fromX || toX === fromX + 1 || toX === fromX - 1) && (toY === fromY || toY === fromY + 1 || toY === fromY - 1)) {
        return true;
    }

    /*
     * If they are not then move them
     */

    arena[fromY][fromX] = null;

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

    if (fromX > arena[0].length - 1) {
        fromX = arena[0].length - 1;
    }

    if (fromY < 0) {
        fromY = 0;
    }

    if (fromY > arena.length - 1) {
        fromY = arena.length - 1;
    }

    arena[fromY][fromX] = pixel;

    return false;
}

function cycle(arena) {
    var pixel,
        y, x,
        maxY = arena.length,
        maxX = arena[0].length,
        match,
        moved = false;

    for (y = 0; y < maxY; y = y + 1) {
        for (x = 0; x < maxX; x = x + 1) {
            if (moved !== true && arena[y][x] !== null) {
                pixel = arena[y][x];
                // Does the pixel require another pixel?
                if (pixel.find) {
                    // If yes, look around the pixel for one in range
                    match = findClosestPixel(arena, x, y);
                    // If we find one
                    if (match) {
                        // If yes, move it one cord closer and see if they are touching?
                        if (movePixel(arena, match.x, match.y, x, y)) {
                            // If they are touching, call join()
                            pixel.join(arena[match.y][match.x], function(fromX, fromY, toX, toY) {
                                movePixel(arena, fromX, fromY, toX, toY);
                            });
                        }
                        // Only move one at a time.
                        moved = true;
                    }
                }
            }
        }
    }
}

function paint(arena, current) {
    var frame = '',
        x, y;

    for (y = 0; y < arena.length; y = y + 1) {
        frame = frame = frame + '\n';
        for (x = 0; x < arena[y].length; x = x + 1) {
            frame = frame + (arena[y][x] ? (arena[y][x].find ? 'X' : '0') : ' ') + ' ';
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

pixels[pixels.length/2].find = true;

/*
 * Make the arena
 */
arena = makeArena(30, 30);

addPixelsToArena(pixels, arena);

var id = setInterval(function () {
    if (counter >= 400) {
        clearInterval(id);
    }
    paint(arena, counter);
    cycle(arena);
    counter = counter + 1;
}, 20);