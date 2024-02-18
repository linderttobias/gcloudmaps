import React, { useState, useEffect, useRef } from "react";
import { ContextMenu } from "./ContextMenuUtils";
import useStore from "../store";

const NodeElements = ({ id, type, label, link, description }) => {
  const [text, setText] = useState(label);
  const [descr, setDescr] = useState(description);
  const [clink, setClink] = useState(link);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const updateNodeDescription = useStore(
    (state) => state.updateNodeDescription
  );
  const updateNodeLink = useStore((state) => state.updateNodeLink);
  const loggedIn = useStore((state) => state.loggedIn);

  const [isLabelEditing, setIsLabelEditing] = useState(false);

  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });

  const divRef = useRef(null);

  const handleDivBlur = (event) => {
    // Check if the new focused element is outside the div
    if (!divRef.current.contains(event.relatedTarget)) {
      setIsLabelEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsLabelEditing(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      setClicked(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleChange = (event) => {
    setText(event.target.value);
    updateNodeLabel(id, event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescr(event.target.value);
    updateNodeDescription(id, event.target.value);
  };

  const handleChangeLink = (event) => {
    setClink(event.target.value);
    updateNodeLink(id, event.target.value);
  };

  if (isLabelEditing) {
    return (
      <div
        ref={divRef}
        tabIndex="0"
        onBlur={handleDivBlur}
        style={{ fontSize: "10px" }}
      >
        <div>
          name:
          <input value={text} onChange={handleChange}></input>
        </div>

        <div>
          description:
          <input value={descr} onChange={handleChangeDescription}></input>
        </div>
        <div>
          link:
          <input type="url" value={link} onChange={handleChangeLink}></input>
        </div>
      </div>
    );
  }

  switch (type) {
    case "left":
      return (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setClicked(true);
            setPoints({ x: e.pageX, y: e.pageY });
          }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div style={{ fontSize: "10px", marginRight: "5px", maxWidth: 200 }}>
            {descr}
          </div>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          ) : (
            text
          )}
          {clicked && (
            <ContextMenu top={points.y} left={points.x}>
              <ul>
                <li onClick={handleEditClick}>Edit</li>
              </ul>
            </ContextMenu>
          )}
        </div>
      );
    case "right":
      return (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setClicked(true);
            setPoints({ x: e.pageX, y: e.pageY });
          }}
          style={{ display: "flex", alignItems: "center" }}
        >
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          ) : (
            text
          )}
          <div style={{ fontSize: "10px", marginRight: "5px", maxWidth: 200 }}>
            {descr}
          </div>
          {clicked && (
            <ContextMenu top={points.y} left={points.x}>
              <ul>
                <li onClick={handleEditClick}>Edit</li>
              </ul>
            </ContextMenu>
          )}
        </div>
      );
    case "top":
      return (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setClicked(true);
            setPoints({ x: e.pageX, y: e.pageY });
          }}
          style={{ display: "center", alignItems: "center" }}
        >
          <div style={{ fontSize: "10px", marginBottom: "2px", maxWidth: 175 }}>
            {descr}
          </div>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          ) : (
            text
          )}
          {clicked && (
            <ContextMenu top={points.y} left={points.x}>
              <ul>
                <li onClick={handleEditClick}>Edit</li>
              </ul>
            </ContextMenu>
          )}
        </div>
      );
    case "bottom":
      return (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setClicked(true);
            setPoints({ x: e.pageX, y: e.pageY });
          }}
          style={{ display: "center", alignItems: "center" }}
        >
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          ) : (
            text
          )}
          <div style={{ fontSize: "10px", marginTop: "2px", maxWidth: 175 }}>
            {descr}
          </div>
          {clicked && (
            <ContextMenu top={points.y} left={points.x}>
              <ul>
                <li onClick={handleEditClick}>Edit</li>
              </ul>
            </ContextMenu>
          )}
        </div>
      );
    case "root":
      return (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setClicked(true);
            setPoints({ x: e.pageX, y: e.pageY });
          }}
          style={{ display: "center", alignItems: "center" }}
        >
            text
          {clicked && (
            <ContextMenu top={points.y} left={points.x}>
              <ul>
                <li onClick={handleEditClick}>Edit</li>
              </ul>
            </ContextMenu>
          )}
        </div>
      );
  }
};

export default NodeElements;
