var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 500;
var RADIUS = 8;
var MARGIN_TOP = 50;
var MARGIN_LEFT = 30;
// 月份是从0-11
// const endTime = new Date(2016,11,16,23,59,59);

// 一小时倒计时
// var endTime = new Date();
// endTime.setTime(endTime.getTime()+ 3600*1000);
var curShowTimeSeconds = 0;

// g：重力加速度 vx：x方向上的速度  vy：y方向上的速度，vy为正值则表示下抛，为负值则表示上抛
var balls = [];
// const colors = ["#33b5e5","#0099cc","#aa66cc","#9933cc","#99cc00","#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];
const colors = ["#f33578","#3394e6","#15f42f","#f7d208","#fa7217","#fa17c7","#c217fa","#174cfa","#279e43","#f9eb10"];

// var ball = {x:512, y:100, r:8, g:2, vx:-4, vy:-10, color:"#f34b17"};

window.onload = function(){
	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight;
	// round:取整
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 /108)-1;
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);

	var canvas = document.getElementById('canvas');
	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;
	// 使用context进行绘制
	if(canvas.getContext("2d")){
		var context = canvas.getContext("2d");
	}else{
		alert("当前浏览器不支持canvas，请更换浏览器后再试。");
	}
	
	curShowTimeSeconds = getCurrentShowTimeSeconds(); 
	
	// 动画
	setInterval(
		function(){
			render(context);/*渲染*/
			update();
		},
		40
	);
	
}

function getCurrentShowTimeSeconds(){
	// 获取当前时间
	var curTime = new Date();
//倒计时 
	// // 用截止时间的毫秒数-当前时间的毫秒数
	// var ret = endTime.getTime() - curTime.getTime();
	// // 转化为秒
	// ret = Math.round(ret/1000);
	// return ret >= 0?ret:0;
// 时钟
	var ret = curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds();
	return ret;
}

function update(){
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();
	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours*3600) /60);
	var nextSeconds = nextShowTimeSeconds%60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt( (curShowTimeSeconds - curHours*3600) /60);
	var curSeconds = curShowTimeSeconds%60;

	// 如果时间改变
	if(nextSeconds != curSeconds){
		// 如果当前小时的十位与下一刻的小时的十位不同（即时间改变），则在该数位置处增加小球，增加的小球按当前数字形状增加
		if(parseInt(curHours/10) != parseInt(nextHours/10)){
			addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
		}
		// 如果当前小时的个位与下一刻的小时的个位不同（即时间改变），则在该数位置处增加小球，增加的小球按当前数字形状增加
		if(parseInt(curHours%10) != parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
		}

		if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
			addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}

		if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
			addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
		}

		if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
			addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}

		if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
			addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;
	}

	updateBalls();

	// ball.x += ball.vx;
	// ball.y += ball.vy;
	// ball.vy += ball.g;

	// // 碰撞检测
	//   //如果碰到地（球的y值为屏幕高减去半径时）则反弹 
	// if(ball.y > WINDOW_HEIGHT-RADIUS){
	// 	ball.y = WINDOW_HEIGHT-RADIUS;
	//   // 速度反向,且要减弱（设摩擦系数为0.5）
	// 	ball.vy = -ball.vy*0.5;
	// }
}

function updateBalls(){
	for(var i=0; i<balls.length; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g; 

		if(balls[i].y >= WINDOW_HEIGHT-RADIUS){
			balls[i].y = WINDOW_HEIGHT-RADIUS;
			balls[i].vy = -balls[i].vy*0.7;
		}
	}
	// 走出屏幕的小球，就将其从数组中删掉
	var cnt = 0;
	for(var i=0; i<balls.length; i++){
		if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS<WINDOW_WIDTH){
			balls[cnt++] = balls[i]; /*保留cnt以前的小球，cnt以后的小球均可删除*/
		}
	}
	// Math.min(300,cnt)表示取300和cnt之间的最小值
	while(balls.length>Math.min(300,cnt)){
		balls.pop();  /*删除数组末尾的小球*/
	}
	
}

function addBalls(x,y,num){
	for(var i=0; i<digit[num].length; i++){
		for(var j=0; j<digit[num][i].length; j++){
			if(digit[num][i][j] == 1){
				var aBall = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(), /*加速度在1.5--2.5之间*/
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4, /*即-1或+1 再乘4， pow是多少次方，ceil是取整，random是取0-1之间的随机数*/
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)] /*floor：下取整*/
				}

				balls.push(aBall);
			}
		}
	}
}

function render(cxt){
	// 每次更新完时间要对整个屏幕刷新
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt( (curShowTimeSeconds - hours*3600) /60);
	var seconds = curShowTimeSeconds%60;
	// 定义一个函数renderDigit，他的参数表示从哪开始画，画哪个数
	// 数字阵是10*7，冒号阵是10*4
	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);

	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);

	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

	// 绘制抛落的小球
	for(var i=0; i<balls.length; i++){
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,RADIUS,1.75*Math.PI, 1.25*Math.PI);
		cxt.closePath();
		cxt.fillStyle = balls[i].color;
		cxt.fill();
	}
	
}

// 绘制时间小球
function renderDigit(x,y,num,cxt){
	// 可以看出i表示行，j表示列
	for(var i=0;i<digit[num].length;i++)
		for(var j=0; j<digit[num][i].length; j++)
			if(digit[num][i][j] == 1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS , 1.75*Math.PI, 0.9*Math.PI);
				cxt.closePath();
				// cxt.fillStyle = "#f34b17";
				cxt.fillStyle = "#f908da";
				cxt.fill();
			}
}

