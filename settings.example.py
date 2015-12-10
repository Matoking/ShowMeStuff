# ShowMeStuff configuration file

# Height and width of the area ShowMeStuff should be displayed on
VIEW_HEIGHT = 480
VIEW_WIDTH = 800

# Background and text color for all views
BACKGROUND_COLOR = "#293134"
TEXT_COLOR = "white"

# Visible views
# Certain views can be added multiple times with different settings
# (eg. multiple UPTIME views to track website uptime for dozens of sites)
VIEWS = [
    # UPTIME checks periodically whether sites are responding,
    # and also shows the latest status code and for how long a site has been down 
    {"name": "uptime",
     "config": {
        "sites": [
            {"name": "Google",
             "url": "http://www.google.com"}
        ]
    }},
    # BITCOIN_PRICE displays the current Bitcoin price as well as a graph of the
    # price during the last 24 hours
    #
    # Currently only Bitstamp is supported, and the graph isn't fully populated until
    # 24 hours worth of price data has been collected
    {"name": "bitcoin_price",
     "config": {
        "api": "bitstamp_usd"
    }},
    # CPU_RAM_INFO shows realtime CPU and RAM usage
    {"name": "cpu_ram_info"},
    # DISK_USAGE shows disk usage for each mounted filesystem
    {"name": "disk_usage"},
    # BITCOIN_BALANCE shows the balance and latest transactions
    # for the chosen Bitcoin address 
    {"name": "bitcoin_balance",
     "config": {
        "address": "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
        "label": "Wikileaks Donations"
    }},
    # TAIL tracks and displays the last lines of the chosen file
    {"name": "tail",
     "config": {
        "title": "Kernel log",
        "file": "/var/log/kern.log",
        "font_size": 12, # default font size, not necessary
    }},
]