window.addEventListener('load',function () {
    let canvas = document.querySelector('canvas');
    let mask = document.querySelector('div.mask');
    let play = new Palette(canvas,mask);
    let tool = document.querySelectorAll('button');
    let now = 0;
    let active = document.querySelectorAll('button[active = "false"]');
    let inputs = document.querySelectorAll('input');
    for (let i = 0; i < active.length; i++) {
    	tool[i].onclick = function () {
    		active[now].setAttribute('active',false);
    		this.setAttribute('active',true);
    		now = i;
    		let type = tool[i].getAttribute('id');
    		if(i == 6 || i == 5 ){
    			play.polyNum = prompt("请输入边数或者角数",5);
    		}
    		if (i == 2) {
    			play.pencil();
    			return;
    		}
    		play.draw(type);
    	}
    }
    //填充和描边的颜色
    inputs.forEach((element,index) =>{
    	element.onchange = function  () {
    		if (index == 0) {
    			play.fillStyle = this.value;
    		}else if (index == 1) {
    			play.strokeStyle = this.value;
    		}
    	}
    })
	//线宽
	let lineWidth = document.getElementById('lineWidth');
    lineWidth.addEventListener('click',function () {
        play.lineWidth = prompt('请输入你想要的线宽',10);
    })
	//填充
	let fill = document.getElementById('fill');
    fill.addEventListener('click',function () {
		play.style = 'fill';
    })
	//描边
	let stroke = document.getElementById('stroke');
    stroke.addEventListener('click',function () {
		play.style = 'stroke';
    })
	//橡皮
	let eraser = document.getElementById('eraser');//橡皮的按钮
    let rubbish = document.querySelector('div.rubbish');//橡皮在canvas中所在的盒子
    eraser.addEventListener('click',function () {
		rubbish.style.display = 'block';
		play.eraser(rubbish,20,30);
    })
	//文本
	let text = document.getElementById('text');
    text.addEventListener('click',function () {
		play.font();
    })
	//保存
	let save = document.getElementById('save');
    save.onclick = function () {
		save.href = canvas.toDataURL('img/png');
    }
    //反转
    let reversal = document.getElementById('reversal');
    reversal.onclick = function () {
		play.reversal();
    }
    //撤销
	let repeal = document.getElementById('repeal');
    repeal.onclick = function () {
		play.repeal();
    }
    //裁剪
    let cutout = document.getElementById('cutout');//按钮
    let clip = document.querySelector('.clip');//盒子
    cutout.onclick = function () {
        play.cutout(clip);
    }
})