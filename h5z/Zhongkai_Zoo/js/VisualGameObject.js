function VisualGameObject()
{
    this.image = null; 
    this.sx = 0;
    this.sy = 0;
    this.width = 0;
    this.height = 0;

    /**
        绘制元素到画板
        @参数 dt 每秒绘制次数
		@参数 context 绘制内容
		@参数 xScroll 全局的X轴的滚动值 
		@参数 yScroll 全局的Y轴的滚动值  
    */
    this.draw = function(dt, context, xScroll, yScroll)
    {
        context.drawImage(this.image, this.sx, this.sy, this.width, this.height, this.x - xScroll, this.y - yScroll, this.width, this.height);  
    }
    
    /**
        初始化对象
        @参数 image 展示的图片
		@参数 x X轴的坐标
        @参数 y Y轴的坐标
		@参数 z 深度
        @参数 sx 剪切图片的x坐标
        @参数 sy 剪切图片的y坐标
        @参数 width 剪切图片的宽度
        @参数 height 剪切图片的高度
    */
    this.startupVisualGameObject = function(image, sx, sy, width, height, x, y, z)
    {
        this.startupGameObject(x, y, z);
        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.width = width;
        this.height = height; 
        return this;
    }

    this.setImage = function(image, sx, sy, width, height, x, y)
    {
        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    this.shutdownVisualGameObject = function()
    {
        this.shutdownGameObject();
        this.image = null;
    }

}
VisualGameObject.prototype = new GameObject;