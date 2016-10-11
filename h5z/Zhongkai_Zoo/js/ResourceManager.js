function ResourceManager()
{
    this.imageProperties = null;
	/**
        初始化对象
		@参数 images	图片的名字和位置
        @return 		指向已经初始化的对象
    **/
    this.startupResourceManager = function(images)
    {
		g_ResourceManager = this;

        this.imageProperties = new Array();

        for ( var i = 0; i < images.length; i++ )
		{
			var thisImage = new Image;
			this[images[i].name] = thisImage;
			this.imageProperties.push(images[i].name);
			thisImage.src = images[i].src;
		}

        return this;
    }
}