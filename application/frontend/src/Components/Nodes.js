// Import required libraries
import { Handle, Position} from 'reactflow'
import '../index.css'
import NodeElements from './NodeElements';

function Text({label, link, id}) {
  return (link ? (
    <a href={link} target='_blank'>
      {label}
    </a>
  ) : (
    <NodeElements initialText={label} id={id} />
  ));
}

function Description({text, width}) {
  return (
    text ? (
      <div style={{ margin: 'auto', maxWidth: width}}>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>{text}</div>
      </div>
    ) : null
  );
}

function NodeTop({ id, data }) {
  return (
    <div>
      <NodeElements id={id} type="top" label={data.label} link={data.link} description={data.shortDescription}/>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='target' position={Position.Bottom} id='bottom' />
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
      <Handle type='target' position={Position.Top} id='top' />
    </div>
  )
}

function NodeLeft({ id, data }) {
  return (
    <div>
      <NodeElements id={id} type="bottom" label={data.label} link={data.link} description={data.shortDescription}/>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='target' position={Position.Right} id='right' />
      <Handle type='source' position={Position.Bottom} id='bottom' />
      <Handle type='source' position={Position.Top} id='top' />
    </div>
  )
}

function NodeRight({ id, data }) {
  return (
    <div>
      <NodeElements id={id} type="bottom" label={data.label} link={data.link} description={data.shortDescription}/>
      <Handle type='target' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='source' position={Position.Bottom} id='bottom' />
      <Handle type='source' position={Position.Top} id='top' />
    </div>
  )
}

function NodeMain({ id, data }) {
  return (
    <div>
      <Handle type='source' position={Position.Left} id='left' isConnectable={true} />
      <Handle type='source' position={Position.Top} id='top' isConnectable={true} />
      <text style={{ fontWeight: 'normal', fontSize: '2em' }}>{data.label}</text>
      <sup class='superscript' style={{ fontSize: '0.1em' }}>
        v03/23
      </sup>
      <Handle type='source' position={Position.Right} id='right' isConnectable={true} />
      <Handle type='source' position={Position.Bottom} id='bottom' isConnectable={true} />
    </div>
  )
}

export { NodeBottom, NodeTop, NodeLeft, NodeRight, NodeMain }
