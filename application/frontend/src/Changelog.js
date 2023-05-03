import React, { useState, useEffect } from 'react';

function FileComponent(props) {
  const [fileContents, setFileContents] = useState('');

  useEffect(() => {
    fetch("./test.txt")
      .then(response => response.text())
      .then(text => setFileContents(text));
  }, [props.url]);

  return (
    <div>{fileContents}</div>
  );
}

export default FileComponent;