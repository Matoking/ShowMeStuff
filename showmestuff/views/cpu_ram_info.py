from flask import Flask, render_template

from showmestuff import app

import psutil
import time
import humanfriendly
import json

@app.route("/cpu_ram")
def get_systeminfo():
    response = {}
    
    # Update CPU usage
    cpu_percent = psutil.cpu_percent(percpu=True)
    
    response["cpus"] = []
    for i in range(0, len(cpu_percent)):
        response["cpus"].append({"id": i,
                                 "percent": int(cpu_percent[i])})
        
    vm_usage = psutil.virtual_memory()
    swap_usage = psutil.swap_memory()
        
    response["ram"] = {"vm_used": vm_usage.used,
                       "vm_total": vm_usage.total,
                       
                       "swap_used": swap_usage.used,
                       "swap_total": swap_usage.total}
    
    return json.dumps(response)