// Import required libraries
import { memo } from "react";
import { Handle, Position } from "reactflow";
import './index.css';

// InfoNodeRight component definition
const InfoNodeLeft = ({ data }) => {
  // Render component
  return (
    <div>
      <div style={{display: "flex"}}>
      { data.shortDescription ? 
        <div style={{margin: "auto", maxWidth: "250px"}}>
          { data.shortDescription ? <div style={{fontSize: "10px", marginRight: "5px"}}>{data.shortDescription}</div> : null}
        </div> : null}
        { data.link ? <a href={data.link} target="_blank">{data.label}</a> : data.label}
      </div> 
      <Handle type="source" position={Position.Left} id="left"/>
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Top} id="top" />
    </div>
  );
};

// Export memoized version of InfoNodeRight component
export default memo(InfoNodeLeft);