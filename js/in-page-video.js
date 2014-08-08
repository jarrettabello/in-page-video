(function(window){
	//Being In-Page-Video Ad
	
	var scriptName = "in-page-video.js"; //name of this script, used to get reference to own tag
    var jQuery; //jQuery Localized Value
    var jqueryPath = "http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js";  //jQuery CDN Link 
    var jqueryVersion = "1.8.3"; //Our jQuery Version we will use to compare against exisitng versions if applicable 
    var scriptTag; //reference to the html script tag
 
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
    
    
    // Get the specific ID of the ad you want played 
	var video_id = scriptTag.getAttribute('data-video-id');	

	var playerConfig = {
		
		default_width: 300,
		default_height: 200
		
	}; 

	var video_dimensions = {};
	video_dimensions.width = '';
	video_dimensions.height = '';	
	
	
	if ( scriptTag.hasAttribute('data-video-width') ) {
	
		video_dimensions.width = scriptTag.getAttribute('data-video-width');
	
	}else{
		
		video_dimensions.width = playerConfig.default_width;
		
	}
	
	if ( scriptTag.hasAttribute('data-video-height') ) {
	
		video_dimensions.height = scriptTag.getAttribute('data-video-height');
	
	}else{
		
		video_dimensions.height = playerConfig.default_height;
		
	}
	
	console.log(video_dimensions);
	
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

	function main () {}
	  
})(window);
