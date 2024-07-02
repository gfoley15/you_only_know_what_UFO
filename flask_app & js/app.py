from bson import json_util
from flask import Flask, jsonify, render_template
import pymongo
import os
import json

app = Flask(__name__)

# setup mongo connection
serverUrl = os.environ.get('MONGO', "mongodb://localhost:27017")
client = pymongo.MongoClient(serverUrl)

# connect to mongo db (nuforc) and collections (airforce_bases) & (usa_sightings)
db = client.nuforc
class_collection = db.airforce_bases
class_collection1 = db.usa_sightings

@app.route("/")
def default():
    return render_template('index.html')

@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/dashboard")
def dashboard():
    return render_template('dashboard.html')

@app.route("/sourcedata")
def sourcedata():
    data = class_collection.find()
    return json_util.dumps(data)

@app.route("/sourcedata1")
def sourcedata1():
    data = class_collection1.find()
    return json_util.dumps(data)

if __name__ == '__main__':
    app.run(debug=True, port=5010)