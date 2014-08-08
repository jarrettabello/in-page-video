(function(window, document){
	//Being In-Page-Video Ad
	
	var scriptName = "in-page-video.js"; //name of this script, used to get reference to own tag
    var jQuery; //jQuery Localized Value
    var jqueryPath = "http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js";  //jQuery CDN Link 
    var jqueryVersion = "1.8.3"; //Our jQuery Version we will use to compare against exisitng versions if applicable 
    var scriptTag; //reference to the html script tag
	var cloudFront = "//d1v1bst0cz7e65.cloudfront.net";
    // Self realization - Find our Embed Script
    var pageScripts = document.getElementsByTagName('script');
    var targetScripts = [];
    for (var i in pageScripts) {
        var name = pageScripts[i].src
        if(name && name.indexOf(scriptName) > 0)
            targetScripts.push(pageScripts[i]);
    }
	
	// Here is our embed code script tag
    var scriptTag = targetScripts[targetScripts.length - 1];
    
    // Helper function to load external css files
	    function loadCss(href) {
        var link_tag = document.createElement('link');
        link_tag.setAttribute("type", "text/css");
        link_tag.setAttribute("rel", "stylesheet");
        link_tag.setAttribute("href", href);
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
    }
	
	// Helper function to load external scripts and place them in the head of the document
	function loadScript(src, onLoad) {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", src);
 
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    onLoad();
                }
            };
        } else {
            script_tag.onload = onLoad;
        }
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    }
	
	
	//Detect Support for html5 Video Object
	var supportsVideoElement = !!document.createElement('video').canPlayType;
	

	//If Browser Supports html5 video start testing for file type compatability
	if(supportsVideoElement) {
		
		var temp = document.createElement('video');
		
		var canPlay_MP4 = temp.canPlayType('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
		
		var canPlay_OGV = temp.canPlayType('video/ogg; codecs="theora,vorbis"');
		
		var canPlay_WEMB = temp.canPlayType('video/webm; codecs="vp8,vorbis"');		
		
	}
	
	

    // Get the specific ID of the ad you want played 
	var video_id = scriptTag.getAttribute('data-video-id');	

	var playerConfig = {
		
		default_width: 300,
		default_height: 200,
		clickthrough_url: '',
		completion_url: '',
		autoplay: true
		
	}; 

	var video_dimensions = {};
	
	video_dimensions.width = '';
	
	video_dimensions.height = '';	
	
	
	if ( scriptTag.hasAttribute('data-video-width') ) {
	
		video_dimensions.width = parseInt(scriptTag.getAttribute('data-video-width'));
	
	}else{
		
		video_dimensions.width = playerConfig.default_width;
		
	}
	
	if ( scriptTag.hasAttribute('data-video-height') ) {
	
		video_dimensions.height = parseInt(scriptTag.getAttribute('data-video-height'));
	
	}else{
		
		video_dimensions.height = playerConfig.default_height;
		
	}
	
	
	//Start Creating Our Video Player	
	var videoPlayer = document.createElement('video');
	
	videoPlayer.id = 'in-page-video';	
	
	//If broswer supports MP4 start setting up the source
	if(canPlay_MP4) {
		
		var source_MP4 = document.createElement('source');
		source_MP4.type = 'video/mp4';
		source_MP4.src = cloudFront + '/cod-1080.mp4';
		videoPlayer.appendChild(source_MP4);
		
	}
	
	videoPlayer.width = video_dimensions.width;
	videoPlayer.height = video_dimensions.height;
	videoPlayer.autoplay = playerConfig.autoplay;

	
	
	console.log(video_dimensions);
	
	
    // Check for existance of jQuery and localize our version if ours is newer
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== jqueryVersion) {
        loadScript(jqueryPath, initjQuery);
    } else {
        initjQuery();
    }
 
	//No Conflict Mode Prevents Errors with other sites
    function initjQuery() {
        jQuery = window.jQuery.noConflict(true);
        main();
    }	

	function main () {
		
		scriptTag.parentNode.insertBefore(videoPlayer, scriptTag);
		
	}
	  
})(window, document);
