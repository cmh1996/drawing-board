var canvasWidth = 800;
var canvasHeight = canvasWidth;
var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var isMouseDown = false;
var lastLoc = {x:0,y:0};
var lastTimeStamp = 0;
var lastLineWidth = -1;

var maxLineWidth = 30;
var minLineWidth = 1;
var maxV = 10;
var minV = 0.1;

drawGrid();

canvas.onmousedown = function(e){
    e.preventDefault();
    isMouseDown = true;
    lastLoc = windowToCanvas(e.clientX,e.clientY);
    lastTimeStamp = new Date().getTime();
}
canvas.onmouseup = function(e){
    e.preventDefault();
    isMouseDown = false;
}
canvas.onmouseout = function(e){
    e.preventDefault();
    isMouseDown = false;
}
canvas.onmousemove = function(e){
    e.preventDefault();
    if(isMouseDown){
        var curLoc = windowToCanvas(e.clientX,e.clientY);
        var curTimeStamp = new Date().getTime();

        var s = calcDistance(lastLoc,curLoc);//两点之间的距离
        var t = curTimeStamp - lastTimeStamp;//两点之间的时间

        //画
        var lineWidth = calcLineWidth(t,s); //根据时间和距离求速度，来得到linewidth

        cxt.beginPath();
        cxt.moveTo(lastLoc.x,lastLoc.y);
        cxt.lineTo(curLoc.x,curLoc.y);
        cxt.strokeStyle = 'black';
        cxt.lineWidth = lineWidth;
        cxt.lineCap = 'round';
        cxt.lineJoin = 'round';
        cxt.stroke();

        lastLoc = curLoc;
        lastTimeStamp = curTimeStamp;
        lastLineWidth = lineWidth;
    }
}
var clear = document.getElementById('clear_btn');
clear.onclick = function(e){
    cxt.clearRect(0,0,canvasWidth,canvasHeight);
    drawGrid();
}

//根据速度计算笔粗细
function calcLineWidth(t,s){
    var v = s/t;
    var resultLineWidth;
    if(v>=maxV){
        resultLineWidth = minLineWidth;
    }else if(v<=minV){
        resultLineWidth = maxLineWidth
    }else{
        resultLineWidth = maxLineWidth - (v-minV)/(maxV-minV)*(maxLineWidth-minLineWidth)
    }
    
    if(lastLineWidth === -1){
        return resultLineWidth;
    }
    return lastLineWidth*2/3 + resultLineWidth*1/3;
}

//计算两点之间的距离
function calcDistance(loc1,loc2){
    return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x) + (loc1.y-loc2.y)*(loc1.y-loc2.y))
}


//转变为canvas内的坐标
function windowToCanvas(x,y){
    var bbox = canvas.getBoundingClientRect();
    return {x:Math.round(x-bbox.left),
            y:Math.round(y-bbox.top)};
}

function drawGrid(){
    cxt.save();
    cxt.strokeStyle = 'rgb(230,11,9)';

    //画外层边框
    cxt.beginPath();
    cxt.moveTo(3,3);
    cxt.lineTo(canvas.width-3,3);
    cxt.lineTo(canvas.width-3,canvas.height-3);
    cxt.lineTo(3,canvas.height-3);
    cxt.closePath();
    cxt.lineWidth = 6;

    cxt.stroke();

    //画米字格
    cxt.beginPath();
    cxt.moveTo(0,0);
    cxt.lineTo(canvas.width,canvas.height);

    cxt.moveTo(canvas.width,0);
    cxt.lineTo(0,canvas.height);

    cxt.moveTo(canvas.width/2,0);
    cxt.lineTo(canvas.width/2,canvas.height);

    cxt.moveTo(0,canvas.height/2);
    cxt.lineTo(canvas.width,canvas.height/2);

    cxt.lineWidth = 1;
    cxt.stroke();
    cxt.restore();
}
