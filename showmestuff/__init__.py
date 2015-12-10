import os
from flask import Flask, render_template
from flask.ext.cors import CORS, cross_origin

import base_config as config

app = Flask(__name__)

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'flaskr.db'),
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',
    CORS_HEADERS='Content-Type',
))

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin(origin='*')
def main_view():
    return render_template('main.html', config=config.CONFIG)