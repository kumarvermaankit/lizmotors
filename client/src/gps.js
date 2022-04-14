import * as React from 'react';
import { useState, useEffect } from 'react';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import axios from "axios"

function App() {



  const [time, settime] = useState("00:00:00")
  const [speed, setspeed] = useState("0 KMPH")
  const [altitude, setaltitude] = useState("0 m")
  const [interval, setinterval] = useState(500);

  useEffect(async () => {

    //Fetching data from backend
    const excelData = await axios.get("http://localhost:5000/api")



    // Creating an instance of mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFya3NpZGVyNTEiLCJhIjoiY2wwZHl6NXY4MGR2NzNjbXo5ZTBtZGE4eSJ9._xuts111DHQXPl5CflCMiQ';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/darksider51/cl0h230xc001j14qk893hg13b',
      zoom: 14
    });



    map.on('load', async () => {
      // We fetch the JSON here so that we can parse and use it separately
      // from GL JS's use in the added source.
      const response = await fetch(
        'https://docs.mapbox.com/mapbox-gl-js/assets/hike.geojson'
      );
      const data = await response.json();
      // save full coordinate list for later
      const coordinates = data.features[0].geometry.coordinates;

      // start by showing just the first coordinate
      data.features[0].geometry.coordinates = [[excelData.data[8][3], excelData.data[8][2]]];

      // add it to the map
      map.addSource('trace', { type: 'geojson', data: data });
      map.addLayer({
        'id': 'trace',
        'type': 'line',
        'source': 'trace',
        'paint': {
          'line-color': '#488FB1',
          'line-opacity': 0.75,
          'line-width': 3.5
        }
      });


      // setup the viewport


      map.jumpTo({ 'center': [excelData.data[8][3], excelData.data[8][2]], 'zoom': 17 });
      map.setPitch(30);

      // on a regular basis, add more coordinates from the saved list and update the map
      let i = 8;
      const timer2 = setInterval(() => {
        if (i < excelData.data.length) {
          settime(excelData.data[i][1])
          setspeed(excelData.data[i][5])
          setaltitude(excelData.data[i][4])
          if (i > 500) {
            map.jumpTo({ 'center': [excelData.data[i][3], excelData.data[i][2]], 'zoom': 14 });

          }
          if (i === excelData.data.length - 1) {
            map.jumpTo({ 'zoom': 10.75 });

          }

          data.features[0].geometry.coordinates.push([excelData.data[i][3], excelData.data[i][2]]);
          map.getSource('trace').setData(data);
          map.panTo([excelData.data[i][3], excelData.data[i][2]]);
          i++;
        } else {
          window.clearInterval(timer2);
        }
      }, interval);

    });
  }, [interval])














  // Change the Speed of interval for mapping of data
  function ChangeSpeed(e) {
    e.preventDefault()
    setinterval(e.target.value)
  }


  return (
    <div className="App">



      <h1>Dashboard</h1>
      <div className='dropdown'>
        <label style={{ display: "block" }}>Change Interval Speed</label>
        <select onChange={(e) => ChangeSpeed(e)} >
          <option selected value={500}>0.5 sec</option>
          <option value={1000}>1 sec</option>
          <option value={100}>10 milisec</option>
          <option value={10}>1 milisec</option>

        </select>
      </div>

      <div style={{ display: "flex" }}>
        <div id="map"></div>

        <div className='attributes'>

          <div id="attribute">
            <h2>TIME</h2>
            <p>{time}</p>
          </div>
          <div id="attribute">
            <h2>Speed</h2>
            <p>{speed}</p>
          </div>
          <div id="attribute">
            <h2>Altitude</h2>
            <p>{altitude}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
