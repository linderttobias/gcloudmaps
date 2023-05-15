// Import required libraries
import { memo, useState } from "react";
import { Handle, Position, NodeToolbar } from "reactflow";
import ReactMarkdown from 'react-markdown';

// InfoNodeRight component definition
const InfoNodeRight = ({ data }) => {
  // State hook for visibility control
  const [isVisible, setVisible] = useState(false);

  // Render component
  return (
    <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setTimeout(() => setVisible(false), 500)}>
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

