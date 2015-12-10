(function () {	
	var disk_usage = {
		data: null,
		
		loaded: false,
			
		create: function() {
			this.data = null;
			this.loaded = false;
			
			this.loadView();
		},
		
		loadView: function() {
			if (this.data === null) {
				this.updateStats();
			} else {
				var template = Handlebars.compile($("#systeminfo_disk_usage").html());
				$("#content").html(template(disk_usage.data));
			}
		},
		
		update: function() {
			disk_usage.updateStats();
		},
		
		updateView: function() {
			if (!disk_usage.active) {
				return;
			};
			
			for (var i=0; i < disk_usage.data["disks"].length; i++) {
				var percent = disk_usage.data["disks"][i]["percent"];
				var state = disk_usage.data["disks"][i]["state"];
				
				$("#disk_" + i + "_progress").css("width", percent + "%").html(percent + "%")
											 .removeClass().attr("class", "progress-bar-label progress-bar progress-bar-" + state);
				
				$("#" + i + "_used_hm").html(disk_usage.data["disks"][i]["used_hm"]);
				$("#" + i + "_total_hm").html(disk_usage.data["disks"][i]["total_hm"]);
			}
		},
		
		updateStats: function() {
			$.getJSON("/disk_usage", function(data) {
				disk_usage.data = data;
				
				// Humanize the data
				for (var i=0; i < disk_usage.data["disks"].length; i++) {
					var used = disk_usage.data["disks"][i]["used"];
					var total = disk_usage.data["disks"][i]["total"];
					
					var percent = parseInt(parseFloat(used) / parseFloat(total) * 100.0);
					
					disk_usage.data["disks"][i]["percent"] = percent;
					
					if (percent <= 33) {
						disk_usage.data["disks"][i]["state"] = "success";
					} else if (percent <= 66) {
						disk_usage.data["disks"][i]["state"] = "warning";
					} else {
						disk_usage.data["disks"][i]["state"] = "danger";
					}
					
					disk_usage.data["disks"][i]["disk_id"] = i;
					disk_usage.data["disks"][i]["used_hm"] = Humanize.filesize(disk_usage.data["disks"][i]["used"]);
					disk_usage.data["disks"][i]["total_hm"] = Humanize.filesize(disk_usage.data["disks"][i]["total"]);
				}

				disk_usage.data["disks_template"] = splitChunks(disk_usage.data["disks"], 3);
				
				if (!disk_usage.loaded) {
					disk_usage.loaded = true;
					disk_usage.loadView();
				} else {
					disk_usage.updateView();
				}
			});
		},
		
		getTitle: function() {
			return "Disk usage";
		}
	};
	
	addView(disk_usage);
})();