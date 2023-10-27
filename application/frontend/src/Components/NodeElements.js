import React, { useState } from "react";

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
  const updateNodeLink = useStore((state) => state.updateNodeLink);
  const loggedIn = useStore((state) => state.loggedIn);

  const handleDoubleClick = () => {
    if (loggedIn) {
      console.log(loggedIn)
      setIsEditing(true);
    }
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

  if (isEditing) {
    return (
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
    );
  }

  switch (type) {
    case "left":
      return (
        <div
          style={{ display: "flex", alignItems: "center" }}
          onDoubleClick={handleDoubleClick}
        >
          <div style={{ fontSize: "10px", marginRight: "5px", maxWidth: 200 }}>
            {descr}
          </div>
          { link ? <a href={link} target="_blank">{text}</a> : text}
        </div>
      );
    case "right":
      return (
        <div
          style={{ display: "flex", alignItems: "center" }}
          onDoubleClick={handleDoubleClick}
        >
          { link ? <a href={link} target="_blank">{text}</a> : text}
          <div style={{ fontSize: "10px", marginLeft: "5px", maxWidth: 200 }}>
            {descr}
          </div>
        </div>
      );
    case "top":
      return (
        <div
          style={{ display: "center", alignItems: "center" }}
          onDoubleClick={handleDoubleClick}
        >
          <div style={{ fontSize: "10px", marginBottom: "2px", maxWidth: 175 }}>
            {descr}
          </div>
          { link ? <a href={link} target="_blank">{text}</a> : text}
        </div>
      );
    case "bottom":
      return (
        <div
          style={{ display: "center", alignItems: "center" }}
          onDoubleClick={handleDoubleClick}
        >
          { link ? <a href={link} target="_blank">{text}</a> : text}
          <div style={{ fontSize: "10px", marginTop: "2px", maxWidth: 175 }}>
            {descr}
          </div>
        </div>
      );
  }
};

export default NodeElements;
