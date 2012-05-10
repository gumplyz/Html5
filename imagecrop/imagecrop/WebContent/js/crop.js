(function() {

	var CROP = {

	};

	function selection(x, y, w, h) {
		this.isMouseDown = false;
		this.x = x;// x coordinate relative to image not html document
		this.y = y;// y coordinate relative to image not html document
		this.w = w;
		this.h = h;
		this.px = 0;
		this.py = 0;
		this.scale = 50;
		this.imgLeft = 0;
		this.imgTop = 0;

		this.div = $("#selection");
		this.div.css("width", 200);
		this.div.css("height", 200);

		var imgOffset = CROP.img.offset();
		this.div.css("left", imgOffset.left);
		this.div.css("top", imgOffset.top);

		this.canvas = $("#canvas");
		this.canvas.mousedown(handleMouseDown);

		var that = this;
		this.count = 0;
		function isInsideSelection(x, y) {
			if (x < that.x) {
				// console.log("x<that.x");
				return false;
			}
			if (x > that.x + that.w) {
				// console.log("x>that.x");
				return false;
			}
			if (y < that.y) {
				// console.log("y<that.y");
				return false;
			}
			if (y > that.y + that.h) {
				// console.log("y>that.y" + y + " " + (that.y + that.h));
				return false;
			}
			return true;
		}
		function handleMouseDown(e) {
			// console.log("mouseDown " + that.isMouseDown);
			var canvasOffset = $("#canvas").offset();
			CROP.mouseX = Math.floor(e.pageX - canvasOffset.left);
			CROP.mouseY = Math.floor(e.pageY - canvasOffset.top);

			if (!isInsideSelection(CROP.mouseX, CROP.mouseY)) {
				console.log("not inside");
				return;
			}
			that.isMouseDown = true;
			// console.log("mouseDown " + that.isMouseDown);
			that.px = CROP.mouseX - that.x;
			that.py = CROP.mouseY - that.y;
			// console.log("mousedown");
			// console.log("CROP.mouseY:"+CROP.mouseY+"that.py"+that.py+"canvasOffset.top"+canvasOffset.top);
			// console.log("left:"+that.x+" top:"+that.y);
			that.canvas.mouseup(handleMouseUp);
			that.canvas.mousemove(handleMouseMove);
			return false;
		}

		function handleMouseUp() {
			// console.log("mouseUp " + that.isMouseDown);
			that.isMouseDown = false;
			// console.log("mouseUp " + that.isMouseDown);
			that.px = 0;
			that.py = 0;
			that.canvas.unbind("mouseup", handleMouseUp);
			that.canvas.unbind("mousemove", handleMouseMove);
		}

		function handleMouseMove(e) {
			// console.log("mouseMove " + that.isMouseDown);
			if (!that.isMouseDown) {
				return;
			}
			// mouse down and move, means drag
			var canvasOffset = $("#canvas").offset();
			CROP.mouseX = Math.floor(e.pageX - canvasOffset.left);
			CROP.mouseY = Math.floor(e.pageY - canvasOffset.top);

			// in case of drag of whole selection
			// console.log("mousemove");
			// console.log("CROP.mouseY:" + CROP.mouseY + "that.py" + that.py
			// + "canvasOffset.top" + canvasOffset.top);
			that.x = CROP.mouseX - that.px;
			that.y = CROP.mouseY - that.py;

			if (that.x < 0) {
				that.x = 0;
			}
			var canvas = $("#canvas");
			if (that.x + that.w > canvas.width()) {
				that.x = canvas.width() - that.w - 2;
			}
			if (that.y < 0) {
				that.y = 0;
			}
			if (that.y + that.h > canvas.height()) {
				that.y = canvas.height() - that.h - 2;
			}
			// console.log("left:" + that.x + " top:" + that.y);
			that.div.css("left", that.x + canvasOffset.left);
			that.div.css("top", that.y + canvasOffset.top);
			return false;
		}
		this.getImgXY = function() {
			var canvasOffset = $("#canvas").offset();
			var imgOffset = $("#panel").offset();
			var imgX = canvasOffset.left - imgOffset.left + CROP.selection.x;
			var imgY = canvasOffset.top - imgOffset.top + CROP.selection.y;
			return {
				X : imgX,
				Y : imgY
			};
		};

	}

	function getCropResult() {
		var imgXY = CROP.selection.getImgXY();
		var url = "/imagecrop/imagecrop?x=" + imgXY.X + "&y=" + imgXY.Y
				+ "&sc=" + CROP.selection.scale;
		$.get(url, function(data) {
			$("#crop_result").attr("src",
					"/imagecrop/image/result.jpg&ts=" + new Date());
		});
	}

	function handleOnLoad() {
		$('#fileupload').fileupload({
			dataType : 'json',
			done : function(e, data) {
				console.log("data");
			}
		});

		$("#slider").slider(
				{
					min : 50,
					max : 100,
					start : function(evt, ui) {
						CROP.img.css("left", 0);
						CROP.img.css("top", 0);
					},
					slide : function(evt, ui) {
						var width = jQuery.data(CROP.img[0], "width");
						CROP.img.width(width * ui.value / 100);
						$("#amount").val(ui.value);
					},
					change : function(evt, ui) {
						CROP.selection.scale = ui.value;
						var canvasOffset = $("#canvas").offset();
						var canvas = $("#canvas");
						var left = -CROP.img.width() + canvas.width()
								+ canvasOffset.left;
						var top = -CROP.img.height() + canvas.height()
								+ canvasOffset.top;
						var right = canvasOffset.left;
						var bottom = canvasOffset.top;
						CROP.img.draggable({
							containment : [ left, top, right, bottom ]

						});
					}
				});
		CROP.img = $("#panel");

		CROP.img.attr("src", "crop.jpg");
		CROP.img.load(function() {
			jQuery.data(CROP.img[0], "width", CROP.img.width());
			CROP.img.width(CROP.img.width() * 50 / 100);
		});

		CROP.selection = new selection(0, 0, 200, 200);
		$("#cropBtn").click(getCropResult);

	}

	$(document).ready(function() {
		handleOnLoad();
	});

})();
