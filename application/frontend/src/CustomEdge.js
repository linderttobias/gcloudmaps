import React from 'react';
import { Edge } from 'react-flow-renderer';

const CustomEdge = ({ data, ...rest }) => {
  const customStyle = {
    strokeWidth: 3,
    stroke: 'red',
  };

  return <Edge data={data} style={customStyle} {...rest} />;
};

export default CustomEdge;