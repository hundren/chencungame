function GameRank()
{
	//这个数组用来保留前9名的成绩
	this.rank = []; 

	this.startupGameRank = function()
	{
		//生产背景
		this.startupVisualGameObject(g_ResourceManager.rank, 0, 0, g_ResourceManager.rank.width, g_ResourceManager.rank.height, 0, 0, 1);

		//展示初始化分数
		var userScoreSet = false;
		var positionX = 470;
		var positionY;
		var score;

		for(var i=0; i<9; i++){
			score = (12000 - i*1000).toString();
			positionY = 124 + i*52;

			if(!userScoreSet && parseInt(score) <= g_score){
				this.rank.push(new GameFont().startupGameFont(g_score.toString(), 'M-white', 'right', positionX, positionY, 2));
				userScoreSet = true;
			}else{
				this.rank.push(new GameFont().startupGameFont(score, 'M-yellow', 'right', positionX, positionY, 2));
			}
			
		}

		return this;
	}

	this.mouseclick = function(event)
	{
		if(event.offsetX > 146 && event.offsetX < 362 && event.offsetY > 615 && event.offsetY < 658){
			//徘徊离开
			g_ApplicationManager.fade(function(){
				g_ApplicationManager.rank.shutdownGameRank();
				g_ApplicationManager.gameMenu = new GameMenu().startupGameMenu();	
			})
			
		}
	}

	this.shutdownGameRank = function()
	{
		for(var i=0, l=this.rank.length; i<l; i++){
			this.rank[i].shutdownGameFont();
		}
		this.shutdownVisualGameObject();
	}
}
GameRank.prototype = new VisualGameObject;

