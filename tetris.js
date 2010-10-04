C=12;
f=[];
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
            frequency = Math.pow(2,n/C) * 440;
            t = j * (0.416 / 10000);
            w = 2 * Math.PI * frequency;

            v=limit(amplitude * Math.sin(t*w)) / damping;
            D+=String.fromCharCode(v & 255, v>>8 & 255)
        }
    }
    samples[P++]=new Audio("data:audio/wav;base64," + waveHeader + btoa(D))
}
for(e=i=252;i--;)
    f[i]=i%C&&i<240?(i+1)%C?r=0:'█<br>':'█';

t=p=4;
function d(c){
    for(q=p+[13,14,26,25][r%4],i=1;i<99;q+=((i*=2)==8?[9,-37,-9,37]:[1,C,-1,-C])[r%4])
        if('36cqrtx'.charCodeAt(t)&i)
            if(-c) {
                if(f[q])
                    return 1
            }
            else f[q]=c
}

/**
 * Move current block. Either by keypress if by timer tick
 */
function move(e){
    Q=[-1,0,1,C][e?e.keyCode-37:3]||0;
    d(0);
    p+=Q;
    r+=!Q;
    s=d(1);
    if(s)
        p-=Q,r-=!Q;
    d('▒');
    document.body.innerHTML=f.join('').replace(/0/g,'░');
    return s
}

onkeydown=move;
o=function(){
    P=P%96;
    for(_ in[1,2,3])
        samples[P++].play();
    if(move()){
        t=~~(7*Math.random()),p=r=4;
        e=d(1)?1e9:e;
        for(y=0;y<240;)
            if(f.slice(y,y+=C).join().indexOf('0')<0)
                f=f.slice(0,C).concat(f.slice(0,y-C),f.slice(y))
    }
    setTimeout(o,e*=0.997)
};
o()