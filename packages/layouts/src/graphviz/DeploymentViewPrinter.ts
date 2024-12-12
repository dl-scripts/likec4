import {
  type ComputedDeploymentView,
  type ComputedEdge,
  ComputedNode,
  DefaultArrowType,
  nonNullable
} from '@likec4/core'
import { first, forEachObj, groupBy, isNonNullish, isString, last, map, pipe } from 'remeda'
import type { EdgeModel, RootGraphModel, SubgraphModel } from 'ts-graphviz'
import { attribute as _ } from 'ts-graphviz'
import { edgelabel } from './dot-labels'
import { DefaultEdgeStyle, DotPrinter } from './DotPrinter'
import { ElementViewPrinter } from './ElementViewPrinter'
import { pxToInch, pxToPoints, toArrowType } from './utils'

// TODO: For now we use ElementViewPrinter for DeploymentView
export class DeploymentViewPrinter extends DotPrinter<ComputedDeploymentView> {
  protected override createGraph(): RootGraphModel {
    const G = super.createGraph()
    const autoLayout = this.view.autoLayout
    G.delete(_.TBbalance)
    G.apply({
      [_.nodesep]: pxToInch(autoLayout.nodeSep ?? 130),
      [_.ranksep]: pxToInch(autoLayout.rankSep ?? 130)
    })
    return G
  }

  protected override postBuild(G: RootGraphModel): void {
    pipe(
      this.view.nodes,
      map(nd => ({
        node: nd,
        graphvizNode: this.getGraphNode(nd.id)
      })),
      groupBy(({ node, graphvizNode }) => {
        if (graphvizNode == null) {
          return undefined
        }
        return ComputedNode.modelRef(node) ?? undefined
      }),
      forEachObj((nodes) => {
        if (nodes.length > 1) {
          G.set(_.newrank, true)
          G.set(_.clusterrank, 'global')
          const subgraph = G.createSubgraph({ [_.rank]: 'same' })
          nodes.forEach(({ graphvizNode }) => {
            subgraph.node(nonNullable(graphvizNode).id)
          })
        }
      })
    )
  }

  protected override elementToSubgraph(compound: ComputedNode, subgraph: SubgraphModel) {
    const sub = super.elementToSubgraph(compound, subgraph)
    if (compound.children.length > 1) {
      sub.set(_.margin, pxToPoints(50))
    }
    return sub
  }

  override addEdge(edge: ComputedEdge, G: RootGraphModel): EdgeModel | null {
    // const [sourceFqn, targetFqn] = edge.dir === 'back' ? [edge.target, edge.source] : [edge.source, edge.target]
    const [sourceFqn, targetFqn] = [edge.source, edge.target]
    const [sourceNode, source, ltail] = this.edgeEndpoint(sourceFqn, nodes => last(nodes))
    const [targetNode, target, lhead] = this.edgeEndpoint(targetFqn, first)

    const edgeParentId = edge.parent
    const parent = edgeParentId === null
      ? G
      : nonNullable(this.getSubgraph(edgeParentId), `Parent not found for edge ${edge.id}`)

    const hasCompoundEndpoint = isNonNullish(lhead) || isNonNullish(ltail)

    const e = parent.edge([source, target], {
      [_.likec4_id]: edge.id,
      [_.style]: edge.line ?? DefaultEdgeStyle
    })

    lhead && e.attributes.set(_.lhead, lhead)
    ltail && e.attributes.set(_.ltail, ltail)

    if (!hasCompoundEndpoint) {
      const connected = new Set([
        ...sourceNode.inEdges,
        ...sourceNode.outEdges,
        ...targetNode.inEdges,
        ...targetNode.outEdges
      ].filter(e => !this.edgesWithCompounds.has(e)))
      e.attributes.set(_.weight, connected.size)
    }

    const label = edgelabel(edge)
    if (label) {
      e.attributes.set(_.label, label)
    }
    if (edge.color) {
      const colorValues = this.getRelationshipColorValues(edge.color)
      e.attributes.apply({
        [_.color]: colorValues.lineColor,
        [_.fontcolor]: colorValues.labelColor
      })
    }

    let [head, tail] = [edge.head ?? DefaultArrowType, edge.tail ?? 'none']

    if (head === 'none' && tail === 'none') {
      e.attributes.apply({
        [_.arrowtail]: 'none',
        [_.arrowhead]: 'none',
        [_.dir]: 'none',
        [_.weight]: 0
        // [_.minlen]: 0
        // [_.constraint]: false
      })
      return e
    }

    if (edge.dir === 'both') {
      e.attributes.apply({
        [_.arrowhead]: toArrowType(head),
        [_.arrowtail]: toArrowType(edge.tail ?? head),
        [_.dir]: 'both',
        [_.weight]: 0
        // [_.constraint]: false,
        // [_.minlen]: 0
      })
      if (!hasCompoundEndpoint && ComputedNode.modelRef(sourceNode) !== ComputedNode.modelRef(targetNode)) {
        e.attributes.set(_.constraint, false)
      }
      return e
    }

    if (head !== DefaultArrowType) {
      e.attributes.set(_.arrowhead, toArrowType(head))
    }
    if (tail !== 'none') {
      e.attributes.set(_.arrowtail, toArrowType(tail))
    }

    return e
  }
}