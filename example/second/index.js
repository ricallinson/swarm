
var Pixel = require('../../lib/pixel'),
    engine = require('../../lib/engine'),
    pixels = [];

var map = [
    [0,1,0,0,1],
    [1,1,1,1,1],
    [0,1,0,0,1],
    [0,1,0,0,1],
    [0,1,0,1,1],
];

/*
 * Ganerate Pixels
 */
for (var i = 0; i < 50; i++) {
    pixels.push(Pixel.create());
}

/*
 * Plot pixels
 */
engine.plotPixelsToXY(pixels, 30, 30);

/*
 * Add seed pixel
 */
pixels[0].program(map, {x: 1, y: 0});
pixels[1].program(map, {x: 1, y: 0});

var counter = 0;
var id = setInterval(function () {
    if (counter >= 400) {
        clearInterval(id);
    }
    
    engine.cycle(pixels);
    
    frame = engine.paint(pixels, 30, 30);

    console.log('\033[2J');
    console.log('Frame: ' + (counter));
    console.log(frame);

    counter = counter + 1;
}, 20);