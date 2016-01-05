import datetime

# ShowMeStuff configuration file

# Check settings.example.py for more details

VIEW_HEIGHT = 480
VIEW_WIDTH = 800

BACKGROUND_COLOR = "#293134"
TEXT_COLOR = "white"

VIEWS = [
    {"name": "uptime",
     "config": {
        "sites": [
            {"name": "Google",
             "url": "http://www.google.com"}
        ]
    }},
    {"name": "bitcoin_price",
     "config": {
        "api": "bitstamp_usd",
        "timespan": datetime.timedelta(days=7)
    }},
    {"name": "cpu_ram_info"},
    {"name": "disk_usage"},
    {"name": "bitcoin_balance",
     "config": {
        "address": "12T6LCaHz6YLpRZDuSMAF7DNHrQZW6Lv2f",
        "label": "BitBin earnings"
    }},
    {"name": "tail",
     "config": {
        "title": "Bitcoin log",
        "file": "/media/odroid/hdd/bitcoin_data/debug.log"
    }}
]