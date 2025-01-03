import { type ComputedView, type DiagramView, type Fqn, LikeC4Model, type ViewId } from '@likec4/core'
import { useContext } from 'react'
import { isDefined, isNonNullish, isString } from 'remeda'
import type { LiteralUnion } from 'type-fest'
import { useCurrentViewId } from '../hooks'
import { LikeC4ModelContext } from './LikeC4ModelContext'

export function useLikeC4Model(): LikeC4Model | null
export function useLikeC4Model(strict: true): LikeC4Model
export function useLikeC4Model(strict: boolean): LikeC4Model | null
export function useLikeC4Model(strict: true, type: 'layouted'): LikeC4Model.Layouted
export function useLikeC4Model(strict: true, type: 'computed'): LikeC4Model.Computed
export function useLikeC4Model(strict: true, type: 'layouted' | 'computed' | undefined): LikeC4Model
export function useLikeC4Model(strict: boolean, type: 'layouted'): LikeC4Model.Layouted | null
export function useLikeC4Model(strict: boolean, type: 'computed'): LikeC4Model.Computed | null
export function useLikeC4Model(strict: boolean, type: 'layouted' | 'computed' | undefined): LikeC4Model | null
export function useLikeC4Model(strict?: boolean, type?: 'layouted' | 'computed') {
  const model = useContext(LikeC4ModelContext)

  if (isString(type) && isNonNullish(model) && model.type !== type) {
    throw new Error(`Invalid LikeC4ModelContext, expected "${type}" but got "${model.type}" in context`)
  }

  if (isDefined(strict) && strict === true && !model) {
    throw new Error('No LikeC4Model found in context')
  }
  return model
}

export function useLikeC4Views(): Record<ViewId, ComputedView | DiagramView> {
  return useLikeC4Model(true).$model.views
}

export function useLikeC4ViewModel(viewId: LiteralUnion<ViewId, string>): LikeC4Model.View {
  return useLikeC4Model(true).view(viewId)
}

export function useLikeC4CurrentViewModel(): LikeC4Model.View {
  const viewId = useCurrentViewId()
  return useLikeC4Model(true).view(viewId)
}

/**
 * Parsed view, computed or layouted
 */
export function useLikeC4View(viewId: LiteralUnion<ViewId, string>): ComputedView | DiagramView | null {
  const model = useLikeC4Model(true)
  try {
    return model.view(viewId).$view
  } catch (error) {
    console.warn(error)
    return null
  }
}

export function useLikeC4DiagramView(viewId: LiteralUnion<ViewId, string>): DiagramView | null {
  const model = useLikeC4Model(true, 'layouted')
  try {
    return model.view(viewId).$view
  } catch (error) {
    console.warn(error)
    return null
  }
}

export function useLikeC4ElementModel(fqn: LiteralUnion<Fqn, string>): LikeC4Model.Element {
  return useLikeC4Model(true).element(fqn)
}
