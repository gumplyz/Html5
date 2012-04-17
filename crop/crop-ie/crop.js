(function(){
    

var CROP={
    
};

function selection(){
    this.isMouseDown=false;
    this.div=$("#selection");
    this.div.css("width", 200);
    this.div.css("height", 200);

    var imgOffset=CROP.img.offset();
    this.div.css("left", imgOffset.left);
    this.div.css("top", imgOffset.top);

    function handleMouseDown(){
        this.isMouseDown=true;
    }

    function handleMouseUp(){
        this.isMouseDown=false;
    }
    
    function handleMouseMove(e){
        if(!this.isMouseDown){
            return;
        }
        //mouse down and move, means drag
        
    }
}

function handleOnLoad(){
    CROP.img=$("#panel");
    CROP.img.attr("src", "crop.jpg");

    CROP.selection=new selection();
   
}

    $(document).ready(function(){
      handleOnLoad();
    });

})();
