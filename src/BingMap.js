import React from 'react';
import PropTypes from "prop-types";
import { ReactBingmaps } from 'react-bingmaps';


const BingMap = props => {
    let location = [ props.lat , props.long];
    return(
    <ReactBingmaps
        bingmapKey = {props.bingkey}
        center = {location}
        position ="relative"
        mapTypeId = "aerial"
        width = "100px"
        
        > 
        </ReactBingmaps>
    );
}

BingMap.propTypes = {
  long: PropTypes.number,
  lat: PropTypes.number,
  key: PropTypes.string
} 

export default BingMap;