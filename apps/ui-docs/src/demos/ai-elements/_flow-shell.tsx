import { Canvas } from '@firefly/ui/components/ai-elements/canvas'
import { Connection } from '@firefly/ui/components/ai-elements/connection'
import { Controls } from '@firefly/ui/components/ai-elements/controls'
import { Edge } from '@firefly/ui/components/ai-elements/edge'
import { Node, NodeContent, NodeHeader, NodeTitle } from '@firefly/ui/components/ai-elements/node'
import { Panel } from '@firefly/ui/components/ai-elements/panel'
import { ReactFlowProvider, type Edge as FlowEdge, type Node as FlowNode } from '@xyflow/react'
import type { ReactNode } from 'react'

const defaultNodes: FlowNode[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { label: 'Input' },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 220, y: 80 },
    data: { label: 'Output' },
  },
]

const defaultEdges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2', type: 'animated' }]

const nodeTypes = {
  custom: ({ data }: { data: { label: string } }) => (
    <Node handles={{ target: true, source: true }}>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
      </NodeHeader>
      <NodeContent>Agent step</NodeContent>
    </Node>
  ),
}

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
}

type FlowShellProps = {
  children?: ReactNode
  showControls?: boolean
  showPanel?: boolean
  panelContent?: ReactNode
}

export function FlowShell({
  children,
  showControls = true,
  showPanel = false,
  panelContent = 'Flow legend',
}: FlowShellProps) {
  return (
    <ReactFlowProvider>
      <div className="h-64 w-full rounded-lg border">
        <Canvas
          connectionLineComponent={Connection}
          defaultEdges={defaultEdges}
          defaultNodes={defaultNodes}
          edgeTypes={edgeTypes}
          fitView
          nodeTypes={nodeTypes}
        >
          {showControls ? <Controls /> : null}
          {showPanel ? <Panel position="top-left">{panelContent}</Panel> : null}
          {children}
        </Canvas>
      </div>
    </ReactFlowProvider>
  )
}
