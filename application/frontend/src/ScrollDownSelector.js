import React, { memo, useState, Panel } from "react";
import './ScrollDownSelector.css'
import cc from 'classcat';

const ScrollDownSelector = ({ options, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState(options[0]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onSelect(event.target.value);
  };

  return (
      <select value={selectedValue} onChange={handleChange} style={{position: "fixed", top: "50%"}}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
  );
};

export default memo(ScrollDownSelector);