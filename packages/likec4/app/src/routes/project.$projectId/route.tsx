import type { ProjectId } from '@likec4/core/types'
import { Button, Container, Stack, Title } from '@mantine/core'
import { createFileRoute, Link, notFound, Outlet } from '@tanstack/react-router'
import { loadModel } from 'likec4:model'
import { ErrorBoundary } from 'react-error-boundary'
import { Fallback } from '../../components/Fallback'
import { LikeC4IconRendererContext } from '../../context/LikeC4IconRendererContext'
import { LikeC4ModelContext } from '../../context/LikeC4ModelContext'
import * as css from '../_single/view.css'

export const Route = createFileRoute('/project/$projectId')({
  staleTime: Infinity,
  beforeLoad: ({ params }) => {
    return {
      projectId: params.projectId as ProjectId,
    }
  },
  loader: async ({ context }) => {
    const projectId = context.projectId
    try {
      const { $likec4data, $likec4model } = await loadModel(projectId)
      return {
        $likec4data,
        $likec4model,
        projectId,
      }
    } catch (err) {
      console.error(err)
      throw notFound()
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <div className={css.cssViewOutlet}>
      <Container py={'xl'}>
        <Stack align="flex-start">
          <Title>Project not found</Title>
          <Button component={Link} to="/" search size="md">Open overview</Button>
        </Stack>
      </Container>
    </div>
  ),
})

function RouteComponent() {
  const { $likec4data, $likec4model, projectId } = Route.useLoaderData()

  return (
    <div className={css.cssViewOutlet}>
      <ErrorBoundary FallbackComponent={Fallback}>
        <LikeC4IconRendererContext projectId={projectId}>
          <LikeC4ModelContext likec4data={$likec4data} likec4model={$likec4model}>
            <Outlet />
          </LikeC4ModelContext>
        </LikeC4IconRendererContext>
      </ErrorBoundary>
    </div>
  )
}
