samples=[];

/**
 * format: pcm
 * num channels: 1
 * sample rate: 24kHz
 * byte rate: 48000 (SampleRate * NumChannels * BitsPerSample/8)
 * block align: 2 (NumChannels * BitsPerSample/8)
 * bits per sample: 16
 *
 * Subchunk2Size: 20000 bytes
 * duration = 416ms
 */
 
function limit(value) {
    return Math.max(-10000, Math.min(10000, value));
}
 
waveHeader = "UklGRgAAAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YSBO";
for(P=0;P<96;){
    k="/SN;__/NK;OL/QN;__/OL;NK4L@@_C4_G@OL4SO@__4QN@OL3NB?_G3_K?OL/QN;__/SK;__4OL@__4LC@_G4LC@_G4_C@_G".charCodeAt(P);
    D="\0\0";
    // value of 95 is silence
    if (k !== 95) {
        for(j=0;j<10000;){
            // damping = 1 .. 7.389
            // sample is attenuated towards the end
            var damping = Math.exp(j++/5000);
            var amplitude = 1000000;

            // http://en.wikipedia.org/wiki/Note
            n = k - 47 - 12;
            frequency = Math.pow(2,n/12) * 440;
            t = j * (0.416 / 10000);
            w = 2 * Math.PI * frequency;

            v=limit(amplitude * Math.sin(t*w)) / damping;
            D+=String.fromCharCode(v & 255, v>>8 & 255)
        }
    }
    samples[P++]=new Audio("data:audio/wav;base64," + waveHeader + btoa(D))
}

// initialize playing field
// one dimensional array[12*21] of strings. Stores current game state and is 
// used to generate the HTML.
field=[];
columns=12;

for (var row=0; row<21; row++) {
    for (var column=0; column<columns; column++) {
        var i = column + row * columns;
        // if cell is not bottom or left border
        if (column > 0 && row < 20)
            // if cell is not right border
            if (column != columns-1)
                field[i] = 0
            else 
                field[i] = '█<br>';
        else
            field[i] = '█'
    }
}
    
rotation = 0;
blockType = 4;
position = 4;

/**
 * This function has three purposes:
 * 
 * 1. (c=1) Check for collision of the current block with the playing field
 * 2. (c=0) Remove the block from the playing field
 * 3. (c='▒') draw the black on the playing field
 * 
 * @param {Integer|String} c If set to 0 or a string replace the current block 
 *     with c in the playing field array, otherwise check for collision
 * @return {Integer} returns 1 if a collision is detected and 'undefined' otherwise
 */
function d(c) {
    var cell = position + [13,14,26,25][rotation%4];
    for(i=1; i<99; i*=2) {
        cell += (i==8?[9,-37,-9,37]:[1,columns,-1,-columns])[rotation%4]
        // the characters are bit masks for the blocks:
        // 110011  110110  1100011  1110001  1110010  1110100  1111000
        // ##      ##        ##       #       #       #        
        // ##       ##     ##       ###      ###      ###      ####
        var block = '36cqrtx'.charCodeAt(blockType);
        if(block & i)
            if(-c) {
                // collision
                if(field[cell])
                    return 1
            }
            else field[cell] = c
    }
}

function clear() {
    d(0);
}

function draw() {
    d('▒');
}

function collision() {
    return d(1);
}

/**
 * Move current block - either by keypress if by timer tick. Then redraw the 
 * playing field.
 */
function move(e){
    if (e)
        Q=[-1,0,1][e.keyCode-37]||0;
    else
        Q=columns;
        
    // remove block from playing field
    clear();
    
    // move and rotate block
    position+=Q;
    rotation+=!Q;
    
    // if collision at new position revert move/rotate
    s=collision();
    if(s) {
        position-=Q;
        rotation-=!Q;
    }
    
    // draw block at new position
    draw();
    
    // render playing field to screen
    document.body.innerHTML=field.join('').replace(/0/g,'░');
    
    // return collision
    return s
}

onkeydown=move;

timeout = 252;
tick=function(){
    // play next accord
    P=P%96;
    for(_ in[1,2,3])
        samples[P++].play();
    
    // move block down
    if(move()) {
        // if collision occured initialize new block
        blockType=Math.floor(7*Math.random());
        position=4;
        rotation=4;
        
        // if the new block causes a collision the game is over
        // next tick timeout is 1e9
        timeout = collision() ? 1e9 : timeout;
        
        // iterate over all rows and remove full rows
        for(y=0; y<240;)
            if(field.slice(y,y+=columns).join().indexOf('0')<0)
                field=field.slice(0,columns).concat(field.slice(0,y-columns),field.slice(y))
    }
    // schedule next tick and increase speed slightly
    setTimeout(tick,timeout*=0.997)
};
tick()