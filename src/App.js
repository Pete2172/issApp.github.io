import React, {Component} from 'react';
import './App.css';

import DataDisplay from "./DataDisplay.js";
import BingMap from "./BingMap.js";
import { calculateGreatCircleDistance } from "./utils.js";



class App extends Component {
  
    constructor(){
      super();
      this.state = {
        url: "https://api.wheretheiss.at/v1/satellites/25544",
        light: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Whole_world_-_land_and_oceans_12000.jpg/1024px-Whole_world_-_land_and_oceans_12000.jpg",
        dark: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/BlackMarble20161km.jpg/1024px-BlackMarble20161km.jpg",
        key: "kdZJmZ4vgujbABzslMTx~LJdezJEfoUd_AGfouXIjRg~AgDg1zk0AZwHJIi709KW2T97_JL8p5AJS8szvnwdLyFQRNMyc0bfsVGJUBnxIve9",
        image1_loaded: false,
        image2_loaded: false,
        iss: {
          latitude: 0,
          longitude: 0,
          altitude: 0,
          velocity: 0,
          visibility: "",
          timestamp: 0,
          solar_lat: 0,
          solar_lon: 0,
        }
      };
      this.lightmap = new Image();
      this.lightmap.crossOrigin = "anonymous";
      this.lightmap.src = this.state.light;
      this.lightmap.onload = () => {
        this.state.image1_loaded = true;
      }

      this.darkmap = new Image();
      this.darkmap.crossOrigin = "anonymous";
      this.darkmap.src = this.state.dark;
      this.darkmap.onload = () => {
        this.state.image2_loaded = true;
      }


      this.downloadJsonFile = this.downloadJsonFile.bind(this);
      this.parseData = this.parseData.bind(this);
      this.timerDownload = this.timerDownload.bind(this);
      this.drawDayLightMap = this.drawDayLightMap.bind(this);
      this.timerDraw = this.timerDraw.bind(this);

      this.lat = 0;
      this.lon = 0;
    }

    downloadJsonFile(){
      return fetch(this.state.url)
       .then(response => response.json())
        .then(jsonData =>{
        this.parseData(jsonData);
      })
      .catch(error => {
        window.alert("Something went wrong with downloading data from url!");
      });
    }

    parseData(jsonFile){

      var solar_longitude = (jsonFile.solar_lon > 180) ? jsonFile.solar_lon - 360 : jsonFile.solar_lon; // fixing bug in ISS API

      this.setState({
        iss: {
          latitude: jsonFile.latitude,
          longitude: jsonFile.longitude,
          altitude: jsonFile.altitude,
          velocity: jsonFile.velocity,
          visibility: jsonFile.visibility,
          timestamp: jsonFile.timestamp,
          solar_lat: jsonFile.solar_lat,
          solar_lon: solar_longitude
        },
        data_loaded: true
      })
      this.lat = this.state.iss.latitude;
      this.lon = this.state.iss.longitude;
      this.sun_lat = this.state.iss.solar_lat;
      this.sun_lon = this.state.iss.solar_lon;
    }

    drawDayLightMap(){

      if(this.state.image2_loaded === true && this.state.image1_loaded === true){
        
      
        const canv = this.refs.canvas;
        const ctx = canv.getContext('2d');
        ctx.drawImage(this.darkmap, 0, 0, canv.width, canv.height);
        
        let imgData = ctx.getImageData(0, 0, canv.width, canv.height);
        let image_data = imgData.data;

        const ctx2 = this.refs.canvas_def.getContext('2d');
        ctx2.drawImage(this.lightmap, 0, 0, canv.width, canv.height);
        const data2 = this.refs.canvas_def.getContext('2d').getImageData(0, 0, canv.width, canv.height).data;

        for(var i = 0; i < canv.height; i++){
          for(var j = 0; j < canv.width; j++){
            let x = (j/2 >= 180) ? j/2 - 180 : -(180 - j/2);  // trasforming pixels coordinates to geographic coordinates
            let y = (i/2 <= 90) ? 90 - i/2 : -(i/2 - 90);
             
            let index = (i*canv.width + j)*4;       // choosing proper index to manipualte object

            let distance = calculateGreatCircleDistance(y, x, this.sun_lat, this.sun_lon);
            /** Drawing Day/Night World Map */
            if(distance <= 90){
              image_data[index] = data2[index];
              image_data[++index] = data2[index];
              image_data[++index] = data2[index];
            } 

            /** Drawing ISS location pointer */
            let radius = 5;
            let isInCircle = ((x-this.lon)**2 + (y-this.lat)**2);
            let index2 = (i*canv.width + j)*4; 
            if((isInCircle >= (radius-3)**2) && (isInCircle <= (radius)**2)){
              image_data[index2] = 7;
              image_data[++index2] = 79;
              image_data[++index2] = 100;
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
        
      }
    }

    timerDownload(){
      this.downloadJsonFile();
      this.drawDayLightMap();
    }

    timerDraw(){
      this.drawDayLightMap();
    }

    render(){

      const labels = <div className="labels">
                         <DataDisplay data={this.state.iss.longitude} name="Longitude" />
                         <DataDisplay data={this.state.iss.latitude} name="Latitude" />
                         <DataDisplay data={this.state.iss.altitude} name="Altitude" />
                         <DataDisplay data={this.state.iss.velocity} name="Velocity" />
                         <DataDisplay data={this.state.iss.timestamp} name="Date & Time" />
                     </div>;

      const map = <BingMap 
                      lat={this.lat} 
                      long={this.lon} 
                      bingkey={this.state.key} 
                      /> ;

      const imag =  <div className="imag">
                    <canvas 
                        ref="canvas"
                        width={720} 
                        height={360} 
                    >
                    <canvas ref="canvas_def"  width={720} height={360} className="hidden" />
                    </canvas>
                    </div>
    
      return (
      <div className="app" >
          <div className="header">Where is ISS?</div>
            {labels}
            {imag}
            <div style={{clear:'both', height: '40vh', width: '950px', marginLeft: '1%', float: 'left', left: '30px',  border: 'double white 3px' }}>{map}</div>
      </div>);
    }

    componentDidMount(){
      setInterval(this.timerDownload, 1000);
    }
}



export default App;

// keu kdZJmZ4vgujbABzslMTx~LJdezJEfoUd_AGfouXIjRg~AgDg1zk0AZwHJIi709KW2T97_JL8p5AJS8szvnwdLyFQRNMyc0bfsVGJUBnxIve9