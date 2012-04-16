(function(){
	var CROP={
    
};

function Selection(x, y, w, h){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;

    //extra variables for dragging calculation
    this.px=x;
    this.py=y;

    this.csize=6; //resize cube size
    this.csizeh=10;//resize cube size when hover

    this.hov=[false, false,false,false]; // hover status
    this.csizeList=[this.csize, this.csize, this.csize, this.csize]; //resize cube size
    this.drag=[false,false,false,false];//drag status
    this.dragAll=false;//drap wholw status
}

Selection.prototype.draw=function(){
    var canvas=document.getElementById("panel");
    var ctx=canvas.getContext("2d");
    
    ctx.strokeStyle="#000";
    ctx.lineWidth=2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    
    if(this.w>0 && this.h>0){
        ctx.drawImage(CROP.img, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
    }

    ctx.fillStyle="#fff";
    ctx.fillRect(this.x-this.csizeList[0], this.y-this.csizeList[0], this.csizeList[0]*2, this.csizeList[0]*2);
    ctx.fillRect(this.x + this.w - this.csizeList[1], this.y - this.csizeList[1], this.csizeList[1] * 2, this.csizeList[1] * 2);
    ctx.fillRect(this.x + this.w - this.csizeList[2], this.y + this.h - this.csizeList[2], this.csizeList[2] * 2, this.csizeList[2] * 2);
    ctx.fillRect(this.x - this.csizeList[3], this.y + this.h - this.csizeList[3], this.csizeList[3] * 2, this.csizeList[3] * 2);
}

function drawImage(){
    var canvas = document.getElementById("panel");
    var ctx=canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas
    ctx.drawImage(CROP.img, 0, 0, ctx.canvas.width, ctx.canvas.height);

}

function drawScene(){
    drawImage();
    
    CROP.selection.draw();
}

function getCropResult(){
    var selection=CROP.selection;
    var canvas=document.createElement("canvas");
    var ctx=canvas.getContext("2d");
    canvas.width=selection.w;
    canvas.height=selection.h;
    ctx.drawImage(CROP.img, selection.x,selection.y,selection.w,selection.h,0,0,selection.w,selection.h);
    var crop_result=$("#crop_result");
    crop_result.attr("width", selection.w);
    crop_result.attr("height", selection.h);
    var dataURI=canvas.toDataURL();
    crop_result.attr("src", dataURI);
}

function handleOnLoad(){
 CROP.img=new Image();
    CROP.img.src="./crop.jpg";
   
CROP.selection=new Selection(200,200,200,200);
    drawScene();
    $("#panel").mousemove(handleMouseMove);
    $("#panel").mousedown(handleMouseDown);
    $("#panel").mouseup(handleMouseUp);
	$("#crop").click(getCropResult);
}

function handleMouseMove(e){
    var selection=CROP.selection;
    var canvasOffset =$("#panel").offset();
    CROP.mouseX=Math.floor(e.pageX-canvasOffset.left);
    CROP.mouseY=Math.floor(e.pageY-canvasOffset.top);

    //in case of drag of whole selection
    if(selection.dragAll){
        selection.x=CROP.mouseX-selection.px;
        selection.y=CROP.mouseY-selection.py;
    }

    for(var i=0;i<4;++i){
        selection.hov[i]=false;
        selection.csizeList[i]=selection.csize;
    }
    
    // hovering over resize cubes
        if (CROP.mouseX > selection.x - selection.csizeh && CROP.mouseX < selection.x + selection.csizeh &&
            CROP.mouseY > selection.y - selection.csizeh && CROP.mouseY < selection.y + selection.csizeh) {

            selection.hov[0] = true;
            selection.csizeList[0] = selection.csizeh;
        }
        if (CROP.mouseX > selection.x + selection.w-selection.csizeh && CROP.mouseX < selection.x + selection.w + selection.csizeh &&
            CROP.mouseY > selection.y - selection.csizeh && CROP.mouseY < selection.y + selection.csizeh) {

            selection.hov[1] = true;
            selection.csizeList[1] = selection.csizeh;
        }
        if (CROP.mouseX > selection.x + selection.w-selection.csizeh && CROP.mouseX < selection.x + selection.w + selection.csizeh &&
            CROP.mouseY > selection.y + selection.h-selection.csizeh && CROP.mouseY < selection.y + selection.h + selection.csizeh) {

            selection.hov[2] = true;
            selection.csizeList[2] = selection.csizeh;
        }
        if (CROP.mouseX > selection.x - selection.csizeh && CROP.mouseX < selection.x + selection.csizeh &&
            CROP.mouseY > selection.y + selection.h-selection.csizeh && CROP.mouseY < selection.y + selection.h + selection.csizeh) {

            selection.hov[3] = true;
            selection.csizeList[3] = selection.csizeh;
        }

    // in case of dragging of resize cubes
        var iFW, iFH;
        if (selection.drag[0]) {
            var iFX = CROP.mouseX -selection.px;
            var iFY = CROP.mouseY - selection.py;
            iFW = selection.w + selection.x - iFX;
            iFH = selection.h + selection.y - iFY;
        }
        if (selection.drag[1]) {
            var iFX = selection.x;
            var iFY = CROP.mouseY - selection.py;
            iFW = CROP.mouseX - selection.px - iFX;
            iFH = selection.h + selection.y - iFY;
        }
        if (selection.drag[2]) {
            var iFX = selection.x;
            var iFY = selection.y;
            iFW = CROP.mouseX - selection.px - iFX;
            iFH = CROP.mouseY - selection.py - iFY;
        }
        if (selection.drag[3]) {
            var iFX = CROP.mouseX - selection.px;
            var iFY = selection.y;
            iFW = selection.w + selection.x - iFX;
            iFH = CROP.mouseY - selection.py - iFY;
        }

        if (iFW > selection.csizeh * 2 && iFH > selection.csizeh * 2) {
            selection.w = iFW;
            selection.h = iFH;

            selection.x = iFX;
            selection.y = iFY;
        }

        drawScene();
}

function handleMouseDown(e)
{
var selection=CROP.selection;
    var canvasOffset = $("#panel").offset();
        CROP.mouseX = Math.floor(e.pageX - canvasOffset.left);
        CROP.mouseY = Math.floor(e.pageY - canvasOffset.top);

        selection.px = CROP.mouseX - selection.x;
        selection.py = CROP.mouseY - selection.y;

        if (selection.hov[0]) {
            selection.px = CROP.mouseX - selection.x;
            selection.py = CROP.mouseY - selection.y;
        }
        if (selection.hov[1]) {
            selection.px = CROP.mouseX - selection.x - selection.w;
            selection.py = CROP.mouseY - selection.y;
        }
        if (selection.hov[2]) {
            selection.px = CROP.mouseX - selection.x - selection.w;
            selection.py = CROP.mouseY - selection.y - selection.h;
        }
        if (selection.hov[3]) {
            selection.px = CROP.mouseX - selection.x;
            selection.py = CROP.mouseY - selection.y - selection.h;
        }

        if (CROP.mouseX > selection.x + selection.csizeh && CROP.mouseX < selection.x+selection.w - selection.csizeh &&
            CROP.mouseY > selection.y + selection.csizeh && CROP.mouseY < selection.y+selection.h - selection.csizeh) {

            selection.dragAll = true;
        }

        for (i = 0; i < 4; i++) {
            if (selection.hov[i]) {
                selection.drag[i] = true;
            }
        }
}

function handleMouseUp(e)
{
var selection=CROP.selection;
    selection.dragAll = false;

        for (i = 0; i < 4; i++) {
            selection.drag[i] = false;
        }
        selection.px = 0;
        selection.py = 0;

}

$(document).ready(function(){
      handleOnLoad();
    });
})();