import {
  type ALikeC4Model,
  type ComputedDynamicView,
  type ComputedView,
  type DiagramView,
  type EdgeId as C4EdgeId,
  extractStep,
  isStepEdgeId,
  type RelationID as C4RelationID,
  type StepEdgeId,
  type Tag as C4Tag
} from '../../types'
import type { RelationshipsIterator } from '../RelationModel'
import type { IteratorLike, RelationID } from '../types'
import type { LikeC4ViewModel } from './LikeC4ViewModel'
import type { NodeModel } from './NodeModel'

export type EdgesIterator<M extends ALikeC4Model, V extends ComputedView | DiagramView> = IteratorLike<EdgeModel<M, V>>

export class EdgeModel<M extends ALikeC4Model, V extends ComputedView | DiagramView> {
  constructor(
    public readonly view: LikeC4ViewModel<M, V>,
    public readonly $edge: V['edges'][number],
    public readonly source: NodeModel<M, V>,
    public readonly target: NodeModel<M, V>
  ) {
  }

  get id(): C4EdgeId {
    return this.$edge.id
  }

  get parent(): NodeModel<M, V> | null {
    return this.$edge.parent ? this.view.node(this.$edge.parent) : null
  }

  public hasParent(): this is EdgeModel.WithParent<M, V> {
    return this.$edge.parent !== null
  }

  get tags(): ReadonlyArray<C4Tag> {
    return this.$edge.tags ?? []
  }

  get stepNumber(): number | null {
    return this.isStep() ? extractStep(this.id) : null
  }

  get navigateTo(): LikeC4ViewModel<M> | null {
    return this.$edge.navigateTo ? this.view.model.view(this.$edge.navigateTo) : null
  }

  public isStep(): this is EdgeModel.StepEdge<M, ComputedDynamicView> {
    return isStepEdgeId(this.id)
  }

  public *relationships(): RelationshipsIterator<M> {
    for (const rel of this.$edge.relations) {
      yield this.view.model.relationship(rel)
    }
    return
  }

  public includesRelation(rel: RelationID): boolean {
    return this.$edge.relations.includes(rel as C4RelationID)
  }
}

namespace EdgeModel {
  export interface StepEdge<M extends ALikeC4Model, V extends ComputedView | DiagramView> extends EdgeModel<M, V> {
    id: StepEdgeId
    stepNumber: number
  }
  export interface WithParent<M extends ALikeC4Model, V extends ComputedView | DiagramView> extends EdgeModel<M, V> {
    parent: NodeModel<M, V>
  }
}
