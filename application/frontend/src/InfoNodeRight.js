// Import required libraries
import { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import './index.css';

// InfoNodeRight component definition
const InfoNodeRight = ({ data }) => {
  // Render component
  return (
    <div>
      <div style={{display: "flex"}}>
      { data.description ? <div className="link">{data.label}</div> : data.label}
      { data.shortDescription ? 
        <div style={{margin: "auto", width: 250}}>
          { data.shortDescription ? <div style={{fontSize: "10px", marginLeft: "5px"}}>{data.shortDescription}</div> : null}
        </div> : null}
      </div> 
      <Handle type="target" position={Position.Left} id="left"/>
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Top} id="top" />
    </div>
  );
};

// Export memoized version of InfoNodeRight component
export default memo(InfoNodeRight);

