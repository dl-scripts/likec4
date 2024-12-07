import { map, prop } from 'remeda'
import type { TupleToUnion } from 'type-fest'
import { describe, expect, it } from 'vitest'
import type { Fqn } from '../../types/element'
import type { ComputedEdge, EdgeId } from '../../types/view'
import { commonAncestor } from '../../utils/fqn'
import { buildComputedNodes, type ComputedNodeSource } from './buildComputedNodes'
import { linkNodeEdges } from './linkNodeEdges'
import { topologicalSort } from './topologicalSort'

describe('topologicalSort', () => {
  // #region
  function testmodel<const NodeId extends string>(
    nodes: readonly [NodeId, ...NodeId[]],
    edges: Array<`${NoInfer<NodeId>} -> ${NoInfer<NodeId>}`> = []
  ) {
    const nodesMap = buildComputedNodes(
      nodes.map(id => ({ id, title: id }) as any as ComputedNodeSource)
    )
    const _edges = edges.map(s => {
      const [source, target] = s.split(' -> ') as [Fqn, Fqn]
      return {
        id: `${source} -> ${target}` as EdgeId,
        source,
        target,
        parent: commonAncestor(source as any as Fqn, target as any as Fqn),
        label: null,
        relations: []
      } as ComputedEdge
    })
    linkNodeEdges(nodesMap, _edges)
    return topologicalSort({
      nodes: [...nodesMap.values()],
      edges: _edges
    })
  }

  function expectOrder<const NodeIds extends readonly [string, ...string[]]>(
    nodes: NodeIds,
    edges: Array<`${TupleToUnion<NoInfer<NodeIds>>} -> ${TupleToUnion<NoInfer<NodeIds>>}`> = []
  ) {
    const sorted = testmodel(nodes, edges)

    return expect({
      nodes: map(sorted.nodes, prop('id')),
      edges: map(sorted.edges, prop('id'))
    })
  }

  function expectNodesOrder<const NodeIds extends readonly [string, ...string[]]>(
    nodes: NodeIds,
    edges: Array<`${TupleToUnion<NoInfer<NodeIds>>} -> ${TupleToUnion<NoInfer<NodeIds>>}`> = []
  ) {
    const sorted = testmodel(nodes, edges).nodes
    return expect(map(sorted, prop('id')))
  }
  // #endregion

  describe('two nodes inside', () => {
    const nodes = [
      'cloud',
      'customer',
      'cloud.backend',
      'cloud.frontend'
    ] as const

    it('should keep sorting, if no edges', () => {
      expectNodesOrder(nodes).toEqual(['cloud', 'customer', 'cloud.backend', 'cloud.frontend'])
    })

    it('should sort nested nodes using edges', () => {
      expectNodesOrder(nodes, [
        'cloud.frontend -> cloud.backend'
      ]).toEqual([
        'cloud',
        'customer',
        'cloud.frontend',
        'cloud.backend'
      ])
    })

    it('should sort nodes using edges', () => {
      expectNodesOrder(nodes, [
        'customer -> cloud.frontend',
        'cloud.frontend -> cloud.backend'
      ]).toEqual([
        'customer',
        'cloud',
        'cloud.frontend',
        'cloud.backend'
      ])
    })
  })

  describe('three nodes inside', () => {
    const nodes = [
      'customer',
      'cloud.frontend',
      'cloud.db',
      'cloud',
      'amazon',
      'cloud.backend'
    ] as const

    it('should keep sorting, if no edges', () => {
      const sorted = testmodel(nodes).nodes
      expect(map(sorted, prop('id'))).toEqual([
        'customer',
        'cloud',
        'cloud.frontend',
        'cloud.db',
        'amazon',
        'cloud.backend'
      ])

      const cloud = sorted.find(n => n.id === 'cloud')!
      expect(cloud).toMatchObject({
        id: 'cloud',
        parent: null,
        children: ['cloud.frontend', 'cloud.db', 'cloud.backend']
      })
    })

    it('should sort nested nodes using edges', () => {
      expectNodesOrder(nodes, [
        'cloud.frontend -> cloud.backend',
        'cloud.backend -> cloud.db'
      ]).toEqual([
        'customer',
        'cloud',
        'amazon',
        'cloud.frontend',
        'cloud.backend',
        'cloud.db'
      ])
    })

    it('should sort nodes using edges', () => {
      expectNodesOrder(nodes, [
        'customer -> cloud.frontend',
        'cloud.frontend -> cloud.backend',
        'cloud.backend -> cloud.db',
        'cloud.db -> amazon'
      ]).toEqual([
        'customer',
        'cloud',
        'cloud.frontend',
        'cloud.backend',
        'cloud.db',
        'amazon'
      ])
    })

    it('should sort nodes using edges and ignore cycles', () => {
      expectOrder(nodes, [
        'amazon -> cloud.backend',
        'cloud.db -> amazon',
        'cloud.frontend -> cloud.backend',
        'cloud.backend -> cloud.db'
      ]).toMatchObject({
        nodes: [
          'customer',
          'cloud',
          'cloud.frontend',
          'cloud.backend',
          'cloud.db',
          'amazon'
        ],
        edges: [
          'cloud.frontend -> cloud.backend',
          'cloud.backend -> cloud.db',
          'cloud.db -> amazon',
          'amazon -> cloud.backend'
        ]
      })
    })

    it('should sort nodes using edges and ignore cycles (2)', () => {
      expectNodesOrder(nodes, [
        'customer -> cloud.frontend',
        'amazon -> customer',
        'cloud.frontend -> cloud.backend',
        'cloud.backend -> cloud.db',
        'cloud.db -> amazon'
      ]).toEqual([
        'customer',
        'cloud',
        'cloud.frontend',
        'cloud.backend',
        'cloud.db',
        'amazon'
      ])
    })
  })
})
