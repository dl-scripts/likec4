import { nonNullable } from '@likec4/core'
import { useShallowEffect } from '@mantine/hooks'
import {
  useDebouncedCallback,
  useDebouncedEffect,
  useIsMounted,
  useList,
  useMap,
  useSyncedRef,
  useUpdateEffect
} from '@react-hookz/web'
import {
  type Node as ReactFlowNode,
  type ReactFlowState,
  useOnSelectionChange,
  useOnViewportChange,
  useReactFlow,
  useStore,
  useStoreApi,
  useUpdateNodeInternals,
  type Viewport
} from '@xyflow/react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { difference, hasAtLeast, uniq } from 'remeda'
import useTilg from 'tilg'
import { distance } from '../utils'
import { useLikeC4Editor } from '../ViewEditorApi'

const selectUserSelectionActive = (state: ReactFlowState) => state.userSelectionActive

const CameraMemo = memo(function Camera() {
  useTilg()
  const isMounted = useIsMounted()
  const isUserSelectionActive = useStore(selectUserSelectionActive)
  const reactflow = useReactFlow()
  const reactflowRef = useSyncedRef(reactflow)
  const updateNd = useUpdateNodeInternals()

  const editor = useLikeC4Editor()
  const padding = editor.fitViewPadding
  const viewId = editor.viewId

  const previousViewport = useRef<Viewport | null>(null)
  const viewportChangeStart = useRef<Viewport | null>(null)
  const prevViewId = useRef(viewId)
  const isReady = reactflow.viewportInitialized
  const selectedNodesRef = useRef([] as string[])

  const [selectedNodes, setSelectedNodes] = useState([] as ReactFlowNode[])

  // WORKAROUND

  useOnViewportChange({
    onStart: (viewport) => {
      viewportChangeStart.current = { ...viewport }
    },
    onEnd: (end) => {
      if (!viewportChangeStart.current || !previousViewport.current) {
        viewportChangeStart.current = null
        return
      }
      const start = {
        ...viewportChangeStart.current
      }
      const d = distance(start, end)
      if (d > 15) {
        previousViewport.current = null
      }
      viewportChangeStart.current = null
    }
  })

  const fixUseOnViewportChange = () => {
    // WORKAROUND:
    // react-flow triggers useOnViewportChange
    // We reset the viewportChangeStart, before useOnViewportChange.onEnd called
    setTimeout(() => {
      viewportChangeStart.current = null
    }, 50)
  }

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      if (!isMounted()) {
        return
      }
      console.debug(`Camera: onSelectionChange`)
      if (nodes.length === 0 && edges.length === 0) {
        setSelectedNodes([])
        return
      }
      const reactflow = reactflowRef.current
      const selected = new Set<ReactFlowNode>([
        ...nodes,
        ...edges.flatMap((edge) => [
          reactflow.getNode(edge.source),
          reactflow.getNode(edge.target)
        ]).filter(Boolean)
      ])
      setSelectedNodes([...selected])
    }
  })

  const selectedNodesHash = useTilg(selectedNodes.map((node) => node.id).sort().join('\n'))
  useEffect(
    () => {
      if (isUserSelectionActive || !isReady) {
        return
      }
      const reactflow = reactflowRef.current
      if (selectedNodes.length === 0) {
        if (previousViewport.current) {
          console.log(`Camera: revert viewport`)
          reactflow.setViewport(previousViewport.current, {
            duration: 300
          })
          previousViewport.current = null
        }
        return
      }
      previousViewport.current ??= { ...reactflow.getViewport() }
      const zoom = previousViewport.current.zoom
      reactflow.fitView({
        duration: 350,
        maxZoom: Math.max(1, zoom),
        padding,
        nodes: selectedNodes
      })
      fixUseOnViewportChange()
    },
    [selectedNodesHash, isReady, isUserSelectionActive]
  )

  useEffect(() => {
    const ids = selectedNodes.map((node) => node.id)
    for (const id of uniq([...selectedNodesRef.current, ...ids])) {
      try {
        updateNd(id)
      } catch (e) {
        console.warn(`Camera: failed useUpdateNodeInternals`, e)
      }
    }
    selectedNodesRef.current = ids
  }, [selectedNodesHash, updateNd])

  useDebouncedEffect(
    () => {
      if (!isReady || prevViewId.current === viewId) {
        return
      }
      console.debug(`Camera: fitViewAnimation`)
      const reactflow = reactflowRef.current
      const zoom = previousViewport.current?.zoom ?? reactflow.getZoom()
      reactflow.fitView({
        duration: 400,
        maxZoom: Math.max(1, zoom),
        padding
      })
      previousViewport.current = null
      prevViewId.current = viewId
    },
    [isReady, viewId],
    100,
    500
  )

  return null
})

export default CameraMemo
