function GameObject()
{
    this.zOrder = 0;
    this.x = 0;
    this.y = 0;
    /**
        初始化对象，并且为游戏对象管理器添加事件 
        @参数 x        X坐标轴
        @参数 y        Y坐标轴
        @参数 z        出现的次序
    */
    this.startupGameObject = function(/**Number*/ x, /**Number*/ y, /**Number*/ z)
    {
        this.zOrder = z;
        this.x = x;
        this.y = y;
        g_GameObjectManager.addGameObject(this);
        return this;
    }
    
    this.shutdownGameObject = function()
    {
        g_GameObjectManager.removeGameObject(this);
    }
}