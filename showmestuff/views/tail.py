from flask import Flask, render_template, request

from showmestuff import app

import json

@app.route("/tail", methods=["POST"])
def get_file_lines():
    response = {}
    
    file = request.form['file']
    
    try:
        with open(file, 'r') as f:
            text = tail(f)
            
        response["text"] = text
    except:
        return "error"
    
    return json.dumps(response)
    
def tail(f, n=75):
    assert n >= 0
    pos, lines = n+1, []
    while len(lines) <= n:
        try:
            f.seek(-pos, 2)
        except IOError:
            f.seek(0)
            break
        finally:
            lines = list(f)
        pos *= 2
        
    text = "".join(lines[-n:])
    return text