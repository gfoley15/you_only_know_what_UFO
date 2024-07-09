
# You Only Know What UFO -Team

** Project: Data Engineering and Visualization on UFO Sighting in USA and Relationship with Military Bases
## Introduction 
The project takes indepth view of data engineering, exploration, and visualization to finally deduce the story found in UFO data sets in USA. Our team goal is to understand the relationship between places of UFO sighting and locations of military bases. This is expected to answer some of the questions that have surround the mystery of UFOs.

## Table of Contents
- Team Members
- Project Inspiration
- Data Sources
- Data Flow
- Technologies Used
- Research Questions
- Results
- Discussion
- Conclusions

## Team Members
- Albert Lee
- Courtney Cole
- Garrett Foley
- Matt McDowell
- Mohamed Ibrahim
  
## Project Inspiration
- History Channel: https://www.history.com/ufo-sightings-location-map 
- Medium: https://towardsdatascience.com/data-analysis-everything-youve-ever-wanted-to-know-about-ufo-sightings-e16f2ed34151 

## Data Sources
- UFO Sightings: https://nuforc.org/subndx/?id=all 
- Military Base Locations: https://en.wikipedia.org/wiki/List_of_United_States_Air_Force_installations
- OpenWeather API (for coordinates): https://openweathermap.org/api/geocoding-api#direct_name 

## Data Flow
Here is the project workflow from web scraping, flask app creation and javascript dashboard visualization.
![alt text](<UFO Workflow Diagram.png>)

## Technologies Used:
### Applications: 
Jupyter Notebook, Selenium ChromeDriver, OpenWeather API - GeoAPIfy, Flask, MongoDB (NoSQL), JavaScript ES6, HTML5
### Python libraries: 
- matplotlib.pyplot, pandas numpy, requests, warnings, time, hvplot, MongoClient, bs4 import BeautifulSoup, from splinter import Browser, from selenium import webdriver
### JavaScript libraries:
- Leaflet.js, Plotly, D3.jsm, Chart.js 
### Visualizations: 
- UFO Sightings Across the U.S.A. - Whiteboard (canva.com)

## Research Questions:
 - 1. Is there a correlation with military bases and UFO sightings?
 - 2. Which coast has the most encounters?
 - 3. What type of UFO is the most common?
 - 4. Has there been an increase in UFO sightings since 2010?

## Analysis 
The findings from our research offer important implications for public understanding of UFO and try to answer age old questions related to mystery of UFOs and Military. 
 - Light is the most common - are they airplanes or aliens? - followed by Circle and Triangle.
 - UFO sightings hav decrease since 2014. There was a slight increase in 2019 and 2020, but the general downtrend has remained consistent over the previous 10 year period.
 - According to the Top 10 States, California has the most recorded UFO sightings - 40% more than the next closest State, Florida. Due to California's significant amount of UFO sightings, plus 3 out of the Top 5 States in terms of sighting count (Arizona, Washington), the West Coast has more sightings.
 - In terms of correlation, the visual map can be left up to interpretation. However, there are generally many UFO sightings in cities that have or are close to Air Force Bases. There are also UFO sightings in between Air Force Bases (point A to point B) that can be seen on the map.

## Conclusion
In conclusion, our research sheds light on the complexity and mysterious nature of studying UFO and military information. From the data, we can say that there is a positive relationship between UFOs sighting and Air Force Bases in the USA.

## Sources
Throughout building out the web scraping module and javascript, the following websites were used to assist with coding:
 - https://stackoverflow.com/questions/22110282/how-to-click-on-hidden-element-in-selenium-webdriver
 - https://selenium-python.readthedocs.io/locating-elements.html
 - https://selenium-python.readthedocs.io/api.html#module-selenium.webdriver.common.action_chains
 - https://www.geeksforgeeks.org/exceptions-selenium-python/
 - https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 - https://www.chartjs.org/docs/latest/getting-started/integration.html
 - https://www.chartjs.org/docs/latest/charts/bar.html
