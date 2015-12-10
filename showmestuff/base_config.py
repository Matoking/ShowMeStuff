import settings as user_config

import os

CONFIG = {
    "VIEW_HEIGHT": 1280,
    "VIEW_WIDTH": 720,
    "VIEWS": [
    ],
          
    "VIEW_CHANGE_INTERVAL": 10,
    
    "BACKGROUND_COLOR": "white",
    "TEXT_COLOR": "black",
    
    "BASE_DIR": os.path.dirname(os.path.realpath(__file__))
}

# Iterate through all config parameters and replace them with the one
# user has provided
for key, value in CONFIG.iteritems():
    if key in user_config.__dict__:
        CONFIG[key] = user_config.__dict__[key]