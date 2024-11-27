import { sort } from 'remeda'
import type { SetFieldType } from 'type-fest'
import { nonNullable } from '../../../errors'
import type { RelationID } from '../../../types'
import type { Fqn, Tag } from '../../../types/element'
import type { ComputedLikeC4Model, LayoutedLikeC4Model } from '../../../types/model'
import {
  type ComputedDeploymentView,
  type ComputedDynamicView,
  type ComputedElementView,
  type ComputedView,
  type DiagramView,
  isDeploymentView,
  isDynamicView,
  isElementView,
  type NodeId,
  type ViewID
} from '../../../types/view'
import { compareByFqnHierarchically, getOrCreate } from '../../../utils'
import { type EdgeId, getId } from '../../types'
import type { ElementModel } from '../ElementModel'
import type { LikeC4Model } from '../LikeC4Model'
import { EdgeModel } from './EdgeModel'
import { NodeModel } from './NodeModel'

type M = ComputedLikeC4Model
export type ComputedOrDiagram = ComputedView | DiagramView

type NodeOrId = NodeId | { id: NodeId }
type EdgeOrId = EdgeId | { id: EdgeId }

export class LikeC4ViewModel<View extends ComputedOrDiagram> {
  readonly #rootnodes = new Set<NodeModel<View>>()
  readonly #nodes = new Map<NodeId, NodeModel<View>>()
  readonly #edges = new Map<EdgeId, EdgeModel<View>>()
  readonly #includeElements = new Set<Fqn>()
  readonly #includeRelations = new Set<RelationID>()
  readonly #allTags = new Map<Tag, Set<NodeModel<View> | EdgeModel<View>>>()

  constructor(
    public readonly model: LikeC4Model,
    public readonly $view: View
  ) {
    for (const node of sort($view.nodes, compareByFqnHierarchically)) {
      const el = new NodeModel(this, node)
      this.#nodes.set(node.id, el)
      if (!node.parent) {
        this.#rootnodes.add(el)
      }
      if (el.hasElement()) {
        this.#includeElements.add(el.element.id)
      }
      for (const tag of el.tags) {
        getOrCreate(this.#allTags, tag, () => new Set()).add(el)
      }
    }

    for (const edge of $view.edges) {
      const edgeModel = new EdgeModel(this, edge, this.node(edge.source), this.node(edge.target))
      for (const tag of edgeModel.tags) {
        getOrCreate(this.#allTags, tag, () => new Set()).add(edgeModel)
      }
      for (const rel of edge.relations) {
        this.#includeRelations.add(rel)
      }
      this.#edges.set(edge.id, edgeModel)
    }
  }

  get __(): NonNullable<View['__']> {
    return this.$view.__ ?? 'element'
  }

  get id(): ViewID {
    return this.$view.id
  }

  get title(): string | null {
    return this.$view.title
  }

  get tags(): ReadonlyArray<Tag> {
    return this.$view.tags ?? []
  }

  get viewOf(): ElementModel<M> | null {
    if (isElementView(this.$view)) {
      return this.$view.viewOf ? this.model.element(this.$view.viewOf) : null
    }
    return null
  }

  /**
   * All tags from nodes and edges.
   */
  get includedTags(): ReadonlyArray<Tag> {
    return [...this.#allTags.keys()]
  }

  public rootNodes(): IteratorObject<NodeModel<View>> {
    return this.#rootnodes.values()
  }

  /**
   * Iterate over all nodes that have children.
   */
  public compounds(): IteratorObject<NodeModel<View>> {
    return this.#nodes.values().filter(node => node.hasChildren())
  }

  /**
   * Find node by id.
   */
  public node(node: NodeOrId): NodeModel<View> {
    const nodeId = getId(node)
    return nonNullable(this.#nodes.get(nodeId), `Node ${nodeId} not found in view ${this.$view.id}`)
  }
  /**
   * Iterate over all nodes.
   */
  public nodes(): IteratorObject<NodeModel<View>> {
    return this.#nodes.values()
  }

  /**
   * Find edge by id.
   * @param edge Edge or id
   * @returns EdgeModel
   */
  public edge(edge: EdgeOrId): EdgeModel<View> {
    const edgeId = getId(edge)
    return nonNullable(this.#edges.get(edgeId), `Edge ${edgeId} not found in view ${this.$view.id}`)
  }
  /**
   * Iterate over all edges.
   */
  public edges(): IteratorObject<EdgeModel<View>> {
    return this.#edges.values()
  }

  /**
   * Iterate over all edges.
   */
  public edgesWithRelation(relation: RelationID): IteratorObject<EdgeModel<View>> {
    return this.#edges.values().filter(edge => edge.includesRelation(relation))
  }

  /**
   * Nodes that have references to elements from logical model.
   */
  public elements(): IteratorObject<NodeModel.WithElement<View>> {
    return this.#nodes.values().filter(node => node.hasElement())
  }

  public includesElement(elementId: Fqn): boolean {
    return this.#includeElements.has(elementId)
  }

  public includesRelation(relationId: RelationID): boolean {
    return this.#includeRelations.has(relationId)
  }

  /**
   * Below are type guards.
   */
  public isComputed(): this is LikeC4ViewModel<ComputedView> {
    return true // Diagram view is a computed view
  }

  public isDiagram(): this is LikeC4ViewModel<DiagramView> {
    return 'bounds' in this.$view
  }

  public isElementView(): this is LikeC4ViewModel<ComputedElementView> {
    return isElementView(this.$view)
  }

  public isDeploymentView(): this is LikeC4ViewModel<ComputedDeploymentView> {
    return isDeploymentView(this.$view)
  }

  public isDynamicView(): this is LikeC4ViewModel<ComputedDynamicView> {
    return isDynamicView(this.$view)
  }
}
