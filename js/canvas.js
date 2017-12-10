function Palette(canvas,mask){
    this.canvas = canvas;
    this.mask = mask;
    this.ctx = this.canvas.getContext("2d");
    this.history = [];
    this.cw = this.canvas.width;
    this.ch = this.canvas.height;
    //样式
    this.lineWidth = 1;
    this.lineCap = "butt";
    this.fillStyle = '#000';
    this.strokeStyle = '#000';
    //控制描边和填充
    this.style = "stroke";
    //角 边
    this.polyNum;
    //文本
    this.text;
}
Palette.prototype = {
    //初始化样式方法
    init:function () {
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = this.lineCap;
        this.ctx.fillText = this.fillStyle;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.setLineDash([0,0]);
    },
    draw:function (type) {
        let that = this;
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX,oy = e.offsetY;
            that.mask.onmousemove = function (e) {
                let cx = e.offsetX,cy = e.offsetY;
                that.init();
                that.ctx.clearRect(0,0,that.cw, that.ch);
                if (that.history.length > 0){
                    that.ctx.putImageData(that.history[that.history.length - 1],0,0);
                }
                that[type](ox, oy, cx, cy);
            }
            that.mask.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0,0,that.cw, that.ch));
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
            }
        }
    },
    //直线
    line:function (ox, oy, cx, cy) {
        this.ctx.beginPath();
        this.ctx.moveTo(ox, oy);
        this.ctx.lineTo(cx, cy);
        this.ctx.closePath();
        this.ctx[this.style]();
    },
    //虚线
    dashed:function (ox, oy, cx, cy) {
        this.ctx.beginPath();
        this.ctx.setLineDash([10,10]);
        this.ctx.moveTo(ox, oy);
        this.ctx.lineTo(cx, cy);
        this.ctx.closePath();
        this.ctx[this.style]();
    },
    //铅笔
    pencil:function () {
        let that = this;
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX,oy = e.offsetY;
            that.init();
            if (that.history.length > 0) {
            	that.ctx.putImageData(that.history[that.history.length - 1],0,0);
            }
            that.ctx.beginPath();
            that.ctx.moveTo(ox,oy);
            that.mask.onmousemove = function (e) {
                let cx = e.offsetX,cy = e.offsetY;
                that.ctx.lineTo(cx, cy);
                that.ctx[that.style]();
            }
            that.mask.onmouseup = function () {
            	that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
                that.mask.onmousemove = null;
            }
        }
    },
    //矩形
    rectangle:function (ox, oy, cx, cy) {
    	this.ctx.beginPath();
    	this.ctx.rect(ox, oy, (cx - ox),(cy - oy));
    	this.ctx.closePath();
    	this.ctx[this.style]();
    },
    //圆
    circle:function (ox, oy, cx, cy) {
        let r = Math.sqrt(Math.pow((cx - ox),2) + Math.pow((cy - oy),2));
        this.ctx.beginPath();
        this.ctx.arc(ox, oy, r, 0, 2*Math.PI,false);
        this.ctx.closePath();
        this.ctx[this.style]();
    },
    //多边形
    polygon:function (ox,oy,cx,cy) {
        let angle = 360/this.polyNum/180*Math.PI;
        let r = Math.sqrt(Math.pow((cx - ox),2) + Math.pow((cy - oy),2));
        this.ctx.beginPath();
        this.ctx.moveTo(ox + r, oy);
        for(let i = 0; i < this.polyNum; i++){
            this.ctx.lineTo(ox + r*Math.cos(i * angle),oy + r*Math.sin(i*angle));
        }
        this.ctx.closePath();
        this.ctx[this.style]();
    },
    //多角形
    multiAngle:function (ox,oy,cx,cy) {
        let angle = 360/(this.polyNum * 2)/180 * Math.PI;
        let r = Math.sqrt(Math.pow((cx - ox),2) + Math.pow((cy - oy),2));
        let rs = r/2;
        this.ctx.beginPath();
        this.ctx.moveTo(ox+r, oy);
        for(let i = 1; i < this.polyNum*2; i++){
            if (i%2){
                this.ctx.lineTo(ox + rs*Math.cos(i * angle),oy + rs*Math.sin(i*angle));
            }else{
                this.ctx.lineTo(ox + r*Math.cos(i * angle),oy + r*Math.sin(i*angle));
            }
        }
        this.ctx.closePath();
        this.ctx[this.style]();
    },
    //橡皮
    eraser:function (obj,w,h) {
    	let that = this;
    	if (this.history.length > 0){
    	    this.ctx.putImageData(this.history[this.history.length - 1],0,0);
        }
    	this.mask.onmousedown = function  (e) {
            obj.style.display = 'block';
            e.preventDefault();//去掉浏览器的默认样式
            that.mask.onmousemove = function  (e) {
    			let ox = e.offsetX,oy = e.offsetY;
    			let lefts = ox - w/2,tops = oy - h/2;
    			if(lefts <= 4){
    				lefts = 4;
    			}
    			if (lefts >= that.cw - w) {
    				lefts = that.cw - w;
    			}
    			if (tops <= 2) {
    				tops = 2;
    			}
    			if (tops >= that.ch - h) {
    				tops = that.ch - h;
    			}
    			obj.style.left = `${lefts}px`;
    			obj.style.top = `${tops}px`;
    			that.ctx.clearRect(lefts,tops,w,h);
    		}
            that.mask.onmouseup = function  () {
                obj.style.display = 'none';
                that.history.push(that.ctx.getImageData(0,0,that.cw, that.ch));
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
            }
    	}
    },
    //文本
    font:function () {
        let that = this;
        if (this.history.length > 0){
            this.ctx.putImageData(this.history[this.history.length - 1],0,0);
        }
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX, oy = e.offsetY;
            let divs = document.createElement('div');
            divs.style.cssText = `
                width:150px;height:50px;background:#fff;border:1px dashed #000;position: absolute;
                left:${ox}px;top:${oy}px;
            `;
            divs.contentEditable = true;
            that.mask.appendChild(divs);
            that.mask.onmousedown = null;
            // 原来的位置 + 鼠标移动的距离
            let lefts,tops;
            divs.onmousedown = function (e) {
                let ox = e.clientX, oy = e.clientY;
                let ol = divs.offsetLeft, ot = divs.offsetTop;
                that.mask.onmousemove = function (e) {
                    let cx = e.clientX, cy = e.clientY;
                    lefts = cx - ox + ol;
                    tops = cy - oy + ot;
                    divs.style.left = `${lefts}px`;
                    divs.style.top = `${tops}px`;
                }
                divs.onmouseup = function () {
                    that.mask.onmousemove = null;
                    this.onmouseup = null;
                }
            }
            //失去焦点
            divs.onblur = function () {
                let value = divs.innerText;
                that.mask.removeChild(divs);
                that.ctx.font = '30px sans-serif';
                that.textAlign = 'center';
                that.ctx.textBaseline = 'middle';
                that.ctx.fillText(value,lefts, tops);
                that.history.push(that.ctx.getImageData(0,0,that.cw, that.ch));
            }
        }
    },
    //反转
    reversal:function () {
        let imgData = this.ctx.getImageData(0,0,this.cw, this.ch);
        let data = imgData.data;
        for(let i = 0; i <data.length; i+=4){
            data[i] = 255-data[i];
            data[i + 1] = 255-data[i + 1];
            data[i + 2] = 255-data[i + 2];
        }
        this.ctx.putImageData(imgData,0,0);
    },
    //撤销
    repeal:function () {
        let img = this.history.pop();
        if (this.history.length == 0){
            this.ctx.clearRect(0,0,this.cw, this.ch);
            return;
        }
        this.ctx.putImageData(img,0,0);
    },
    //裁剪
    cutout:function (clipObj) {
        let that = this;
        this.mask.onmousedown = function (e) {
            let w,h,minX,minY;
            let ox = e.offsetX, oy = e.offsetY;
            that.mask.onmousemove = function (e) {
                let cx = e.offsetX, cy = e.offsetY;
                w = Math.abs(ox - cx),h = Math.abs(oy - cy);
                minX = cx >= ox ? ox : cx;
                minY = cy >= oy ? oy : cy;
                clipObj.style.cssText = `
                    display:block;
                    width:${w}px;height:${h}px;
                    left:${minX}px;top:${minY}px;
                `;
            }
            that.mask.onmouseup = function () {
                that.temp = that.ctx.getImageData(minX,minY,w, h);
                that.ctx.clearRect(minX,minY,w, h);
                that.history.push(that.ctx.getImageData(0,0,that.cw, that.ch));
                that.ctx.putImageData(that.temp,minX,minY);
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
                that.drag(minX,minY, w, h, clipObj);
            }
        }
    },
    drag:function (minX,minY, w, h, obj) {
        let that = this;
        this.mask.onmousemove = function (e) {
            let ox = e.offsetX, oy = e.offsetY;
            if(ox > minX && ox < minX + w && oy > minY && oy < minY + h){
                that.mask.style.cursor = 'move';
            }else{
                that.mask.style.cursor = 'default';
            }
        }
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX, oy = e.offsetY;
            e.preventDefault();
            that.mask.onmousemove = function (e) {
                let cx = e.offsetX, cy = e.offsetY;
                let lefts = cx - ox + minX, tops = cy - oy + minY;
                if(lefts < 4){
                    lefts = 4;
                }
                if (lefts > that.cw - w - 2){
                    lefts = that.cw - w - 2;
                }
                if(tops < 2){
                    tops = 2;
                }
                if (tops > that.ch - w - 2){
                    tops = that.ch - w - 2;
                }
                obj.style.left = `${lefts}px`;
                obj.style.top = `${tops}px`;
                that.ctx.clearRect(0,0,that.cw, that.ch);
                if (that.history.length > 0){
                    that.ctx.putImageData(that.history[that.history.length - 1],0,0)
                }
                that.ctx.putImageData(that.temp,lefts,tops);
            }
            that.mask.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0,0,that.cw, that.ch));
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
                that.temp = null;
                obj.style.display = 'none';
            }
        }
    }
}