from showmestuff import app

import base_config as config
import importlib

def run_app(debug=True):
    # Import every enabled view
    for view in config.CONFIG["VIEWS"]:
        try:
            importlib.import_module("showmestuff.views.%s" % (view["name"]))
        except:
            print("Couldn't import %s" % view["name"])
    
    app.run(port=5210, debug=debug)