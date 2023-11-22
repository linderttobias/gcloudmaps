import React, { useEffect, useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  useStoreApi,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import Select from "react-select";
import "reactflow/dist/style.css";

import AccountDropdown from "./Components/AccountDropdown.js";

import { jwtDecode } from "jwt-decode";

import "./index.css";
import LightModeButton from "./Components/LightModeButton.js";
import {
  NodeBottom,
  NodeTop,
  NodeLeft,
  NodeRight,
  NodeMain,
} from "./Components/Nodes.js";

import { shallow } from "zustand/shallow";
import useStore from "./store";
import { areaSelector, fetchData } from "./utils.js";

const apiUrl = process.env.REACT_APP_API_URL;

const selector = (state) => ({
  loggedIn: state.loggedIn,
  setLoggedIn: state.setLoggedIn,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  setMindMap: state.setMindMap,
});

const nodeTypes = {
  infoNode_top: NodeTop,
  infoNode_right: NodeRight,
  infoNode_left: NodeLeft,
  infoNode_bottom: NodeBottom,
  infoNode_main: NodeMain,
};

localStorage.setItem("service", "bigquery");
localStorage.setItem("theme", "dark");
document.documentElement.setAttribute("data-theme", "dark");

const Application = () => {

  const menu = [
    { value: "logout", label: "Logout" },
  ];

  const googleServices = [
    { value: "bigquery", label: "BigQuery" },
    { value: "cloudstorage", label: "Cloud Storage" },
    { value: "cloudrun", label: "Cloud Run" },
    { value: "more-coming-soon", label: "More coming soon ..." },
  ];

  const {
    loggedIn,
    setLoggedIn,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addChildNode,
    setMindMap,
  } = useStore(selector, shallow);

  const [service, setService] = useState("bigquery");
  const [user, setUser] = useState({});
  const connectingNodeId = useRef(null);
  const store = useStoreApi();
  const rfInstance = useReactFlow();
  const project = rfInstance.project;

  // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
  const getChildNodePosition = (event, parentNode) => {
    const { domNode } = store.getState();

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return;
    }

    // we need to remove the wrapper bounds, in order to get the correct mouse position
    const panePosition = project({
      x: event.clientX,
      y: event.clientY,
    });

    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  // Fires when a
  const onConnectStart = useCallback((event, { nodeId, handleId }) => {
    connectingNodeId.current = nodeId;
    connectingNodeId.handleId = handleId;
    connectingNodeId.oldX = event.clientX;
    connectingNodeId.oldY = event.clientY;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState();
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(event, parentNode);

        // Indicator where relative to the old coordinates the new coordinates are. Top, right, bottom, left
        var area = areaSelector(
          event.clientX,
          event.clientY,
          connectingNodeId.oldX,
          connectingNodeId.oldY
        );

        if (parentNode && childNodePosition) {
          addChildNode(
            parentNode,
            childNodePosition,
            "infoNode_" + area,
            connectingNodeId.handleId
          );
        }
      }
    },
    [getChildNodePosition]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const url = apiUrl + "/mindmaps/" + localStorage.getItem("service");

      fetch(url, {
        method: "POST",
        body: JSON.stringify(rfInstance.toObject()),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((error) => {
          console.log(error);
        });
    }
  }, [rfInstance]);




  const handleChange = (selectedItem) => {
    setService(selectedItem.value);
    if (selectedItem) {
      fetchData(selectedItem.value, apiUrl).then((data) => {
        setMindMap(data.nodes, data.edges);
      });
    }

    if (rfInstance) {
      // Timeout required to wait for nodes/edges being loaded
      setTimeout(() => {
        rfInstance.fitView();
      }, 100);
    }
  };

  const init = useCallback(() => {
    setLoggedIn(false);
    fetchData(service, apiUrl).then((data) => {
      setMindMap(data.nodes, data.edges);
    });
  });

  const addMindMap = useCallback(() => {
    setMindMap(
      [
        {
          id: "root",
          type: "infoNode_main",
          data: { label: "React Flow Mind Map" },
          position: { x: 0, y: 0 },
        },
      ],
      []
    );
  });

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  const handleChange2 = (selectedItem) => {
    if (selectedItem.value === "logout") {
      handleSignOut();
    }
  };

  function handleCallbackResponse(response) {
    console.log("encoded JWT ID token: " + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }
  // Initial Load
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "707432047927-ggr2gothraf65v17n16c7048vnj6cf7u.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      text: "signin",
      theme: "outline",
      size: "large",
      zindex: "1",
      width: 50
    });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      onInit={init}
      fitView
    >

      <Background color="#818cab" size="0.8" variant="dots" />
      <Controls />
      <div className="container">
        <div className="component">
          gcloudmaps<sup class="superscript">by Tobias Lindert</sup>
        </div>
        {loggedIn ? (
          <div className="about">
            <div id="1" class="info-button" onClick={addMindMap}>
              Add MindMap
            </div>
          </div>
        ) : null}
        <div style={{ zIndex: 5, display: "flex", alignItems: "center" }}>
          <div id="signInDiv"></div>
          {Object.keys(user).length != 0 && (
            <div>
              <AccountDropdown user={user} handleChange2={handleChange2}/>
            </div>
          )}
        </div>
        <div className="scrollbar">
          <Select
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            defaultValue={googleServices[0]}
            menuPlacement="auto"
            options={googleServices}
            onChange={handleChange}
            isSearchable={false}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderWidth: "2px",
                borderRadius: "12px",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 0px",
                height: "35px",
                transition: "0s",
                marginLeft: "8px",
              }),
            }}
          />
        </div>
        <div className="about">
          <a
            class="info-button"
            href="https://github.com/hunderttausendwatt/gcloudmaps/tree/main"
          >
            <svg version="1.0" class="info" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
        <div className="lightMode">
          <LightModeButton />
        </div>
      </div>
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <Application />
  </ReactFlowProvider>
);
