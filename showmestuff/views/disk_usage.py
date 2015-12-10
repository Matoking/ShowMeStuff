from flask import Flask, render_template

from showmestuff import app

import psutil
import time
import humanfriendly
import json
    
@app.route("/disk_usage")
def get_disk_usage():
    response = {}
    
    disk_partitions = psutil.disk_partitions()
    
    response["disks"] = []
        
    for disk_partition in disk_partitions:
        if disk_partition.mountpoint:
            disk_usage = psutil.disk_usage(disk_partition.mountpoint)
            
            response["disks"].append({"device": disk_partition.device,
                                      "mountpoint": disk_partition.mountpoint,
                                      "total": disk_usage.total,
                                      "used": disk_usage.used})
    
    return json.dumps(response)