import type { DiagramEdge, DiagramNode, DiagramView } from '@likec4/core'
import type { SetRequired, Simplify } from 'type-fest'
import type { XYFlowEdge, XYFlowInstance, XYFlowNode } from './xyflow/types'

export type DiagramNodeWithNavigate = Simplify<SetRequired<DiagramNode, 'navigateTo'>>

export type OnNavigateTo = (
  args: { element: DiagramNodeWithNavigate; xynode: XYFlowNode; event: React.MouseEvent }
) => void
export type OnNodeClick = (args: { element: DiagramNode; xynode: XYFlowNode; event: React.MouseEvent }) => void
export type OnEdgeClick = (args: { relation: DiagramEdge; xyedge: XYFlowEdge; event: React.MouseEvent }) => void

/**
 * On pane/canvas click (not on any node or edge)
 */
export type OnCanvasClick = (event: React.MouseEvent) => void

export type LikeC4ViewColorMode = 'system' | 'light' | 'dark'

export interface LikeC4ViewProps {
  view: DiagramView

  /** Controls color scheme used for styling the flow
   * @default 'system'
   * @example 'system' | 'light' | 'dark'
   */
  colorMode?: LikeC4ViewColorMode | undefined
  /**
   * If set, initial viewport will show all nodes & edges
   * @default true
   */
  fitView?: boolean | undefined
  /**
  /**
   * Seems like this is percentage of the view size
   * @default 0
   */
  fitViewPadding?: number | undefined
}

export interface LikeC4DiagramProps extends LikeC4DiagramEventHandlers {
  view: DiagramView

  /** Controls color scheme used for styling the flow
   * @default 'system'
   * @example 'system' | 'light' | 'dark'
   */
  colorMode?: LikeC4ViewColorMode | undefined

  /**
   * Show/hide controls menu
   * @default true
   */
  controls?: boolean | undefined
  /**
   * Enable/disable panning
   * @default true
   */
  pannable?: boolean | undefined
  /**
   * Enable/disable zooming
   * @default true
   */
  zoomable?: boolean | undefined

  /**
   * Fit view to the selected node(s)
   * @default true
   */
  fitOnSelect?: boolean | undefined
  /**
   * Disable any editing (dragging still can be enabled with `nodesDraggable`)
   * @default false
   */
  readonly?: boolean | undefined
  /**
   * If set, initial viewport will show all nodes & edges
   * @default true
   */
  fitView?: boolean | undefined
  /**
   * Seems like this is percentage of the view size
   * @default 0.05
   */
  fitViewPadding?: number | undefined
  nodesSelectable?: boolean | undefined
  nodesDraggable?: boolean | undefined
  disableBackground?: boolean | undefined

  /**
   * Disable element hovercards, such as links and properties
   * @default false
   */
  disableHovercards?: boolean | undefined
}

export interface LikeC4DiagramEventHandlers {
  // onChange?: OnChange | undefined
  onNavigateTo?: OnNavigateTo | undefined
  onNodeClick?: OnNodeClick | undefined
  onNodeContextMenu?: OnNodeClick | undefined
  onCanvasContextMenu?: OnCanvasClick | undefined
  onEdgeClick?: OnEdgeClick | undefined
  onEdgeContextMenu?: OnEdgeClick | undefined
  onCanvasClick?: OnCanvasClick | undefined
  onCanvasDblClick?: OnCanvasClick | undefined
  // onInitialized?: ((xyflow: XYFlowInstance) => void) | undefined
  // onMoveStart?: OnMoveStart | undefined
  // onMoveEnd?: OnMoveEnd | undefined
}
