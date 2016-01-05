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
		timespan: bitcoinPrice[viewId]["timespan"],
		
		loaded: false,
		lastCheck: 0,
		
		chart: null,
		
		updateInterval: null,
			
		create: function() {
			this.loadView();
			
			// Keep updating the price even if the view is not active
			if (this.updateInterval === null) {
				this.updateInterval = window.setInterval(function() { bitcoin_price.updatePrice(); }, 5000);
			}
		},
		
		destroy: function() {
			if (bitcoin_price.chart !== null) {
				bitcoin_price.chart.destroy();
				bitcoin_price.chart = null;
			}
		},
		
		loadView: function() {
			var template = Handlebars.compile($("#bitcoin_price").html());
			$("#content").html(template(bitcoin_price.data));
			
			if ("chart_data" in bitcoin_price.data) {
				bitcoin_price.updateChart(true);
			}
		},
		
		updateChart: function(forceCreate) {
			if (!this.active) {
				return;
			}
			
			forceCreate = typeof forceCreate !== 'undefined' ? forceCreate : false;
			
			if (bitcoin_price.chart === null || forceCreate) {
				var options = {
					strokeWidth: 3,
					rollPeriod: 10,
					axisLabelColor: textColor,
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
			
			if (bitcoin_price.lastCheck >= currentTime - 5000) {
				return;
			}
			
			bitcoin_price.lastCheck = currentTime;
			
			$.ajax({
				dataType: "json",
				type: "POST",
				url: "/bitcoin_price",
				data: {api: bitcoin_price.api,
					   timespan: bitcoin_price.timespan},
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