import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";

const useStore = create((set, get) => ({
  nodes: [
    {
      id: "root",
      type: "infoNode_main",
      data: { label: "React Flow Mind Map" },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
  setMindMap: (node, edge) => {
    set({
      nodes: node,
      edges: edge,
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  updateNodeLabel: (nodeId, label) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = { ...node.data, label };
        }

        return node;
      }),
    });
  },
  updateNodeDescription: (nodeId, description) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = { ...node.data, description };
        }

        return node;
      }),
    });
  },
  updateNodeLink: (nodeId, link) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = { ...node.data, link };
        }

        return node;
      }),
    });
  },
  addChildNode: (parentNode, position, nodeType, sourceHandleId) => {
    const newNode = {
      id: nanoid(),
      type: nodeType,
      data: { label: "New Node" },
      position,
      parentNode: parentNode.id,
      targetHandlePosition: nodeType.replace("infoNode_", ""),
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
      sourceHandle: sourceHandleId,
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
}));

export default useStore;
