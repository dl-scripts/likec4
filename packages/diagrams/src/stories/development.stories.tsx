import { ActionType, action, useLadleContext, type Story, type StoryDefault } from '@ladle/react'
import { useStoryViewport } from '../../.ladle/components'
import { Diagram, DiagramStateProvider } from '../diagram'
import { useDiagramRef } from '../hooks'
import type { LikeC4ViewId } from './likec4'
import { LikeC4ViewIds, LikeC4Views } from './likec4'

export default {
  args: {
    viewId: 'index',
    padding: 16,
    animate: true,
    pannable: true,
    zoomable: true
  },
  argTypes: {
    viewId: {
      defaultValue: 'index',
      options: LikeC4ViewIds,
      control: {
        type: 'select'
      }
    },
    pannable: {
      control: { type: 'boolean' }
    },
    animate: {
      control: { type: 'boolean' }
    },
    zoomable: {
      control: { type: 'boolean' }
    },
    padding: {
      control: { type: 'number' }
    }
  }
} as StoryDefault<Props>

type Props = {
  viewId: LikeC4ViewId
  animate?: boolean
  padding?: number
  pannable?: boolean
  zoomable?: boolean
}

export const DiagramDevelopment: Story<Props> = ({ viewId, ...props }) => {
  const diagramApi = useDiagramRef()
  const measures = useStoryViewport()
  const {
    dispatch,
    globalState: { control: controlState }
  } = useLadleContext()
  const diagram = LikeC4Views[viewId]
  return (
    <DiagramStateProvider>
      <Diagram
        ref={diagramApi.ref}
        className='dev-app'
        diagram={diagram}
        {...props}
        width={measures.width}
        height={measures.height}
        onNodeClick={(node, event) => {
          if (node.navigateTo) {
            dispatch({
              type: ActionType.UpdateControl,
              value: {
                ...controlState,
                viewId: {
                  ...controlState['viewId'],
                  value: node.navigateTo
                }
              }
            })
          }
          action('onNodeClick')({
            node,
            event
          })
        }}
        onEdgeClick={(edge, event) => action('onEdgeClick')({ edge, event })}
        onStageClick={(stage, event) => action('onStageClick')({ stage, event })}
        onStageContextMenu={(stage, event) => {
          event.evt.preventDefault()
          action('onStageContextMenu')({ stage, event })
        }}
        onNodeContextMenu={(node, event) => {
          event.evt.preventDefault()
          action('onNodeContextMenu')({ node, event })
        }}
      />
    </DiagramStateProvider>
  )
}
DiagramDevelopment.storyName = 'Diagram'

export const Colors: Story<Props> = props => {
  return <DiagramDevelopment {...props} />
}
Colors.args = {
  viewId: 'themecolors'
}