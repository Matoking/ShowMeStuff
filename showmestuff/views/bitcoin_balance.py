from flask import Flask, render_template, request

from showmestuff import app

import requests
import json

@app.route("/bitcoin_balance", methods=["POST"])
def get_bitcoin_balance():
    if request.method == 'POST':
        response = {}
        
        address = request.form['address']
        
        # Get address info
        try:
            result = requests.get("http://blockchain.info/address/%s?format=json&limit=5" % address, timeout=5)
            result = json.loads(result.text)
        except:
            return "couldn't read response"
        
        result["txs"] = result["txs"][:5]
        
        response["transaction_count"] = result["n_tx"]
        response["total_received"] = result["total_received"]
        response["total_sent"] = result["total_sent"]
        response["final_balance"] = result["final_balance"]
        
        response["recent_txs"] = []
        
        for i, tx in enumerate(result["txs"]):
            received = 0
            sent = 0
            
            if "inputs" in result["txs"][i]:
                for input in result["txs"][i]["inputs"]:
                    if "addr" in input["prev_out"] and input["prev_out"]["addr"] == address:
                        sent += input["prev_out"]["value"]
                        
            if "out" in result["txs"][i]:
                for output in result["txs"][i]["out"]:
                    if "addr" in output and output["addr"] == address:
                        received += output["value"]
                        
            response["recent_txs"].append({"timestamp": tx["time"],
                                           "hash": tx["hash"],
                                           "received": received,
                                           "sent": sent})
        
        return json.dumps(response)
    else:
        return "error"