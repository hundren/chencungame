function GamePlay(){
	//左边的分数展示
	var record = {
		member : [],

		init : function(cap){
			for(var i=0; i<8; i++){
				record.member.push(new Scoreboard().startupScoreboard(i, cap));	
			}
		},

		reset : function(cap){
			//规则：新指标
			for(var i=0; i<8; i++){
				record.member[i].reset(cap);	
			}
		},

		shutdown : function(){
			for(var i=0, l=record.member.length; i<l; i++){
				record.member[i].shutdownScoreboard();
			}
		}

	}

	//全部成绩
	var score = {
		total : null,	//保留全部成绩对象
		text : null,	//保留等级图片
		level : null,	//保留级数对象
		init : function(){
			g_score = 0;
			score.total = new GameFont().startupGameFont('0', 'L', 'right', 480, 20, 6);
			score.text = new VisualGameObject().startupVisualGameObject(g_ResourceManager.main, 378, 504, 96, 24, 80, 240, 6);
			score.level = new GameFont().startupGameFont('1', 'S-yellow', 'left', 178, 240, 6);
		},

		updateScore : function(int){
			g_score = g_score + int;
			score.total.updateGameFont(g_score.toString());
		},

		levelup : function(){
			score.level.updateGameFont(zooKeeper.level.toString());
		},

		shutdown : function(){
			score.total.shutdownGameFont();
			score.text.shutdownVisualGameObject();
			score.level.shutdownGameFont();
		}
	}

	//顶端动画循环
	var mascot = {
		background : null,
		animal : null,
		twitched : false,
		setStage : function(stageName){
			var sx, sy, w, h, x, y, _stageName, _id;
			if(stageName){
				_stageName = stageName;
			}else{
				_id = Math.floor(Math.random()*7 + 1);
				switch(_id){
					case 1 : 
						_stageName = 'monkey';
						break
					case 2 :
						_stageName = 'panda';
						break
					case 3 :
						_stageName = 'giraffe';
						break
					case 4 :
						_stageName = 'hippo';
						break
					case 5 :
						_stageName = 'elephant';
						break
					case 6 :
						_stageName = 'crocodile';
						break
					case 7 :
						_stageName = 'lion';
						break
					default : 
				}
			}

			zooKeeper.luckyId = _id;

			switch (_stageName) 
			{
				case 'crocodile' : 
					i = 0; sy = 0; w = 228; h = 212; x = 198; y = 35;
					break
				case 'elephant' :
					i = 1; sy = 212; w = 324; h = 196; x = 138; y = 48;
					break
				case 'giraffe' :
					i = 2; sy = 408; w = 244; h = 276; x = 196; y = 1;
					break
				case 'hippo' :
					i = 3; sy = 684; w = 292; h = 228; x = 138; y = 52;
					break
				case 'lion' :
					i = 4; sy = 912; w = 228; h = 228; x = 178; y = 6;
					break
				case 'monkey' :
					i = 5; sy = 1140; w = 164; h = 196; x = 182; y = 63;
					break
				case 'panda' :
					i = 6; sy = 1336; w = 148; h = 228; x = 238; y = 39;
					break
				default : 
			}

			if(mascot.background){
				mascot.background.setImage(g_ResourceManager.mascotBg, 0, 280*i, 512, 278, 0, 0);
			}else{
				mascot.background = new VisualGameObject().startupVisualGameObject(g_ResourceManager.mascotBg, 0, 280*i, 512, 278, 0, 0, 3);
			}

			if(mascot.animal){
				mascot.animal.setAnimation(g_ResourceManager.mascot, 0, sy, w, h, x, y, 2, 2);
			}else{
				mascot.animal = new AnimatedGameObject().startupAnimatedGameObject(g_ResourceManager.mascot, 0, sy, w, h, x, y, 4, 2, 2);
			}
		},

		twitch : function(){
			mascot.animal.frameCount = 4;
			mascot.twitched = true;
			mascot.animal.update = mascot.update;
		},

		update : function(){
			if(mascot.twitched && mascot.animal.currentFrame === 3){
				mascot.animal.frameCount = 2;
				mascot.twitched = false;
				mascot.animal.update = null;
			}
		},
		
		shutdown : function(){
			mascot.background.shutdownVisualGameObject();
			mascot.animal.shutdownAnimatedGameObject();
		}

	}

	//时间计时器
	var timer = {
		counter : null,
		limit : 80,
		init : function(timeLimit){
			timer.counter = new VisualGameObject().startupVisualGameObject(g_ResourceManager.main, 516, 4, 12, 374, 84, 301, 4);
			if(timeLimit){timer.limit = timeLimit}
		},

		countdown : function(){
			timer.counter.update = timer.timeTick;
		},

		pause : function(){
			timer.counter.update = null;
		},

		bouns : function(dh){
			if(timer.counter.height + dh < 374){
				timer.counter.sy = timer.counter.sy - dh;
				timer.counter.y = timer.counter.y - dh;
				timer.counter.height = timer.counter.height + dh;
			}else{
				timer.counter.sy = 4;
				timer.counter.y = 301;
				timer.counter.height = 374;
			}
		},

		reset : function(limit){
			timer.limit = limit;
			timer.bouns(50);
			timer.pause();
		},

		timeTick : function(dt, context, xScroll, yScroll){
			var dl = dt/timer.limit * 374;
			this.y = this.y + dl;
			this.sy = this.sy + dl;
			if(this.height - dl > 0){
				this.height = this.height - dl;
			}else{
				this.height = 0;
				timer.pause();
				zooKeeper.gameOver();
			}
		},

		shutdown : function(){
			timer.counter.shutdownVisualGameObject();
		}
	}

	//主要的游戏板块
	var play = {
		background : null,
		field : null,
		picker : null,
		nomove : null,
		panel : new Array(16),
		toExplode : [],
		movable : [],
		selected : null, 


		init : function(){
			play.background = new VisualGameObject().startupVisualGameObject(g_ResourceManager.main, 0, 0, 512, 418, 0, 278, 3);
			play.field = new VisualGameObject().startupVisualGameObject(g_ResourceManager.main, 0, 724, 368, 368, 119, 304, 1);
			play.picker = new AnimatedGameObject().startupAnimatedGameObject(g_ResourceManager.panels, 0, 416, 58, 58, 520, 400, 4, 2, 4)

			for(var i=0; i<16; i++){
				play.panel[i] = new Array(8);
				if(i < 8){
					for(var j=0; j<8; j++){
						play.panel[i][j] = new Piece().startupPiece(i, j);
					}
				}
			}

			play.field.mouseclick = play.pieceClick;
		},

		pickerOn : function(piece){
			play.picker.x = piece.x - 6;
			play.picker.y = piece.y - 6;
			play.selected = piece;
			//输出('['+piece.row+']['+piece.col+']'+'id:'+piece.id)
		},

		pickerOff : function(){
			play.picker.x = 520;
			play.selected = null;
		},

		pieceClick : function(event){
			var rowIndex = Math.floor( ( play.field.y + play.field.height - event.offsetY ) / 46);
			var colIndex = Math.floor( (event.offsetX - play.field.x) / 46);
			//输出('row:'+rowIndex+'/'+'col:'+colIndex);
			var targetPiece = play.panel[rowIndex][colIndex];
			//输出任务块
			if( rowIndex >= 0 && rowIndex < 8 && colIndex >= 0 && colIndex <8){

				if(!play.selected){
					play.pickerOn( targetPiece );
					targetPiece.wink();
					
				}else if( !(rowIndex === play.selected.row && colIndex === play.selected.col) ){
					play.selected.winkOff();
					if(Math.abs(rowIndex - play.selected.row) + Math.abs(colIndex - play.selected.col) > 1){
						//不临近的			
						play.pickerOn( targetPiece );
						targetPiece.wink();
					}else{
						//邻近的
						play.swap(play.selected, targetPiece);
					}
				}

			}

		},

		swap : function(starter, ender, reverse){
			//@参数  piece : 	扫描坐标任务块
			//@参数  reverse : 	反转到原始对象
			var starter = starter;
			var ender = ender;
			var starterX = starter.x;
			var starterY = starter.y;
			var enderX = ender.x;
			var enderY = ender.y;
			var speed = 200;
			var direction;
			//交换坐标
			function resetPiece(){
				var tmpRow = starter.row;
				var tmpCol = starter.col;

				starter.row = ender.row;
				starter.col = ender.col;
				ender.row = tmpRow;
				ender.col = tmpCol;

				play.panel[ender.row][ender.col] = ender; 
				play.panel[starter.row][starter.col] = starter;
				play.field.update = null;
				if(!reverse){
					play.swapCheck(starter, ender);
				}
			}
			
			if(starter.row !== ender.row){
				direction = enderY - starterY > 0? 1 : -1;

				play.field.update = function(dt, context, xScroll, yScroll){

					if( (starter.y + speed*dt*direction - enderY)*direction > 0 ){
						starter.y = enderY;
						ender.y = starterY;
						resetPiece();
					}else{
						starter.y = starter.y + speed*dt*direction;
						ender.y = ender.y - speed*dt*direction;
					}

				}
			}

			if(starter.col !== ender.col){
				direction = enderX - starterX > 0? 1 : -1;

				play.field.update = function(dt, context, xScroll, yScroll){
				
					if( (starter.x + speed*dt*direction - enderX)*direction > 0 ){
						starter.x = enderX;
						ender.x = starterX;
						resetPiece();
					}else{
						starter.x = starter.x + speed*dt*direction;
						ender.x = ender.x - speed*dt*direction;
					}

				}
			}

		},

		swapCheck : function(starter, ender){
			var toExplode = play.pieceCheck([starter, ender]);
			if(toExplode.length > 0){
				play.pieceExplode(toExplode);
			}else{
				play.swap(ender, starter, true);
				play.pickerOff();
			}
		},

		pieceCheck : function(array){

			var toExplode = [];
			var verticalCheckResult, horizontalCheckResult, rowIndex, colIndex;
			
			for(var i=0, l=array.length; i<l; i++){
				//输出('(row)'+array[i].row+' '+'(col)'+array[i].col+' '+'(id)'+array[i].id);
				if(array[i].enrolled){
					continue;
				}

				verticalCheckResult = [];
				horizontalCheckResult = [];
				rowIndex = array[i].row;
				colIndex = array[i].col;
				
				//垂直方向检查
				while(rowIndex > 0){
					//输出('||111||'+play.panel[rowIndex][colIndex].id)
					if(play.panel[rowIndex][colIndex].id === play.panel[rowIndex - 1][colIndex].id){
						if(!play.panel[rowIndex - 1][colIndex].enrolled){
							verticalCheckResult.push(play.panel[rowIndex - 1][colIndex]);
							play.panel[rowIndex - 1][colIndex].enrolled = true;
						}
					}else{
						break;
					}
					rowIndex --;
					
				}
				rowIndex = array[i].row;

				while(rowIndex < 7){
					//输出('||222||'+play.panel[rowIndex][colIndex].id)
					if(play.panel[rowIndex][colIndex].id === play.panel[rowIndex + 1][colIndex].id){
						if(!play.panel[rowIndex + 1][colIndex].enrolled){
							verticalCheckResult.push(play.panel[rowIndex + 1][colIndex]);
							play.panel[rowIndex + 1][colIndex].enrolled = true;
						}
					}else{
						break;
					}
					rowIndex ++;
					
				}
				rowIndex = array[i].row;

				//横方向检查
				while(colIndex > 0){
					//输出('||333||'+play.panel[rowIndex][colIndex].id)
					if(play.panel[rowIndex][colIndex].id === play.panel[rowIndex][colIndex - 1].id){
						if(!play.panel[rowIndex][colIndex - 1].enrolled){
							horizontalCheckResult.push(play.panel[rowIndex][colIndex - 1]);
							play.panel[rowIndex][colIndex - 1].enrolled = true;
						}
					}else{
						break;
					}
					colIndex --;
					
				}
				colIndex = array[i].col;

				while(colIndex < 7){
					//输出('||444||'+play.panel[rowIndex][colIndex].id)
					if(play.panel[rowIndex][colIndex].id === play.panel[rowIndex][colIndex + 1].id){
						if(!play.panel[rowIndex][colIndex + 1].enrolled){
							horizontalCheckResult.push(play.panel[rowIndex][colIndex + 1]);
							play.panel[rowIndex][colIndex + 1].enrolled = true;
						}
					}else{
						break;
					}
					colIndex ++;
					
				}
				colIndex = array[i].col;
				
				if(verticalCheckResult.length < 2){
					verticalCheckResult[0] && (verticalCheckResult[0].enrolled = null);		
				}else{
					toExplode = toExplode.concat(verticalCheckResult);
					if(!array[i].enrolled){
						toExplode.push(array[i]);
						array[i].enrolled = true;
					}
				}
				
				if(horizontalCheckResult.length < 2){
					horizontalCheckResult[0] && (horizontalCheckResult[0].enrolled = null);
				}else{
					toExplode = toExplode.concat(horizontalCheckResult);
					if(!array[i].enrolled){
						toExplode.push(array[i]);
						array[i].enrolled = true;
					}
				}
				
			}

			if(toExplode.length > 0){
				for(var i=0, l=toExplode.length; i<l; i++){
					toExplode[i].enrolled = null;
				}
			}

			return toExplode;

		},

		pieceExplode : function(array){
			var exploded;
			var stageClear = false;
			play.field.mouseclick = null;

			for(var i=0, l=array.length; i<l; i++){
				array[i].currentFrame = 0;
				array[i].frameWidth = array[i].width;
				array[i].frameCount = 4;
				array[i].timeBetweenFrames = 0.125;
				array[i].timeSinceLastFrame = array[i].timeBetweenFrames;
	
			}

			play.field.update = function(dt, context, xScroll, yScroll){
				exploded = true;

				for(var i=0, l=array.length; i<l; i++){
					array[i].sx = array[i].frameWidth * array[i].currentFrame + 138;
			        array[i].timeSinceLastFrame -= dt;
			        if (array[i].timeSinceLastFrame <= 0)
			        {
			           	array[i].timeSinceLastFrame = array[i].timeBetweenFrames;
			           	++array[i].currentFrame;
			           	//爆炸一次
			           	if(array[i].currentFrame === 4){
			           		//array[i].shutdownPiece();
			           		//array[i].isBomb = true;
			           		play.panel[array[i].row][array[i].col] = null;		
				        }else{
				        	exploded = false;
				        }
			           	array[i].currentFrame %= array[i].frameCount;
			        }else{
			        	exploded = false;
			        }
		        }

		        if(exploded){
		        	play.field.update = null;
		        	zooKeeper.updateScore(array);
		        	play.pieceReload(array);
		        	play.field.mouseclick = play.pieceClick;
		        }
			}

			play.pickerOff();
		},

		pieceReload : function(array){
			//输出('1:'+array.length)
			var rowIndex, colIndex, pieceLoaded;
			var toReload = [];
			play.field.mouseclick = null;
			for(var i=0, l=array.length; i<l; i++){
				pieceLoaded = false;
				rowIndex = array[i].row;
				colIndex = array[i].col;
				while( rowIndex < 15){
					rowIndex ++;
					target = play.panel[rowIndex][colIndex];
					if(target){

						if(target.downStep){
							target.downStep = target.downStep + 1;
						}else{
							target.downStep = 1;
						}

						if(!target.enrolled){
							//输出(rowIndex+'--------'+colIndex)
							toReload.push(target);
							target.enrolled = true;
						}
						
					}

					if( !target && rowIndex > 7 ){
						play.panel[rowIndex][colIndex] = array[i].refresh(rowIndex, colIndex);
						target = play.panel[rowIndex][colIndex];
						//输出(rowIndex+'//////'+colIndex)
						if(play.panel[rowIndex - 1][colIndex] && play.panel[rowIndex - 1][colIndex].downStep){
							target.downStep = play.panel[rowIndex - 1][colIndex].downStep;
						}else{
							target.downStep = 1;
						}
						target.enrolled = true;
						toReload.push(target);
						break;
					}
	
				}
			}

			//reset row, col index of pieces to be reload
			for(var i=0, l=toReload.length; i<l; i++){
				play.panel[toReload[i].row][toReload[i].col] = null;
				toReload[i].row = toReload[i].row - toReload[i].downStep;
				
			}

			for(var i=0, l=toReload.length; i<l; i++){
				play.panel[toReload[i].row][toReload[i].col] = toReload[i];
				toReload[i].downStep = null;
				toReload[i].enrolled = null;
			}

			play.field.mouseclick = play.pieceClick;
			play.pieceDrop(toReload);
			
		},

		pieceDrop : function(array){
			play.field.mouseclick = null;
			play.field.update = function(dt, context, xScroll, yScroll){
				var allDone = true;
				for(var i=0, l=array.length; i<l; i++){
					if(array[i].y + 500*dt < 626 - 46*array[i].row){
						array[i].y = array[i].y + 500*dt;
						allDone = false;
					}else{
						array[i].y = 626 - 46*array[i].row;
					}
				}
				if(allDone){
					play.field.update = null;
					play.field.mouseclick = play.pieceClick;
					if(!zooKeeper.stageClear){
						play.aftermath(array);
					}else{
						play.rolloutPieces(zooKeeper.nextStage);
					}
				}
			}
		},

		aftermath : function(array){
			var toExplode = play.pieceCheck(array);
			var movable = true;

			if(toExplode.length > 0){
				play.pieceExplode(toExplode);
			}else{
				movable = play.movableCheck();
				if(!movable){
					play.rolloutPieces();
				}
			}
		},

		movableCheck : function(){
			var movable = [];
			var current, currentRow, currentCol, swapTarget, swapTargetRow, swapTargetCol;

			function check(tar){
				swapTarget = tar;
				swapTargetRow = swapTarget.row;
				swapTargetCol = swapTarget.col;
				//输出('before:'+current.row+'/'+current.col);

				if(current.id !== swapTarget.id){
					//方块检查前扫描坐标
					current.row = swapTargetRow;
					current.col = swapTargetCol;
					swapTarget.row = currentRow;
					swapTarget.col = currentCol;
					play.panel[currentRow][currentCol] = swapTarget;
					play.panel[swapTargetRow][swapTargetCol] = current;

					movable = play.pieceCheck([current, swapTarget]);
					//输出('check result:'+movable.length)
					//重置坐标
					current.row = currentRow;
					current.col = currentCol;
					swapTarget.row = swapTargetRow;
					swapTarget.col = swapTargetCol;
					play.panel[currentRow][currentCol] = current;
					play.panel[swapTargetRow][swapTargetCol] = swapTarget;
					//输出('after:'+current.row+'/'+current.col);
					//输出('*********************************************')

					if(movable.length > 0){
						//输出('yes movable')
						play.movable = movable;
						return true;
					}
				}
			}

			for(var i=0; i<8; i++){
				for(var j=0; j<8; j++){
					current = play.panel[i][j];
					currentRow = current.row;
					currentCol = current.col;
					//右方向交换检查
					if(j < 7){
						if(check(play.panel[i][j+1])){
							return true;
						};
					}
					//下方向交换检查
					if(i < 7){
						if(check(play.panel[i+1][j])){
							return true;
						};
					}
				}
			}

			play.movable = [];
			//输出('no move');
			return false;
		},

		noMoreMove : function(){
			var timePass = 0;
			var duration = 1;
			if(play.nomove){
				play.nomove.x = 145;
			}else{
				play.nomove = new VisualGameObject().startupVisualGameObject(g_ResourceManager.main, 0, 1094, 316, 60, 145, 470, 3);
			}
			timer.bouns(50);
			timer.pause();
			score.updateScore(2000);
			play.nomove.update = function(dt, context, xScroll, yScroll){
				timePass = timePass + dt;
				if(timePass > duration){
					play.nomove.update = null;
					play.nomove.x = 520;
					timer.countdown();
					play.rollinPieces();
				}
			}
		},

		rolloutPieces : function(onRolloutHandler){
			play.field.mouseclick = null;
			var speed = 500;
			var piece, allDone;
			play.field.update = function(dt, context, xScroll, yScroll){
				allDone = true;
				for(var i=0; i<8; i++){
					for(var j=0; j<8; j++){
						piece = play.panel[i][j];
						if(piece.y + speed*dt < 1026 - piece.row*46){
							piece.y = piece.y + speed*dt;
							if(allDone){
								allDone = false;
							}
						}else{
							piece.y = 1026 - piece.row*46;
						}
					}
				}

				if(allDone){
					play.field.update = null;
					play.field.mouseclick = play.pieceClick;
					//首次展示块
					for(var i=0; i<8; i++){
						for(var j=0; j<8; j++){
							piece = play.panel[i][j];
							piece.y = 226 - piece.row*46;
						}
					}
					//载入块
					play.prepareSence();
					
					if(onRolloutHandler){
						onRolloutHandler();
					}else{
						//输出('no move');
						play.noMoreMove();
					}
				}
			}

			
		},

		rollinPieces : function(){
			play.field.mouseclick = null;
			var speed = 500;
			var piece, allDone;
			play.field.update = function(dt, context, xScroll, yScroll){
				allDone = true;
				for(var i=0; i<8; i++){
					for(var j=0; j<8; j++){
						piece = play.panel[i][j];
						if(piece.y + speed*dt < 626 - piece.row*46){
							piece.y = piece.y + speed*dt;
							if(allDone){
								allDone = false;
							}
						}else{
							piece.y = 626 - piece.row*46;
						}
					}
				}

				if(allDone){
					play.field.update = null;
					play.field.mouseclick = play.pieceClick;
				}
			}	
		},

		prepareSence : function(){
			//输出('prepareSence')
			var testArr = [];
			var senceReady = false;
			var bomb;

			function randomPieces(){
				var piece;
				for(var i=0; i<8; i++){
					for(var j=0; j<8; j++){
						piece = play.panel[i][j];
						piece.id = Math.floor(Math.random()*8 + 1);
						piece.sy = (piece.id - 1)*46;
					}
				}
			}

			function clearBomb(){
				var newBomb = [];
				var bombReduced = false;
				
				while(!bombReduced){

					if(bomb[0].id < 8){
						bomb[0].id ++;
					}else{
						bomb[0].id = 1;
					}
					bomb[0].sy = (bomb[0].id-1)*46;
					//alert('bomb id: '+bomb[0].id);
					newBomb = play.pieceCheck(bomb);
					if(newBomb.length <= bomb.length){
						bomb = newBomb;
						bombReduced = true;
						break;
					}
				}
			}

			for(var i=0; i<8; i++){
				testArr = testArr.concat(play.panel[i]);
			}

			while(!senceReady){
				
				var movable = false;
				randomPieces();
				
				bomb = play.pieceCheck(testArr);

				while(bomb.length > 2){
					clearBomb();
				}
				movable = play.movableCheck();
				//输出('movable: '+movable)
				if(movable){
					senceReady = true;
					break;
				}

			}
		},

		shutdown : function(){
			play.background.shutdownVisualGameObject();
			play.field.shutdownVisualGameObject();
			play.picker.shutdownAnimatedGameObject();
			for(var i=0; i<8; i++){
				for(var j=0; j<8; j++){
					play.panel[i][j].shutdownPiece();
				}
			}
		}
	}

	//全局处理
	var zooKeeper = {
		level : 1,
		currentLevelStage : 1,
		luckyId : 0,
		basePerScore : 50,
		basePerTimeBouns : 4,
		stageClear : false,

		init : function(){
			//定制事件
			record.init(zooKeeper.level * 3 + zooKeeper.currentLevelStage -1);
			score.init();
			timer.init();
			mascot.setStage();
			play.init();
			play.prepareSence();
			return zooKeeper;
		},

		levelup : function(){
			var timePass = 0;
			var duration = 1;
			var levelupText = new VisualGameObject().startupVisualGameObject(g_ResourceManager.main, 68, 502, 308, 68, 150, 450, 3);
			levelupText.update = function(dt, context, xScroll, yScroll){
				timePass = timePass + dt;
				if(timePass > duration){
					levelupText.shutdownVisualGameObject();
					new StageChange().startupStageChange(zooKeeper.level, zooKeeper.currentLevelStage);
				}
			}
		},

		prepareStage : function(isLevelup){
			/*******************
				@参数 level : 			现在不同的级数
				@参数 levelStage : 	    计数场景，每级有3个场景
			********************/
			if(isLevelup){
				zooKeeper.levelup();
			}else{
				new StageChange().startupStageChange(zooKeeper.level, zooKeeper.currentLevelStage);
			}

		},

		updateScore : function(array){
			var stageClear = true;
			//更新数组
			for(var i=0, l=array.length; i<l; i++){
				if(array[i].id === zooKeeper.luckyId){
					if(!mascot.twitched){
						mascot.twitch();
					}
					score.updateScore(zooKeeper.basePerScore * 2);
					timer.bouns(zooKeeper.basePerTimeBouns * 2);
				}else{
					score.updateScore(zooKeeper.basePerScore);
					timer.bouns(zooKeeper.basePerTimeBouns);
				}
				record.member[array[0].id - 1].updateScore(1);
			}
			
			//检查是否清除
			for(var i=0, l=record.member.length; i<l; i++){
				if(!record.member[i].qualified){
					stageClear = false;
				}
			}
			
			zooKeeper.stageClear = stageClear;
		},

		nextStage : function(){
			var onLevelup = false;
			if(zooKeeper.currentLevelStage < 3){
				zooKeeper.currentLevelStage ++;
			}else{
				zooKeeper.currentLevelStage = 1;
				zooKeeper.level ++;
				score.levelup();
				onLevelup = true;
			}

			zooKeeper.stageClear = false;
			record.reset(zooKeeper.level * 3 + zooKeeper.currentLevelStage -1);	
			timer.reset(80 - 4 * zooKeeper.level);
			mascot.setStage();
			zooKeeper.prepareStage(onLevelup);
		},

		startStage : function(){
			//返回场景，并启动其它事件
			timer.countdown();
			play.rollinPieces();
		},

		gameOver : function(){
			play.field.mouseclick = null;
			play.rolloutPieces(function(){
				g_ApplicationManager.fade(function(){
					zooKeeper.shutdown();
					g_ApplicationManager.endGame = GameOver();
				})
			});
		},

		shutdown : function(){
			record.shutdown();
			score.shutdown();
			mascot.shutdown();
			timer.shutdown();
			play.shutdown();
		}
	}

	return zooKeeper;

}