import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Background,
  Controls,
  Panel
} from 'reactflow';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import 'reactflow/dist/style.css';
import InfoNodeMain from './InfoNodeMain';
import InfoNodeRight from './InfoNodeRight';
import InfoNodeLeft from './InfoNodeLeft';
import InfoNodeTop from './InfoNodeTop';
import InfoNodeBottom from './InfoNodeBottom';
import './index.css';
import LightMode from './Components/LightMode';
import Select from 'react-select'

import jwt_decode from "jwt-decode"

const apiUrl = process.env.REACT_APP_API_URL;
const env = process.env.REACT_APP_ENV;

const nodeTypes = {
  infoNode_top: InfoNodeTop,
  infoNode_right: InfoNodeRight,
  infoNode_left: InfoNodeLeft,
  infoNode_bottom: InfoNodeBottom,
  infoNode_main: InfoNodeMain
};

const getNodeId = () => Math.random().toString(36).substring(2, 15)

function fetchData(service) {
  const url = apiUrl + '/mindmaps/' + service;
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error(error));
}

localStorage.setItem('service', 'bigquery')
localStorage.setItem('theme', 'dark');
document.documentElement.setAttribute('data-theme', 'dark');

const SaveRestore = () => {

  const [selectedOption, setSelectedOption] = useState(null);
  var currentService = selectedOption;
  const [showInfo, setShowInfo] = useState(false);
  const [showNodeInfo, setShowNodeInfo] = useState(false);

  const googleServices = [
    { value: 'bigquery', label: 'BigQuery' },
    { value: 'cloudstorage', label: 'Cloud Storage' },
    { value: 'cloudrun', label: 'Cloud Run' },
    { value: 'cloud-architecture', label: 'Cloud Architecture' },
    { value: 'more-coming-soon', label: 'More coming soon ...' },

  ]
  

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();


  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
  };

  const handleNodeInfoClose = () => {
    setShowNodeInfo(false);
  };
  

  // If Service is changed, set new State
  const handleChange = (selectedItem) => {
    setSelectedOption(selectedItem);
    currentService = selectedItem['value'];
    localStorage.setItem('service', currentService);
  };


  const [ user, setUser] = useState({});

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;

  }
  
  function handleCallbackResponse(response) {
    console.log("encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  // Change Service and load Nodes/Edges
  useEffect(() => {
    if (selectedOption) {
      const service = selectedOption['value']
      fetchData(service).then(data => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      });
    }

    // Sets View once new services is loaded
    if (rfInstance) {
      // Timeout required to wait for nodes/edges being loaded
      setTimeout(() => {
        rfInstance.fitView();
      }, 150);
    }

  }, [selectedOption, rfInstance]);


  // Initial Load
  useEffect(() => {
    const service = localStorage.getItem("service")
    fetchData(service).then(data => {
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    });

    /* global google */
    google.accounts.id.initialize({
      client_id: "981522904043-i0s14bvioc91pjjgj4153lp03k365noo.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"), 
      { theme: "outline", size: "large", zindex: "1"})
  }, []);

  const [nodeExample, setNodeExample] = useState(null)
  const [shortDescription, setShortDescription] = useState("unknown")
  const [link, setLink] = useState(null)
  const [nodeName, setNodeName] = useState("Node1");
  const [nodeId, setNodeId] = useState("1");

  const connectingNodeId = useRef(null);
  const { project } = useReactFlow();
  const onConnectStart = useCallback((event, { nodeId, handleId }) => {
    console.log(event)
    connectingNodeId.current = nodeId;
    connectingNodeId.handleId = handleId
    connectingNodeId.oldX = event.clientX;
    connectingNodeId.oldY = event.clientY;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');
 
      console.log(connectingNodeId.handleId)
      function isBelowDiagonalLine(pointX, pointY, oldX, oldY, slope, def=2) {

        // Calculate the y-intercept of the diagonal line using the old coordinates
        var yIntercept = oldY - slope * oldX;
        console.log(yIntercept)
        // Calculate the y-value on the diagonal line for the given x-value of the point
        var lineY = slope * pointX + yIntercept;
        console.log(lineY)
        
        // Compare the y-value of the point to the y-value on the line
        if (pointY < lineY) {
          return "above"; // Point is below the diagonal line
        } else {
          return "below"; // Point is above or on the diagonal line
        }
      }


      var check_1 = isBelowDiagonalLine(event.clientX, event.clientY, connectingNodeId.oldX, connectingNodeId.oldY, -1)
      var check_2 = isBelowDiagonalLine(event.clientX, event.clientY, connectingNodeId.oldX, connectingNodeId.oldY, 1)

      var type = 'infoNode_main'
      if ('below' == check_1) {
        if ('below' == check_2) {
          type = "infoNode_bottom"
        } else {
          type = "infoNode_right"
        }
      } else {
        if ('above' == check_2) {
          type = "infoNode_top"
        } else {
          type = "infoNode_left"
        }
      }
      console.log(type)

      if (targetIsPane) {
        const id = getNodeId();
        const newNode = {
          id,
          type: type,
          position: project({ x: event.clientX  - 75, y: event.clientY}),
          targetHandlePosition: type.replace("infoNode_", ""),
          data: { label: `New Node` }
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id, type: 'default', sourceHandle: connectingNodeId.handleId}));
      }
    },
    [project]
  );

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();

      const data = JSON.stringify(flow)
      console.log(data)

      const url = apiUrl + '/save' + '?service=' + localStorage.getItem("service");
      console.log(url);
      console.log(localStorage.getItem("service"))

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(flow),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch(error => {console.log(error)})



    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {

    const service = localStorage.getItem('service');
    const restoreFlow = async () => {
      fetchData(service).then(data => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      });
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'Added node'},
      type: 'infoNode_main',
      position: {
        x: window.innerWidth/2,
        y: 0,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onNodeClick = (event, node) => {

    setNodeId(node.id);
    setNodeName(node.data.label);
    setLink(node.data.link)
    setShortDescription(node.data.shortDescription)
    setNodeExample(node.data.nodeExample)
    setShowNodeInfo(true)
  };


  const onPaneClick = () => {
    setShowNodeInfo(false)
  };

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName
          };
        }

        return node;
      })
    );
  }, [nodeName, setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            shortDescription: shortDescription
          };
        }

        return node;
      })
    );
  }, [shortDescription, setShortDescription]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            link:link,
            nodeExample:nodeExample
          };
        }

        return node;
      })
    );
  }, [link, setLink, nodeExample, setNodeExample]);


  if (env !== 'development') {
    return (
      <ReactFlow
      edgesUpdatable={false}
      edgesFocusable={false}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onInit={setRfInstance}
      fitView
      >
<Background color="#818cab" size="0.8" variant="dots" />
        <Controls />
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
                    isSearchable={ false }
                   
                    styles={{

                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderWidth: '2px',
                        borderRadius: '12px',
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 0px",
                        height: '35px',
                        transition: '0s'
                      })
                    }}
                />
          </div>
          <div className="about">
              <a class="info-button" href="https://github.com/hunderttausendwatt/gcloudmaps/tree/main">
              <svg version="1.0" class="info" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              </a>
            </div>
            <div className="about">
              <a class="info-button" href="/about">
                <svg version="1.0" class="info" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7C12.5523 7 13 7.44772 13 8V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V8C11 7.44772 11.4477 7 12 7Z" fill="#000000"/>
                  <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#000000"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="#000000"/>
                </svg>
              </a>
            </div>
            <div className="lightMode">
              <LightMode/>
            </div>
            <div style={{zIndex: 5}}>
                    <div id="signInDiv"></div>
              {
                Object.keys(user).length != 0 && 
                  <button onClick={(e) => handleSignOut(e)}>Sign Out 2</button>
              }
              
              { user &&
                <div>
                  <h3>{user.name}</h3>
                </div>
              }
            </div>
          </div>
      </ReactFlow>
    )
  }


  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onInit={setRfInstance}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      onPaneClick={onPaneClick}
      fitView
    >
    <Background color="#ccc" variant="dots"/>
    <Controls />
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
                    isSearchable={ false }
                   
                    styles={{

                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderWidth: '2px',
                        borderRadius: '12px',
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 0px",
                        height: '35px',
                        transition: '0s'
                      })
                    }}
                />
          </div>
          <div className="about">
              <a class="info-button" href="https://github.com/hunderttausendwatt/gcloudmaps/tree/main">
              <svg version="1.0" class="info" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              </a>
            </div>
            <div className="about">
              <a class="info-button" href="/about">
                <svg version="1.0" class="info" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7C12.5523 7 13 7.44772 13 8V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V8C11 7.44772 11.4477 7 12 7Z" fill="#000000"/>
                  <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#000000"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="#000000"/>
                </svg>
              </a>
            </div>
            <div className="lightMode">
              <LightMode/>
            </div>
          </div>
        <div></div>

    <div className="editContainer">
          <div className="save__controls">
            <button onClick={onSave}>save</button>
            <button onClick={onRestore}>restore</button>
            <button onClick={onAdd}>add node</button>
          </div>

          <div className="updatenode__controls">
            <text>Node Name:</text>
            <input
              value={nodeName}
              onChange={(evt) => setNodeName(evt.target.value)}
              style={{width: "250px"}}
            />
            <text>Link:</text>
            <input
              value={link}
              onChange={(evt) => setLink(evt.target.value)}
              style={{width: "250px"}}
            />
            <text>Short Description:</text>
            <textarea
              value={shortDescription}
              onChange={(evt) => setShortDescription(evt.target.value)}
              placeholder="..."
              rows={2}
              cols={30}
            />
          </div>
    </div>
    </ReactFlow>
    
  );
};

export default () => (
  <ReactFlowProvider>
    <SaveRestore/>
  </ReactFlowProvider>
);


