import React from 'react';
import PropTypes from "prop-types";
import "./DataDisplay.css";

import { formatInput } from "./utils.js";


function DataDisplay(props) {
    return(
        <div className="data">
            <p><strong id="data__label">
                > {props.name}
            </strong>
            </p>
            
            <input 
            id="input" 
            type="text"
            value={formatInput(props.data, props.name)}
            />
        </div>
    );
};

DataDisplay.propTypes = {
    data: PropTypes.number,
    name: PropTypes.string
};

export default DataDisplay;