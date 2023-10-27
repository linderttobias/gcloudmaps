import React, { useEffect, useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  useStoreApi,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import Select from "react-select";
import "reactflow/dist/style.css";

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
  const googleServices = [
    { value: "bigquery", label: "BigQuery" },
    { value: "cloudstorage", label: "Cloud Storage" },
    { value: "cloudrun", label: "Cloud Run" },
    { value: "cloud-architecture", label: "Cloud Architecture" },
    { value: "more-coming-soon", label: "More coming soon ..." },
  ];

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addChildNode,
    setMindMap,
  } = useStore(selector, shallow);

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
      x: event.clientX ,
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
    if (selectedItem) {
      const service = selectedItem.value;
      fetchData(service, apiUrl).then((data) => {
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
  // Initial Load
  useEffect(() => {
    handleChange("bigquery");
  },[]);



  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      fitView
    >
      <Background color="#818cab" size="0.8" variant="dots" />
      <Controls />
      <div className="editContainer">
        <div className="save__controls">
          <button onClick={onSave}>save</button>
        </div>
      </div>
      <div className="container">
        <div className="component">
          gcloudmaps<sup class="superscript">by Tobias Lindert</sup>
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
        <div className="about">
          <a class="info-button" href="/about">
            <svg version="1.0" class="info" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 7C12.5523 7 13 7.44772 13 8V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V8C11 7.44772 11.4477 7 12 7Z"
                fill="#000000"
              />
              <path
                d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                fill="#000000"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z"
                fill="#000000"
              />
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
