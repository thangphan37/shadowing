import {Global, css} from '@emotion/react'

const globalStyles = css`
  a {
    color: #573ede;
  }
  a:hover {
    color: #573ede;
    text-decoration: none;
  }
  h2 .anchor svg,
  h3 .anchor svg {
    position: absolute;
    opacity: 0;
    left: -26px;
    width: 20px;
    transition: all 0.2s;
  }
  h2:hover .anchor svg,
  h3:hover .anchor svg {
    opacity: 1;
  }
  pre {
    font-size: 16px;
    border-radius: 4px;
    padding: 10px;
  }
`

export default function Layout({children, ...otherProps}) {
  return (
    <div {...otherProps}>
      <Global styles={globalStyles} />
      {children}
    </div>
  )
}
