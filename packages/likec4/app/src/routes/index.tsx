import { createFileRoute, Link } from '@tanstack/react-router'

import type { DiagramView } from '@likec4/core'
import { StaticLikeC4Diagram } from '@likec4/diagram'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Box, Card, Container, Flex, Heading, IconButton, Inset, Section, Separator, Text } from '@radix-ui/themes'
import { useDebouncedEffect } from '@react-hookz/web'
import { memo, useState } from 'react'
import { useLikeC4View } from '../data'

import { useStore } from '@nanostores/react'
import { batched } from 'nanostores'
import { ceil, clamp, groupBy, values } from 'remeda'
import { $views } from 'virtual:likec4'
import * as styles from './index.css'
import { cssPreviewCardLink } from './view.css'

const $viewGroups = batched($views, views => {
  const byPath = groupBy(values(views), v => v.relativePath ?? '')
  return Object.entries(byPath)
    .map(([path, views]) => ({
      path,
      isRoot: path === '',
      views: views.map(v => v.id)
    }))
    .sort((a, b) => {
      return a.path.localeCompare(b.path)
    })
})

type ViewGroups = ReturnType<typeof $viewGroups['get']>

function useViewGroups() {
  return useStore($viewGroups)
}

export const Route = createFileRoute('/')({
  component: IndexPage
})

export function IndexPage() {
  const viewGroups = useViewGroups()
  return (
    <Container
      size={'4'}
      px={{
        initial: '3',
        lg: '1'
      }}
    >
      {viewGroups.map(g => <ViewsGroup key={g.path} {...g} />)}
      {viewGroups.length === 0 && (
        <Flex position="fixed" inset="0" align="center" justify="center">
          <Card color="red" size="4">
            <Flex gap="4" direction="row" align="center">
              <Box grow="0" shrink="0" pt="1">
                <IconButton variant="ghost" color="red">
                  <ExclamationTriangleIcon width={20} height={20} />
                </IconButton>
              </Box>
              <Flex gap="3" direction="column">
                <Heading trim="both" color="red" size="4">
                  No diagrams found
                </Heading>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      )}
    </Container>
  )
}

function ViewsGroup({ isRoot, path, views }: ViewGroups[number]) {
  return (
    <Flex asChild gap={'4'} direction={'column'}>
      <Section size="2">
        <Flex gap="2">
          <Heading
            color={isRoot ? undefined : 'gray'}
            // className={cn(isRoot || styles.dimmed)}
            trim="end"
          >
            views
          </Heading>
          {!isRoot && (
            <>
              <Heading
                color="gray"
                //  className={styles.dimmed}
                trim={'end'}>
                /
              </Heading>
              <Heading trim={'end'}>{path}</Heading>
            </>
          )}
        </Flex>
        <Separator orientation="horizontal" my="2" size={'4'} />
        <Flex
          gap={{
            initial: '4',
            md: '6'
          }}
          wrap={{
            initial: 'nowrap',
            md: 'wrap'
          }}
          direction={{
            initial: 'column',
            md: 'row'
          }}
          align="stretch"
        >
          {views.map(v => <ViewCard key={v} viewId={v} />)}
        </Flex>
      </Section>
    </Flex>
  )
}

const ViewCard = memo<{ viewId: string }>(({ viewId }) => {
  const diagram = useLikeC4View(viewId)
  if (!diagram) {
    return null
  }
  const { id, title, description } = diagram
  return (
    <Box asChild shrink="0" grow="1">
      <Card style={{ width: 350, maxWidth: 350 }} variant="surface" size="1">
        <Inset clip="padding-box" side="top" pb="current">
          <DiagramPreview diagram={diagram} />
        </Inset>
        <Text as="div" size="2" weight="bold" trim="start">
          {title || id}
        </Text>
        <Text
          as="div"
          color="gray"
          size="2"
          my="1"
          // className={cn(isEmpty(description?.trim()) && styles.dimmed)}
          style={{
            whiteSpace: 'pre-line'
          }}
        >
          {description?.trim() || 'no description'}
        </Text>
        <Link to="/view/$viewId" params={{ viewId: id }} search className={cssPreviewCardLink}>{' '}</Link>
      </Card>
    </Box>
  )
}, (prev, next) => prev.viewId === next.viewId)

function DiagramPreview(props: { diagram: DiagramView }) {
  const [diagram, setDiagram] = useState<DiagramView | null>(null)

  // defer rendering to avoid flickering
  useDebouncedEffect(
    () => {
      setDiagram(props.diagram)
    },
    [props.diagram],
    clamp(ceil(Math.random() * 400, -1), {
      min: 50
    })
  )

  return (
    <Box className={styles.previewBg} style={{ width: 350, height: 175 }}>
      {diagram && (
        <StaticLikeC4Diagram
          view={diagram}
          keepAspectRatio={false}
          fitView
          fitViewPadding={0.1} />
      )}
    </Box>
  )
}