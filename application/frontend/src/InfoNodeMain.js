import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const InfoNodeMain = ({ data }) => {



  return (
    <div>
      <Handle type="source" position={Position.Left} id="left" isConnectable={true}/> 
      <Handle type="source" position={Position.Top} id="top" isConnectable={true}/>
      <text style={{ fontWeight: "normal", fontSize: "2em" }}>{data.label}</text>
      <sup class="superscript" style={{fontSize:"0.1em"}}>v03/23</sup>
      <Handle type="source" position={Position.Right} id="right" isConnectable={true}/>
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={true}/>
    </div>
  );
};

export default memo(InfoNodeMain);