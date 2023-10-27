import React, { useState, useNodesState } from "react";

import useStore from "../store";

const NodeElements = ({ id, type, label, link, description }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(label);
  const [descr, setDescr] = useState(description);
  const [clink, setcLink] = useState(link);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const updateNodeDescription = useStore(
    (state) => state.updateNodeDescription
  );
  const updateNodeLink = useStore(
    (state) => state.updateNodeLink
  );

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setText(event.target.value);
    updateNodeLabel(id, event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescr(event.target.value);
    updateNodeDescription(id, event.target.value);
  };

  const handleChangeLink = (event) => {
    setcLink(event.target.value);
    updateNodeLink(id, event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <>
          <div style={{ margin: "auto", maxWidth: 200 }}>
            <input
              type="text"
              value={text}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <input
              type="text"
              value={descr}
              onChange={handleChangeDescription}
              onBlur={handleBlur}
            />
            <input
              type="text"
              value={clink}
              onChange={handleChangeLink}
              onBlur={handleBlur}
            />
          </div>
        </>
      ) : (
        <>
          {type === "left" ? (
            <div style={{ display: "flex" }}>
              <div style={{ fontSize: "10px", marginRight: "5px" }}>
                {descr}
              </div>
              {text}
            </div>
          ) : (
            <>
              {clink ? (
                <a href={clink} target="_blank">
                  {text}
                </a>
              ) : (
                text
              )}
              <div style={{ margin: "auto", maxWidth: 200 }}>
                <div style={{ fontSize: "10px", marginTop: "5px" }}>
                  {descr}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NodeElements;
