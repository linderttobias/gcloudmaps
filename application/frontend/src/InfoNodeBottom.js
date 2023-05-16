// Import required libraries
import { memo } from "react";
import { Handle, Position } from "reactflow";
import './index.css';

// InfoNodeRight component definition
const InfoNodeBottom = ({ data }) => {
  // Render component
  return (
    <div>
      <div style={{justifyContent: "center"}}>
        <div style={{justifyContent: "center", display: "flex"}}>
      { data.description ? <div className="link">{data.label}</div> : data.label}
      </div>
      { data.shortDescription ? 
        <div style={{margin: "auto", maxWidth: "150px"}}>
          { data.shortDescription ? <div style={{fontSize: "10px", marginTop: "5px"}}>{data.shortDescription}</div> : null}
        </div> : null}

      </div> 
      <Handle type="source" position={Position.Left} id="left"/>
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Top} id="top" />
    </div>
  );
};

// Export memoized version of InfoNodeRight component
export default memo(InfoNodeBottom);