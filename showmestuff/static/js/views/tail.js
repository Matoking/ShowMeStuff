(function() {
	var tail = {
		file: tailFile,
		data: {text: ""},
		
		title: tailTitle,
		
		fontSize: tailFontSize,
		
		create: function() {
			this.loadView();
		},
		
		loadView: function() {
			var template = Handlebars.compile($("#tail").html());
			$("#content").html(template(this.data));
			$("#tail_text").css("font-size", this.fontSize + "px");
			
			$("#increase_size").click(function() {
				tail.increaseFontSize();
			});

			$("#decrease_size").click(function() {
				tail.decreaseFontSize();
			});
		},
		
		updateView: function() {
			if (!this.active) {
				return;
			};
			
			$("#tail_text").html(this.data.text);

			$("#tail_text").scrollTop($("#tail_text").prop("scrollHeight"));
			$("#tail_text").css("font-size", this.fontSize + "px");
		},
		
		updateText: function() {
			$.ajax({
				dataType: "json",
				type: "POST",
				url: "/tail",
				data: {"file": this.file},
				success: function(data) {
					// Humanize the data
					tail.data.text = data.text;
					
					tail.updateView();
				}
			});
		},
		
		increaseFontSize: function() {
			this.fontSize += 2;
			
			this.updateView();
		},
		
		decreaseFontSize: function() {
			this.fontSize -= 2;
			
			this.updateView();
		},
		
		showPanel: function() {
			$("#increase_size").show();
			$("#decrease_size").show();
		},
		
		hidePanel: function() {
			$("#increase_size").hide();
			$("#decrease_size").hide();
		},
		
		update: function() {
			this.updateText();
		},
		
		getTitle: function() {
			return this.title;
		}
	};
	
	addView(tail);
})();