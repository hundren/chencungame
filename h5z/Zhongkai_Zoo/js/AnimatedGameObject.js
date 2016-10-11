function AnimatedGameObject()
{

    this.currentFrame = 0;
    this.frameWidth = 0;
    this.timeBetweenFrames = 0;
    this.timeSinceLastFrame = 0;
    this.frameCount = 0;

    /**
        初始化对象
        @定义 image 展示图象
		@定义 x X轴的坐标位置
        @定义 y Y轴的坐标位置
		@定义 z  深度
        @定义 frameCount 框架里展示的图片数量       
        @定义 fps 每秒展示的图片数
    */
    this.startupAnimatedGameObject = function(image, sx, sy, width, height, x, y, z, frameCount, fps)
    {
        if (frameCount <= 0) throw "framecount can not be <= 0";
        if (fps <= 0) throw "fps can not be <= 0"

        this.startupVisualGameObject(image, sx, sy, width, height, x, y, z);
        this.currentFrame = 0;
        this.frameWidth = width;
        this.frameCount = frameCount;
        this.timeBetweenFrames = 1/fps;
        this.timeSinceLastFrame = this.timeBetweenFrames;
        
        return this;
    }

    this.shutdownAnimatedGameObject = function()
    {
        this.shutdownVisualGameObject();       
    }

    this.setAnimation = function(image, sx, sy, width, height, x, y, frameCount, fps)
    {
        if (frameCount <= 0) throw "framecount can not be <= 0";
        if (fps <= 0) throw "fps can not be <= 0";
        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.currentFrame = 0;
        this.frameWidth = width;
        this.frameCount = frameCount;
        this.timeBetweenFrames = 1/fps;
        this.timeSinceLastFrame = this.timeBetweenFrames;
    }

    /**
        把这些元素放到后台
        @定义 dt 每次计时器时间
		@定义 context 绘制内容
		@定义 xScroll X轴的全局滚动值
		@定义 yScroll Y轴的全局滚动值
    */

    this.draw = function(dt, context, xScroll, yScroll)
    {
        var sourceX = this.frameWidth * this.currentFrame;
        context.drawImage(this.image, sourceX, this.sy, this.width, this.height, this.x - xScroll, this.y - yScroll, this.width, this.height);

        this.timeSinceLastFrame -= dt;
        if (this.timeSinceLastFrame <= 0)
        {
           this.timeSinceLastFrame = this.timeBetweenFrames;
           ++this.currentFrame;
           this.currentFrame %= this.frameCount;
        }
    }

}

AnimatedGameObject.prototype = new VisualGameObject;