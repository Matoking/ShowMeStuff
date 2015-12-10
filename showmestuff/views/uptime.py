from flask import Flask, render_template, request

from showmestuff import app

import requests
import time
import json

@app.route("/uptime", methods=["POST"])
def get_uptime():
    if request.method == 'POST':
        response = {}
        
        urls = json.loads(request.form['urls'])
        
        for url in urls:
            try:
                result = requests.get(url, timeout=5)
                
                if result.status_code >= 400 and result.status_code <= 599:
                    response[url] = {"success": False,
                                     "elapsed": float(result.elapsed.total_seconds()) * 1000.0,
                                     "status_code": result.status_code,
                                     "status_text": "%d %s" % (result.status_code, result.reason)}
                else:
                    response[url] = {"success": True,
                                     "elapsed": float(result.elapsed.total_seconds()) * 1000.0,
                                     "status_code": result.status_code,
                                     "status_text": "%d %s" % (result.status_code, result.reason) }
            except requests.exceptions.Timeout:
                response[url] = {"success": False,
                                 "error": "timeout",
                                 "status_text": "Timeout"}
                continue
            except requests.exceptions.ConnectionError:
                response[url] = {"success": False,
                                 "error": "Connection error"}
                continue
            
        return json.dumps(response)
    else:
        return "error"