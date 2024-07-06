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

# @app.route("/sourcedata")
# def sourcedata():
#     data = class_collection.find()
#     return json_util.dumps(data)

@app.route("/sourcedata")
def sourcedata():
    data = list(class_collection.find())
    return jsonify(json.loads(json_util.dumps(data)))

@app.route("/sourcedata1")
def sightings():
   # Fetch sightings data from usa_sightings collection
    sightings_data = list(class_collection1.find())

    # Process data into desired format
    sightings = []
    for sighting in sightings_data:
        formatted_sighting = {
            "SIGHTING_ID": int(sighting.get("SIGHTING_ID", 0)),
            "OCCURRED_DATE": sighting.get("OCCURRED_DATE", ""),
            "CITY": sighting.get("CITY", ""),
            "STATE": sighting.get("STATE", ""),
            "COUNTRY": sighting.get("COUNTRY", ""),
            "SHAPE": sighting.get("SHAPE", ""),
            "SUMMARY": sighting.get("SUMMARY", ""),
            "YEAR": int(sighting.get("YEAR", 0)),
            "CITYSTATE": sighting.get("CITYSTATE", ""),
            "Lat": sighting.get("Lat", 0.0),
            "Lng": sighting.get("Lng", 0.0),
        }
        sightings.append(formatted_sighting)

    # Construct the response in the desired format
    response = {
        "data": {
            "sightings": sightings
        }
    }

    # Return formatted sightings data as JSON
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5010)