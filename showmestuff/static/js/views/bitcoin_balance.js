(function () {	
	var bitcoin_balance = {
		data: null,
		
		loaded: false,
		
		lastCheck: 0,
		
		address: bitcoinBalance[viewId]["address"],
		label: bitcoinBalance[viewId]["label"],
		
		loaded: false,
		lastCheck: 0,
			
		create: function() {
			this.loadView();
		},
		
		loadView: function() {
			if (this.data === null) {
				this.updateStats();
			} else {
				this.updateView();
			}
		},
		
		update: function() {
			bitcoin_balance.updateStats();
		},
		
		updateView: function() {
			if (!bitcoin_balance.active) {
				return;
			};
			
			for (var i=0; i < bitcoin_balance.data["recent_txs"].length; i++) {
				var tx = bitcoin_balance.data["recent_txs"][i];
				
				tx["time"] = $.timeago(new Date(tx["timestamp"]));
			}
			
			var template = Handlebars.compile($("#bitcoin_balance").html());
			$("#content").html(template(bitcoin_balance.data));
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
				url: "/bitcoin_balance",
				data: {"address": this.address},
				success: function(data) {
					// Humanize the data
					for (var i=0; i < data["recent_txs"].length; i++) {
						var tx = data["recent_txs"][i];
						
						tx["timestamp"] *= 1000;
						
						var amount = tx["received"] - tx["sent"];
						
						if (amount < 0) {
							tx["send"] = true;
						} else {
							tx["receive"] = true;
						}
						
						tx["amount"] = (parseFloat(amount) / 1e8) + " BTC";
						tx["hash"] = tx["hash"].substring(0, 32) + "...";
					}
					
					data["final_balance"] = (parseFloat(data["final_balance"]) / 1e8) + " BTC";
					data["total_received"] = (parseFloat(data["total_received"]) / 1e8) + " BTC";
					data["total_sent"] = (parseFloat(data["total_sent"]) / 1e8) + " BTC";
					
					data["bitcoin_address"] = bitcoin_balance.address;
					data["bitcoin_address_label"] = bitcoin_balance.label;
					
					bitcoin_balance.data = data;
					
					if (!bitcoin_balance.loaded) {
						bitcoin_balance.loaded = true;
						bitcoin_balance.loadView();
					} else {
						bitcoin_balance.updateView();
					}
				}
			});
		},
		
		getTitle: function() {
			return "Bitcoin address balance";
		}
	};
	
	addView(bitcoin_balance);
})();