import { describe, expect, it } from 'vitest'
import { $global, $include, $style, computeViewV2 as computeView } from './fixture'

describe('global-style-expr', () => {
  it('applied', () => {
    const { nodeIds, nodes } = computeView([
      $include('cloud.frontend.dashboard'), // has tag `next`
      $include('cloud.frontend.adminPanel'), // has tag `old`
      $include('cloud'), // has both tags
      $include('amazon'), // has tag `amazon`
      $style('*', {
        color: 'green'
      }),
      $global('style mute_old'),
      $global('style red_next')
    ])
    expect(nodeIds).toEqual([
      'cloud',
      'amazon',
      'cloud.frontend.dashboard',
      'cloud.frontend.adminPanel'
    ])
    const [cloud, amazon, dashboard, adminPanel] = nodes
    expect(cloud).toHaveProperty('color', 'red')
    expect(amazon).toHaveProperty('color', 'green')
    expect(dashboard).toHaveProperty('color', 'red')
    expect(adminPanel).toHaveProperty('color', 'muted')
  })
})
