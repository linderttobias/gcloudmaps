// Import required libraries
import { Handle, Position } from 'reactflow'
import '../index.css'

function NodeTop({ data }) {
  return (
    <div>
      <div style={{ justifyContent: 'center' }}>
        {data.shortDescription ? (
          <div style={{ margin: 'auto', maxWidth: '150px' }}>
            {data.shortDescription ? <div style={{ fontSize: '10px', marginTop: '5px' }}>{data.shortDescription}</div> : null}
          </div>
        ) : null}
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          {data.link ? (
            <a href={data.link} target='_blank'>
              {data.label}
            </a>
          ) : (
            data.label
          )}
        </div>
      </div>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='target' position={Position.Bottom} id='bottom' />
      <Handle type='source' position={Position.Top} id='top' />
    </div>
  )
}

function NodeBottom({ data }) {
  return (
    <div>
      <div style={{ justifyContent: 'center' }}>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          {data.link ? (
            <a href={data.link} target='_blank'>
              {data.label}
            </a>
          ) : (
            data.label
          )}
        </div>
        {data.shortDescription ? (
          <div style={{ margin: 'auto', maxWidth: '150px' }}>
            {data.shortDescription ? <div style={{ fontSize: '10px', marginTop: '5px' }}>{data.shortDescription}</div> : null}
          </div>
        ) : null}
      </div>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='source' position={Position.Bottom} id='bottom' />
      <Handle type='target' position={Position.Top} id='top' />
    </div>
  )
}

function NodeLeft({ data }) {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {data.shortDescription ? (
          <div style={{ margin: 'auto', maxWidth: '250px' }}>
            {data.shortDescription ? <div style={{ fontSize: '10px', marginRight: '5px' }}>{data.shortDescription}</div> : null}
          </div>
        ) : null}
        {data.link ? (
          <a href={data.link} target='_blank'>
            {data.label}
          </a>
        ) : (
          data.label
        )}
      </div>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='target' position={Position.Right} id='right' />
      <Handle type='source' position={Position.Bottom} id='bottom' />
      <Handle type='source' position={Position.Top} id='top' />
    </div>
  )
}

function NodeRight({ data }) {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {data.link ? (
          <a href={data.link} target='_blank'>
            {data.label}
          </a>
        ) : (
          data.label
        )}
        {data.shortDescription ? (
          <div style={{ margin: 'auto', width: 250 }}>
            {data.shortDescription ? <div style={{ fontSize: '10px', marginLeft: '5px' }}>{data.shortDescription}</div> : null}
          </div>
        ) : null}
      </div>
      <Handle type='target' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='source' position={Position.Bottom} id='bottom' />
      <Handle type='source' position={Position.Top} id='top' />
    </div>
  )
}

function NodeMain({ data }) {
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
