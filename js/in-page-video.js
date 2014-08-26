(function(window, document){
	//Being In-Page-Video Ad	
	var mobile_device = false;
	var is_android = false;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	
		mobile_device = true;
		
		if( /Android/i.test(navigator.userAgent) ) {
		
			is_android = true;
		
		}
		
		console.log('mobile device' + navigator.userAgent);
	
	}
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
	var video_duration;
	var videoPlayerVisible = false;
	var scrollPassed = false;
	var video_placement;
	var video_event_25 = false;
	var video_event_50 = false;
	var video_event_75 = false;
	var video_event_complete = false;
	var is_muted = false;
	var hover_sound_config = false;
	var is_showing_hoverIcon = false;
	// Here is our embed code script tag
    var scriptTag = targetScripts[targetScripts.length - 1];
    
    //Bind scrollControl function to window scroll event
    window.onscroll = scrollControl;
    
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
	
	//create default configuration for player
	var playerConfig = {
		
		default_width: 300,
		default_height: 200,
		clickthrough_url: '',
		completion_url: '',
		autoplay: false,
		controls: false,
		muted: false
		
	}; 
	
	//Check for supplied video dimensions (if non-existent fall back to default config)
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
	
	
	//Check for supplied urls for progress based events at 25%
	if ( scriptTag.hasAttribute('data-event-25') ) {
	
		video_event_25 = scriptTag.getAttribute('data-event-25');
	
	}
	
	//Check for supplied urls for progress based events at 50%
	if ( scriptTag.hasAttribute('data-event-50') ) {
	
		video_event_50 = scriptTag.getAttribute('data-event-50');
	
	}	
	//Check for supplied urls for progress based events at 75%
	if ( scriptTag.hasAttribute('data-event-75') ) {
	
		video_event_75 = scriptTag.getAttribute('data-event-25');
	
	}
	
	//Check for supplied urls for progress based events at completion
	if ( scriptTag.hasAttribute('data-event-complete') ) {
	
		video_event_complete = scriptTag.getAttribute('data-event-complete');
	
	}
		
	//Check if player has been set to be muted
	if ( scriptTag.hasAttribute('data-muted') ) {
	
		user_mute_option = scriptTag.getAttribute('data-muted');
		
		if(user_mute_option == 'true') {
			
			is_muted = true;
			playerConfig.muted = true;
			
			
		}
	
	}
	
	
	
	//Check for click-thru Url
	if ( scriptTag.hasAttribute('data-click-url') ) {
	
		var click_thru_url = scriptTag.getAttribute('data-click-url');
		
		var click_thru_link = document.createElement('a');
		
		click_thru_link.href =  click_thru_url;
		click_thru_link.target = '_blank';
		
		
	
	}
	
	//Start to contruct our page containers and player	
	var pageContainer = document.createElement('div');
	
	pageContainer.id = 'pw-page-container';
	
	pageContainer.style.visbility = 'hidden';
	pageContainer.style.textAlign = 'center';
	
	var videoContainer = document.createElement('div');
	videoContainer.id = 'pw-video-container';
	videoContainer.setAttribute('style','display:none;position:relative;margin:0 auto');
	videoContainer.style.width = video_dimensions.width + 'px';
	videoContainer.style.height = (video_dimensions.height + 30)  + 'px';
	pageContainer.appendChild(videoContainer);
	
	
	//Create Close Button - but will not place until video is open
	var closeVideo = document.createElement('div');
	closeVideo.id = 'pw-close-button';
	if(!mobile_device) {
		
		closeVideo.setAttribute('style', 'position:absolute;background-color:rgba(255,255,255,.5);padding:4px 10px;top:12px;right:4px;font-size:10px;cursor:pointer;border-radius:10px;display:none;z-index:4');
		closeVideo.innerHTML = 'CLOSE <img src="img/button-close-black.png" height="10" style="vertical-align:middle"/>';
		
	}else{
		
		closeVideo.setAttribute('style', 'position:relative;background-color:rgba(255,255,255,.5);text-align:center;padding:4px 10px;font-size:14px;cursor:pointer;display:none;');
		closeVideo.innerHTML = 'CLOSE <img src="img/button-close-black.png" height="10" style="vertical-align:middle"/>';
		
	}
	
	var hoverMuteIcon = document.createElement('div');
	hoverMuteIcon.id = 'pw-hover-mute';
	hoverMuteIcon.setAttribute('style', 'position:absolute;background-color:rgba(255,255,255,.5);padding:4px 0;text-align:center;bottom:42px;right:4px;font-size:10px;cursor:pointer;border-radius:10px;width:30%;left:50%;margin-left:-15%;display:none;pointer-events:none;');
	hoverMuteIcon.innerHTML = 'Mouse over video for audio <img src="img/volume-unmute.png" height="10" style="vertical-align:middle"/>';
	
	
	var play_overlay  = document.createElement('img');
	play_overlay.id = 'pw-play-overlay';
	play_overlay.src = 'img/pw-play-overlay.png';
	play_overlay.width = 270;
	play_overlay.height = 200;
	play_overlay.setAttribute('style', 'position:absolute;z-index:3;left:50%;margin-left:-135px;top:50%;margin-top: -115px;');
	
	//videoContainer.appendChild(play_overlay);
	
	//Create Our Own Mute Button
	var mute_button = document.createElement('img');
	mute_button.id = 'pw-mute-button';
	if (is_muted) {
	
		mute_button.src = 'img/volume-mute.png';	
	
	}else{
		
		mute_button.src = 'img/volume-unmute.png';
		
	}
	
	mute_button.width = 20;
	mute_button.height = 20;
	mute_button.title = 'Toggle Mute';
	mute_button.setAttribute('style', 'position:absolute;z-index:3;right:4px;bottom:45px;cursor:pointer;display:none');
	
	
	
	//Start Creating Our Video Player	
	var videoPlayer = document.createElement('video');
	
	//Check if player has been set to detect mouse over for audio toggle
	if ( scriptTag.hasAttribute('data-hover-sound') ) {
		
		hover_sound = scriptTag.getAttribute('data-hover-sound');
		
		if(hover_sound == 'true') {
		
		hover_sound_config = true;	
		is_muted = true;
		playerConfig.muted = true;
		videoPlayer.addEventListener('mouseover', function(event){
						
			
			is_muted = false;
			if(!hover_sound_config) mute_button.src = 'img/volume-unmute.png';
			videoPlayer.muted = false;		
			return;
			
		});
		videoPlayer.addEventListener('mouseout', function(event){
						
			var e = event.relatedTarget;
			//console.log('mouseover ' + e.id);
		    
		    if (e.id == 'pw-hover-mute' || e.id == 'pw-close-button' ) {
		        return;
		    }
			
			is_muted = true;
			
			if(!hover_sound_config) mute_button.src = 'img/volume-mute.png';
			videoPlayer.muted = true;		
			return;
			
		});
			
			
		}
		
	
			
	}
	
	
	videoContainer.appendChild(videoPlayer);
	
	if(click_thru_link) {
		
		click_thru_link.appendChild(videoPlayer);
		videoContainer.appendChild(click_thru_link);
		
	}else{
		
		videoContainer.appendChild(videoPlayer);
		
	}
	
	videoPlayer.id = 'in-page-video';	
	
	//If broswer supports MP4 start setting up the source - Firefox does not play mp4 natively 
	if(canPlay_MP4) {
		
		var source_MP4 = document.createElement('source');
		source_MP4.type = 'video/mp4';
		source_MP4.src = cloudFront + '/cod-1080.mp4';
		videoPlayer.appendChild(source_MP4);
		
	}
	
	if(canPlay_OGV) {
		
		var source_OGV = document.createElement('source');
		source_OGV.type = 'video/ogg';
		source_OGV.src = cloudFront + '/cod-1080.ogv';
		videoPlayer.appendChild(source_OGV);
		
	}
	
	//Setup final player options	
	videoPlayer.width = video_dimensions.width;
	videoPlayer.height = video_dimensions.height;
	videoPlayer.autoplay = playerConfig.autoplay;
	videoPlayer.controls = playerConfig.controls;
	videoPlayer.muted = playerConfig.muted;	
	videoPlayer.onended = videoComplete; 
	
	
	//Setup player event listeners 
	//Once player is ready get the length of the video
	videoPlayer.addEventListener('canplay', function(){	
	
		video_duration = videoPlayer.duration;
			
	});	
	
	
	
	//As the video progresses fire off various actions based on elapsed time completed
	videoPlayer.addEventListener('progress', function(){	
		
		var currentTime = videoPlayer.currentTime;		
		
		var pct_complete = (currentTime / video_duration);
		
		pct_complete = (Math.round(pct_complete * 100) / 100);
		
		//console.log(pct_complete);
		
		if (pct_complete >= .25 && pct_complete < .26 && video_event_25 != false) { 
		
			
			video_event_25_saved =  video_event_25;
			video_event_25 = false;
			console.log('Video is 25% complete') 
			
			
		}
		
		if (pct_complete >= .50 && pct_complete < .51 && video_event_50 != false) { 

			video_event_50_saved =  video_event_50;
			video_event_50 = false;			
			console.log('Video is 50% complete') 
		
		}
		
		if (pct_complete >= .75 && pct_complete < .76 && video_event_75 != false) { 
		
			video_event_75_saved =  video_event_75;
			video_event_75 = false;			
			console.log('Video is 75% complete') }
	
	});	
	
	
	videoPlayer.addEventListener('play', function() {
		
		//before video play check to see if hover is set - if set, dont show the mute toggle button
			if (!hover_sound_config) {
				
				
				setTimeout(function(){
					
					videoContainer.appendChild(mute_button);
					jQuery(mute_button).fadeIn('slow');
					mute_button.addEventListener('click', toggleMute);
					
				}, 500);
				
				
			}else{
				
				setTimeout(function(){
					
					is_showing_hoverIcon = true;
					videoContainer.appendChild(hoverMuteIcon);
					jQuery(hoverMuteIcon).fadeIn('slow');
					
					videoPlayer.addEventListener('mouseover', function(event){
						
						var e = event.fromElement || event.relatedTarget;
						console.log('mouseover ' + e.id);
					   if (e.id == 'pw-hover-mute' || e.id == 'pw-close-button' ) {
					        return;
					    }
						
						jQuery(hoverMuteIcon).fadeOut('fast', function() {
							
							is_showing_hoverIcon = false;
							
						});			
						return;
						
					});
					
					videoPlayer.addEventListener('mouseout', function(event){
						var e = event.relatedTarget;
						console.log(event);
						if ( e.id == 'pw-close-button') {
					        return;
					    }
						
						jQuery(hoverMuteIcon).fadeIn('slow', function() {
							
							is_showing_hoverIcon = true;
							
						});			
						return;
					});	
					
				}, 500);		
				//Append hover - mute notifcaction 
				
				
			}
			
			setTimeout(function(){
				
					videoContainer.appendChild(closeVideo);
					jQuery(closeVideo).fadeIn('slow');
					
			}, 500);
			
			
		
		
	});
	
	
	closeVideo.addEventListener('click', videoComplete);
	
	//Handle Page Scroll Events to conrol video display, play and pause based on scrolling
	function scrollControl () {
		
		video_placement = pageContainer.getBoundingClientRect();
		var video_from_top = window.innerHeight - video_placement.top;
				
		console.log(video_placement.top);
		
		if(!videoPlayerVisible) {
		
			console.log('video player invisible');			
			
			//console.log(video_placement.top);
				
			if (  video_placement.top  < ( window.innerHeight - (video_dimensions.height / 2))  ) {
				
				showVideo();				
			}
			
		}else{
			
			if (video_placement.top <= (video_dimensions.height / 2) * -1 ) {
				
				videoPlayer.pause();
				
				return;
				
			}else{
				
				if( (window.innerHeight - video_placement.top) < (video_dimensions.height / 2)) {
					
					
					videoPlayer.pause();
					
					return;
					
				}else{
				
					playVideo ()
				
					return;
				
				}				
				
			}			
			
		}	
		
	}	
	
	function showVideo() {
	
		console.log('Show Video');
		
		videoPlayerVisible = true;
				
		pageContainer.style.visibility = 'visible';
		
		jQuery(videoContainer).slideDown('slow', playVideo);
		
		
		
		
		return;

		
	}
	
	function playVideo () {
		
		if(!mobile_device) {
		
				
			
			if (!mobile_device || mobile_device == false){
				
				console.log('playing non mobile');
				videoPlayer.play();	
				
			}	

		}
				
	}
	
	function videoComplete () {
		
		jQuery(videoPlayer).fadeOut('slow', function() {
			
			//solution for removing player when audio still plays
			videoPlayer.pause();
			videoPlayer.src = "";
			pageContainer.parentNode.removeChild(pageContainer);
			
		});		
		
	}
	
	//Function to detect if Video is present on page without scrolling - added delay for effect
	function checkIfVisible () {
		
		if(video_placement.top <= window.innerHeight) {
			
			console.log('is visible');
			
			setTimeout( showVideo, 1000);			
			
		}
		
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

        jQuery(document).ready(function(){

			
			checkIfVisible();
			
		});

        main();
    }	

	function main () {
		
		scriptTag.parentNode.insertBefore(pageContainer, scriptTag);
		video_placement = pageContainer.getBoundingClientRect();
		console.log(document.getElementsByTagName("video")[0].error);
				
	}
	
	
	  
})(window, document);
