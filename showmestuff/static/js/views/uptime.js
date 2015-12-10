(function () {
	var uptime = {
		data: null,
		
		urls: [],
		
		lastCheck: 0,
		
		template: null,
			
		create: function() {
			this.updateView();
		},
		
		update: function() {
			this.updateStats();
			this.updateView();
		},
		
		updateView: function() {
			if (!uptime.active) {
				return;
			}
			
			var currentTime = Date.now();
			
			for (var i=0; i < this.urls.length; i++) {
				var url  = this.urls[i];
				
				if ("down_timestamp" in this.data["sites"][url]) {
					this.data["sites"][url]["downtime"] = $.timeago(new Date(this.data["sites"][url]["down_timestamp"]));
				}
			}
			
			if (this.template === null) {
				this.template = Handlebars.compile($("#uptime").html());
			}
			
			if (!this.active) {
				return;
			};
			
			$("#content").html(this.template(this.data));
		},
		
		updateStats: function() {
			var currentTime = Date.now();
			
			if (this.lastCheck >= currentTime - 60000) {
				return;
			}
			
			this.lastCheck = currentTime;
			
			$.ajax({
				dataType: "json",
				type: "POST",
				url: "/uptime",
				data: {"urls": JSON.stringify(this.urls) },
				success: function(data) {
					// Humanize the data
					for (var i=0; i < uptime.urls.length; i++) {
						var url = uptime.urls[i];
						var site = uptime.data["sites"][url];
						
						site["checked"] = true;
						site["success"] = data[url]["success"];
						
						if ("error" in data[url]) {
							site["state"] = data[url]["status_text"];
						} else {
							site["state"] = data[url]["status_text"];
						}
						
						if (data[url]["success"] == true) {
							if ("down_timestamp" in uptime.data["sites"][url]) {
								delete site["down_timestamp"];
							}
							
							site["state_color"] = "green";
							site["elapsed"] = parseInt(data[url]["elapsed"]);
						} else {
							var currentTime = Date.now();
							
							if (!("down_timestamp" in site)) {
								site["down_timestamp"] = currentTime;
							}
							
							site["state_color"] = "red";
						}
					}
				}
			});
		},
		
		getTitle: function() {
			return "Uptime monitor";
		}
	};
	
	addView(uptime);
	
	uptime.data = {};
	uptime.data["sites"] = {};
	
	for (var i=0; i < uptimeSites[uptime.id].length; i++) {
		uptime.data["sites"][uptimeSites[uptime.id][i]["url"]] = {"name": uptimeSites[uptime.id][i]["name"],
												       "url": uptimeSites[uptime.id][i]["url"],
												       "state": "Not checked",
												       "state_color": "yellow",
												       "checked": false,
												       "success": false};
		
		uptime.urls.push(uptimeSites[uptime.id][i]["url"]);
	}
	
	uptime.updateStats();
})();