import { memo, useState } from 'react';
import { Handle, Position, NodeToolbar } from 'reactflow';

const InfoNodeLeft = ({ data }) => {
  const [isVisible, setVisible] = useState(false);

  const linkStyle = {
    color: "rgb(42, 32, 97)",
    textDecoration: 'none',
  };

  // Render component
  return (
    <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setTimeout(() => setVisible(false), 500)}>
      <div container>
        {(() => {
          // Display NodeToolbar with description if available
          if (data.description) {
            return (
              <NodeToolbar
                isVisible={isVisible}
                position={Position.Right}
                style={{
                  maxWidth: 200,
                  backgroundColor: "white",
                  padding: "1.5em",
                  boxShadow: "0 0 3px 2px #cec7c759",
                }}
              >
                {data.description}
                <br/>
                {data.link ? <a href={data.link} target="_blank" rel="noopener noreferrer" style={linkStyle}>Full documentation</a>  : null}
              </NodeToolbar>
            );
          }
        })()}
      </div>
      <div style={{display: "flex"}}>
      { data.shortDescription ? 
        <div style={{margin: "auto", width: 250}}>
          { data.shortDescription ? <div style={{fontSize: "10px", marginRight: "5px", textAlign: "right"}}>{data.shortDescription}</div> : null}
        </div> : null}
        { data.link ? <div style={linkStyle}>{data.label}</div> : data.label}
      </div> 
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Top} id="top"/>
    </div>
  );
};

export default memo(InfoNodeLeft);