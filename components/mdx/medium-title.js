/** @jsxRuntime classic /
/**@jsx jsx */

import {jsx} from '@emotion/react'
import styled from '@emotion/styled'
import {rhythm} from '../typography'
import slugify from '@sindresorhus/slugify'
import {PermaLink} from './permal-link'

export function MediumTitle({children}) {
  const title = children.props ? children.props.children : children
  const id = slugify(title)
  return (
    <h2
      id={id}
      css={{
        lineHeight: 1.1,
        textAlign: 'left',
        position: 'relative',
      }}
    >
      <PermaLink id={id} />
      {children}
    </h2>
  )
}
