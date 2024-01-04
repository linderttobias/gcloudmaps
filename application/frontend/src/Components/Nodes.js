// Import required libraries
import { Handle, Position} from 'reactflow'
import '../index.css'
import NodeElements from './NodeElements';

function NodeTop({ id, data }) {
  return (
    <div>
      <NodeElements id={id} type="top" label={data.label} link={data.link} description={data.shortDescription}/>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='target' isConnectableStart={false} style={{visibility: "hidden"}} position={Position.Bottom} id='bottom' />
      <Handle type='source' position={Position.Top} id='top' />
    </div>
  )
}

function NodeBottom({ id, data }) {
  return (
    <div>
      <NodeElements id={id} type="bottom" label={data.label} link={data.link} description={data.shortDescription}/>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='source' position={Position.Bottom} id='bottom' />
      <Handle type='target' isConnectableStart={false} style={{visibility: "hidden"}} position={Position.Top} id='top' />
    </div>
  )
}

function NodeLeft({ id, data }) {
  return (
    <div>
      <NodeElements id={id} type="left" label={data.label} link={data.link} description={data.shortDescription}/>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='target' isConnectableStart={false} style={{visibility: "hidden"}} position={Position.Right} id='right' />
      <Handle type='source' position={Position.Bottom} id='bottom' />
      <Handle type='source' position={Position.Top} id='top' />
    </div>
  )
}

function NodeRight({ id, data }) {
  return (
    <div>
      <NodeElements id={id} type="right" label={data.label} link={data.link} description={data.shortDescription}/>
      <Handle type='target' isConnectableStart={false} style={{visibility: "hidden"}} position={Position.Left} id='left' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='source' position={Position.Bottom} id='bottom' />
      <Handle type='source' position={Position.Top} id='top' />
    </div>
  )
}

function NodeMain({ id, data }) {
  return (
    <div>
      <Handle type='source' position={Position.Left}  id='left' isConnectable={true} />
      <Handle type='source' position={Position.Top} id='top' isConnectable={true} />
      <text style={{ fontWeight: 'normal', fontSize: '2em' }}>
      <NodeElements id={id} type="right" label={data.label} link={data.link} description={data.shortDescription}/>
      </text>
      <Handle type='source' position={Position.Right} id='right' isConnectable={true} />
      <Handle type='source' position={Position.Bottom} id='bottom' isConnectable={true} />
    </div>
  )
}

export { NodeBottom, NodeTop, NodeLeft, NodeRight, NodeMain }
