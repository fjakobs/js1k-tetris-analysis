M=Math;
C=12;
f=[];
R=[];
S='slice';
for(P=0;P<96;){
    k="/SN;__/NK;OL/QN;__/OL;NK4L@@_C4_G@OL4SO@__4QN@OL3NB?_G3_K?OL/QN;__/SK;__4OL@__4LC@_G4LC@_G4_C@_G".charCodeAt(P);
    D="\0\0";
    for(j=0;k<95&&j<1e4;){
        v=M.max(-1e4,M.min(1e4,1e6*M.sin(j*M.pow(2,k/C)/695)))/M.exp(j++/5e3);
        D+=String.fromCharCode(v&255,v>>8&255)
    }
    R[P++]=new Audio("data:audio/wav;base64,UklGRgAAAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YSBO"+btoa(D))
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

function m(e){
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

onkeydown=m;
o=function(){
    P=P%96;
    for(_ in[1,2,3])
        R[P++].play();
    if(m()){
        t=~~(7*M.random()),p=r=4;
        e=d(1)?1e9:e;
        for(y=0;y<240;)
            if(f[S](y,y+=C).join().indexOf('0')<0)
                f=f[S](0,C).concat(f[S](0,y-C),f[S](y))
    }
    setTimeout(o,e*=0.997)
};
o()