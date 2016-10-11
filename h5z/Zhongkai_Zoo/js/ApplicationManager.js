function ApplicationManager()
{
    this.gameMenu = null;
    /**
        初始化对象
        @定义 canvasWidth      canvas 的宽
        @定义 canvasHeight     canvas 的高
        @return                指向已经初始化了得对象
    */
    this.startupApplicationManager = function(canvasWidth, canvasHeight)
    {
        g_ApplicationManager = this;
        this.gameMenu = new GameMenu().startupGameMenu();
        this.sceneFade = {};
        g_GameObjectManager.addGameObject(this.sceneFade);
        return this;
    }

    this.fade = function(onDirChangeHandler, onFadeEndHandler){
        var direction = 1;
        var dirChange = false;

        this.sceneFade.update = function(dt, context, xScroll, yScroll){
            context.globalAlpha = context.globalAlpha - direction*0.02;

            if( !dirChange && context.globalAlpha < 0.02){
                //改变透明度变换值的方向
                context.globalAlpha = 0;
                direction = -1;
                dirChange = true;
                if(onDirChangeHandler){
                    onDirChangeHandler();
                }
            }

            if(dirChange && context.globalAlpha > 0.98){
                //调透明度，隐藏成功
                context.globalAlpha = 1;
                this.update = null;
                if(onFadeEndHandler){
                    onFadeEndHandler();
                }
                
            }
        }
        
    }

    this.shutdownFade = function(){
        g_GameObjectManager.removeGameObject(this.sceneFade);
    }

    this.nextStage = function(){
        this.gamePlay.nextStage();
    }

}