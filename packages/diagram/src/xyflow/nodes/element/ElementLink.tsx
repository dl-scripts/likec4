import { Anchor, Box, Button, CopyButton, Group, HoverCard, Stack, UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Link } from '../../../icons'
import type { XYFlowNode } from '../../types'
import { elementLink, trigger } from './ElementLink.css'

type ElementLinkProps = {
  element: XYFlowNode['data']['element']
}

export function ElementLink({
  element
}: ElementLinkProps) {
  if (!element.links) {
    return null
  }
  return (
    <motion.div
      className={elementLink}
      whileHover={{
        scale: 1.07
      }}>
      <HoverCard
        position="bottom-start"
        shadow="lg"
        radius="sm"
        transitionProps={{
          transition: 'pop'
        }}
        withinPortal={false}
        floatingStrategy={'fixed'}
        openDelay={350}
        closeDelay={600}
        offset={{
          mainAxis: 5,
          crossAxis: -10
        }}>
        <HoverCard.Target>
          <UnstyledButton className={clsx('nodrag nopan', trigger)}>
            <Link />
            <span>links</span>
          </UnstyledButton>
        </HoverCard.Target>
        <HoverCard.Dropdown p={'xs'}>
          <Stack onClick={e => e.stopPropagation()} gap={'xs'}>
            {element.links.map((link, i) => (
              <Group key={link} wrap="nowrap" gap={'sm'}>
                <Box flex={'1'} style={{ overflow: 'clip', maxWidth: 240 }}>
                  <Anchor href={link} target="_blank" fz="13" truncate="end">
                    {link}
                  </Anchor>
                </Box>
                <CopyButton value={link}>
                  {({ copied, copy }) => (
                    <Button size="compact-xs" fz={'12'} onClick={copy} color={copied ? 'teal' : 'gray'}>
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            ))}
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>
    </motion.div>
  )
}
