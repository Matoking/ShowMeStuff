from flask import Flask, render_template, request

from showmestuff import app, base_config

import sqlite3
import requests
import json
import os
import time

@app.route("/bitcoin_price", methods=["POST"])
def get_bitcoin_price():
    if request.method == 'POST':
        response = {}
        
        api = request.form['api']
        
        if api == "bitstamp_usd":
            try:
                result = requests.get("https://www.bitstamp.net/api/ticker/", timeout=3)
                result = json.loads(result.text)
            except:
                return json.dumps({"error": "Couldn't retrieve price information"})
        
            response["last_text"] = "$%s" % (result["last"])
            response["ask_text"] = "$%s" % (result["ask"])
            response["bid_text"] = "$%s" % (result["bid"])
            response["source_text"] = "Bitstamp (USD)"
            
        response["chart_data"] = update_chart(result["last"], api)
        
        return json.dumps(response)
    else:
        return "error"
    
def update_chart(price, api):
    c = get_sqlite_cursor(api)
    
    # Create table if it hasn't been already
    create_table(c)
    
    price = float(price)
    add_entry(c, price)
    
    return get_entries(c)

def create_table(c):
    """
    Creates the table that holds chart entries
    """
    c.execute("""CREATE TABLE IF NOT EXISTS price (price REAL,
                                                   timestamp INTEGER PRIMARY KEY)""")
    
def add_entry(c, price, interval=5*60, limit=10000):
    """
    Adds a new price entry
    """
    timestamp = int(time.time())
    
    result = c.execute("""SELECT * FROM price WHERE timestamp >= ? - ?
                          ORDER BY timestamp DESC
                          LIMIT 1""", (timestamp, interval,))
    
    # If we already have a recent result (not as old as interval)
    # don't add anything
    if len(result.fetchall()) == 1:
        return
    
    # Add entry and truncate the database so that at most 'limit' amount of entries remian
    c.execute("""INSERT INTO price (price, timestamp) VALUES (?, ?)""", (price, timestamp,))
    c.execute("""DELETE FROM price WHERE timestamp NOT IN (SELECT timestamp FROM price ORDER BY timestamp DESC LIMIT ?)""", (limit,))
    
def get_entries(c, timespan=60*60*24):
    timestamp = int(time.time())
    
    result = c.execute("""SELECT timestamp, price FROM price 
                          WHERE timestamp >= ? - ?
                          ORDER BY timestamp ASC""", (timestamp, timespan,))
    
    entries = result.fetchall()
        
    return entries

def get_sqlite_cursor(api):
    try:
        os.makedirs("%s/data/bitcoin_price" % base_config.CONFIG["BASE_DIR"])
    except:
        pass
    
    conn = sqlite3.connect("%s/data/bitcoin_price/%s.db" % (base_config.CONFIG["BASE_DIR"],
                                                            api),
                           isolation_level=None)
    
    return conn.cursor()