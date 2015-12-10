(function () {
	var cpu_ram_info = {
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
				var template = Handlebars.compile($("#systeminfo_cpu_ram").html());
				$("#content").html(template(cpu_ram_info.data));
			}
		},
		
		update: function() {
			cpu_ram_info.updateStats();
		},
		
		updateView: function() {
			if (!cpu_ram_info.active) {
				return;
			};
			
			for (var i=0; i < cpu_ram_info.data["cpus"].length; i++) {
				var percent = cpu_ram_info.data["cpus"][i]["percent"];
				var state = cpu_ram_info.data["cpus"][i]["state"];
				
				$("#cpu_" + i + "_progress").css("width", percent + "%").html(percent + "%")
											.attr("class", "progress-bar-label progress-bar progress-bar-" + state);
			}
			
			var percent = cpu_ram_info.data["ram"]["vm_percent"];
			var state = cpu_ram_info.data["ram"]["vm_state"];
			
			var used = cpu_ram_info.data["ram"]["vm_used_hm"];
			var total = cpu_ram_info.data["ram"]["vm_total_hm"];
			
			$("#vm_usage_progress").css("width", percent + "%").html(percent + "%")
								   .attr("class", "progress-bar-label progress-bar progress-bar-" + state);
			
			$("#vm_used_hm").html(used);
			$("#vm_total_hm").html(total);
		},
		
		updateStats: function() {
			$.getJSON("/cpu_ram", function(data) {
				cpu_ram_info.data = data;
				
				// Humanize the data
				for (var i=0; i < cpu_ram_info.data["cpus"].length; i++) {
					var percent = cpu_ram_info.data["cpus"][i]["percent"];
					
					if (percent <= 10) {
						cpu_ram_info.data["cpus"][i]["state"] = "default";
					} else if (percent <= 33) {
						cpu_ram_info.data["cpus"][i]["state"] = "success";
					} else if (percent <= 66) {
						cpu_ram_info.data["cpus"][i]["state"] = "warning";
					} else {
						cpu_ram_info.data["cpus"][i]["state"] = "danger";
					}
				}
				
				cpu_ram_info.data["ram"]["vm_used_hm"] = Humanize.filesize(cpu_ram_info.data["ram"]["vm_used"]);
				cpu_ram_info.data["ram"]["vm_total_hm"] = Humanize.filesize(cpu_ram_info.data["ram"]["vm_total"]);
				
				var vm_used = cpu_ram_info.data["ram"]["vm_used"];
				var vm_total = cpu_ram_info.data["ram"]["vm_total"];
				
				var state = "success";
				var percent = parseInt(parseFloat(vm_used) / parseFloat(vm_total) * 100.0);
				if (percent <= 33) {
					state = "success";
				} else if (percent <= 66) {
					state = "warning";
				} else {
					state = "danger";
				}
				
				cpu_ram_info.data["ram"]["vm_state"] = state;
				cpu_ram_info.data["ram"]["vm_percent"] = percent;
				
				if (!cpu_ram_info.loaded) {
					cpu_ram_info.loaded = true;
					cpu_ram_info.loadView();
				} else {
					cpu_ram_info.updateView();
				}
			});
		},
		
		getTitle: function() {
			return "CPU and RAM usage";
		}
	};
	
	addView(cpu_ram_info);
})();