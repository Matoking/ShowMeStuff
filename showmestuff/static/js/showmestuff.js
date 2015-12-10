// Helper methods
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

/*
 * Splits array into a list of arrays of defined size
 * eg. [1, 2, 3, 4, 5, 6] -> [[1,2,3],[4,5,6]]
 */
splitChunks = function(arr, n) {
	var result = [];
	
	for (var i=0; i<arr.length; i+=n) {
		var tempArray = arr.slice(i,i+n);
		result.push(tempArray);
	}
	
	return result;
};

var show = {
	currentView: null,
	currentIndex: 0,
	
	// Whether view changes automatically
	autoPlay: true,
	
	views: [],
	
	autoPlayInterval: null,
	hidePanelTimeout: null,
	
	create: function() {
		this.showView(0);
		
		window.setInterval(show.update, 1000);
		this.autoPlayInterval = window.setInterval(show.gotoNextView, (viewChangeInterval*1000));
		this.hidePanelTimeout = window.setTimeout(show.hidePanel, 2000);
	},
	
	showView: function(index) {
		if (this.currentView != null) {
			$("#content").html("");
			this.currentView.active = false;
		}
		
		if (!(index in this.views)) {
			console.log("View not loaded");
			return;
		}
		
		this.currentView = this.views[index];
		this.currentIndex = index;
		this.currentView.active = true;
		
		this.currentView.create();
		show.setTitle(show.currentView.getTitle());
		this.currentView.update();
	},
	
	gotoNextView: function() {
		show.currentIndex += 1;
		
		if (show.currentIndex > show.views.length - 1) {
			show.currentIndex = 0;
		}
		
		show.showView(show.currentIndex);

		if (this.autoPlay) {
			window.clearInterval(this.autoPlayInterval);
			this.autoPlayInterval = window.setInterval(show.gotoNextView, (viewChangeInterval*1000));
		}
	},
	
	gotoPreviousView: function() {
		show.currentIndex -= 1;
		
		if (show.currentIndex < 0) {
			show.currentIndex = show.views.length-1;
		}
		
		show.showView(show.currentIndex);
		
		if (this.autoPlay) {
			window.clearInterval(this.autoPlayInterval);
			this.autoPlayInterval = window.setInterval(show.gotoNextView, (viewChangeInterval*1000));
		}
	},
	
	toggleAutoPlay: function() {
		if (this.autoPlay) {
			window.clearInterval(this.autoPlayInterval);
			$("#autoplay_button span").attr("class", "glyphicon glyphicon-play");
		} else {
			this.autoPlayInterval = window.setInterval(show.gotoNextView, (viewChangeInterval*1000));
			$("#autoplay_button span").attr("class", "glyphicon glyphicon-pause");
		}
		
		this.autoPlay = !this.autoPlay;
	},
	
	showPanel: function() {
		if (this.hidePanelTimeout !== null) {
			window.clearTimeout(this.hidePanelTimeout);
		}
		
		if (show.currentView !== null && "showPanel" in show.currentView) {
			show.currentView.showPanel();
		}
		
		$("#view_control_panel").show();
		$("#content").animate({
			"padding-top": $("#view_control_panel").height() + "px"
		});
		
		this.hidePanelTimeout = window.setTimeout(show.hidePanel, 2000);
	},
	
	hidePanel: function() {
		$("#content").animate({
			"padding-top": "0px"
		});
		$("#view_control_panel").fadeOut();
		
		if (show.currentView !== null && "hidePanel" in show.currentView) {
			show.currentView.hidePanel();
		}
	},
	
	refreshPage: function() {
		location.reload();
	},
	
	update: function() {
		show.setTitle(show.currentView.getTitle());
		show.currentView.update();
	},
	
	setTitle: function(title) {
		$("#titlebar_view_title").html(title);
	},
};

function addView(view) {
	view.id = viewId;
	view.active = false;
	
	show.views.push(view);
};

function updateTime() {
	var time = new Date();
	var seconds = "" + ((time.getHours() * 3600) + (time.getMinutes() * 60) + time.getSeconds());
	
	var timeString = seconds.toHHMMSS();
	
	$("#titlebar_time").html(timeString);
}

$(document).ready(function() {
	window.setInterval(updateTime, 1000);
	updateTime();
	
	show.create();
});