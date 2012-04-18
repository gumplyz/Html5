(function(){
    

var CROP={
    
};

function selection(x,y,w,h){
    this.isMouseDown=false;
    this.x=x;//x coordinate relative to image not html document
    this.y=y;//y coordinate relative to image not html document
    this.w=w;
    this.h=h;
    this.px=0;
    this.py=0;

    this.div=$("#selection");
    this.div.css("width", 200);
    this.div.css("height", 200);

    var imgOffset=CROP.img.offset();
    this.div.css("left", imgOffset.left);
    this.div.css("top", imgOffset.top);

    this.canvas=$("#canvas");
    this.canvas.mousedown(handleMouseDown);
    this.canvas.mouseup(handleMouseUp);
    this.canvas.mousemove(handleMouseMove);
    var that=this;
    this.count=0;
    function isInsideSelection(x,y){
        if(x<that.x){
//            console.log("x<that.x");
            return false;
        }
        if(x>that.x+that.w){
//console.log("x>that.x");
            return false;
        }
        if(y<that.y){
//console.log("y<that.y");
            return false;
        }
        if(y>that.y+that.h){
//console.log("y>that.y"+y+" "+(that.y+that.h));
            return false;
        }
        return true;
    }
    function handleMouseDown(e){
        var canvasOffset = $("#panel").offset();
        CROP.mouseX = Math.floor(e.pageX - canvasOffset.left);
        CROP.mouseY = Math.floor(e.pageY - canvasOffset.top);

        if(!isInsideSelection(CROP.mouseX, CROP.mouseY)){
            return;
        }
        that.isMouseDown=true;

        that.px=CROP.mouseX-that.x;
        that.py=CROP.mouseY-that.y;
        console.log("mousedown");
      //  console.log("CROP.mouseY:"+CROP.mouseY+"that.py"+that.py+"canvasOffset.top"+canvasOffset.top);
//console.log("left:"+that.x+" top:"+that.y);
    }

    function handleMouseUp(){
        that.isMouseDown=false;
        that.px=0;
        that.py=0;
    }
    
    function handleMouseMove(e){
        if(!that.isMouseDown){
            return;
        }
        //mouse down and move, means drag
        var canvasOffset =$("#panel").offset();
        CROP.mouseX=Math.floor(e.pageX-canvasOffset.left);
        CROP.mouseY=Math.floor(e.pageY-canvasOffset.top);

        //in case of drag of whole selection
    //    console.log("mousemove");
  //      console.log("CROP.mouseY:"+CROP.mouseY+"that.py"+that.py+"canvasOffset.top"+canvasOffset.top);
        that.x=CROP.mouseX-that.px;
        that.y=CROP.mouseY-that.py;
//        console.log("left:"+that.x+" top:"+that.y);
        if(that.x<0){
            that.x=0;
        }
        var canvas=$("#panel");
        if(that.x+that.w>canvas.width()){
            that.x=canvas.width()-that.w-2;
        }
        if(that.y<0){
            that.y=0;
        }
        if(that.y+that.h>canvas.height()){
            that.y=canvas.height()-that.h-2;
        }
        that.div.css("left", that.x+canvasOffset.left);
        that.div.css("top", that.y+canvasOffset.top);
       
    }
}

function handleOnLoad(){
    CROP.img=$("#panel");
    CROP.img.attr("src", "crop.jpg");

    CROP.selection=new selection(0,0,200,200);
   
}

    $(document).ready(function(){
      handleOnLoad();
    });

})();
