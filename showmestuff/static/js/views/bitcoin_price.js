(function () {	
	var bitcoin_price = {
		data: {
			last_text: "N/A",
			ask_text: "N/A",
			bid_text: "N/A",
			source_text: "N/A"
		},
		
		loaded: false,
		
		lastCheck: 0,
		
		api: bitcoinPrice[viewId]["api"],
		
		loaded: false,
		lastCheck: 0,
		
		chart: null,
			
		create: function() {
			this.loadView();
		},
		
		loadView: function() {
			var template = Handlebars.compile($("#bitcoin_price").html());
			$("#content").html(template(bitcoin_price.data));
			
			if ("chart_data" in bitcoin_price.data) {
				bitcoin_price.updateChart(true);
			}
		},
		
		updateChart: function(forceCreate) {
			forceCreate = typeof forceCreate !== 'undefined' ? forceCreate : false;
			
			if (bitcoin_price.chart === null || forceCreate) {
				var options = {
					strokeWidth: 3,
					axisLabelColor: "white",
					axes: {
						x: {
							axisValueFormatter: function(x) {
								return x * 1000;
							},
							ticker: Dygraph.dateTicker
						},
						y: {
							axisLabelFormatter: function(x) {
								return "$" + x;
							}
						}
					},
					showLabelsOnHiglight: false
				};
				
				bitcoin_price.chart = new Dygraph(document.getElementById("chart"),
												  bitcoin_price.data.chart_data,
												  options);
			} else if (bitcoin_price.chart !== null) {
				bitcoin_price.chart.updateOptions({
					file: bitcoin_price.data.chart_data
				});
			}
		},
		
		update: function() {
			bitcoin_price.updatePrice();
		},
		
		updateView: function() {
			if (!this.active) {
				return;
			};
			
			$("#last_text").html(bitcoin_price.data["last_text"]);
			$("#ask_text").html(bitcoin_price.data["ask_text"]);
			$("#bid_text").html(bitcoin_price.data["bid_text"]);
			$("#source_text").html(bitcoin_price.data["source_text"]);
		},
		
		updatePrice: function() {
			var currentTime = Date.now();
			
			if (this.lastCheck >= currentTime - 5000) {
				return;
			}
			
			this.lastCheck = currentTime;
			
			$.ajax({
				dataType: "json",
				type: "POST",
				url: "/bitcoin_price",
				data: {api: this.api},
				success: function(data) {
					bitcoin_price.data = data;
					
					// Turn the timestamps into Date objects so that dygraphs can deal with them
					for (var i=0; i < bitcoin_price.data.chart_data.length; i++) {
						bitcoin_price.data.chart_data[i][0] = new Date(bitcoin_price.data.chart_data[i][0]*1000);
					}
					
					bitcoin_price.updateView();
					bitcoin_price.updateChart();
				}
			});
		},
		
		getTitle: function() {
			return "Bitcoin price";
		}
	};
	
	addView(bitcoin_price);
})();