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
        "api": "bitstamp_usd"
    }},
    {"name": "cpu_ram_info"},
    {"name": "disk_usage"},
    {"name": "tail",
     "config": {
        "title": "Kernel log",
        "file": "/var/log/kern.log",
    }},
]