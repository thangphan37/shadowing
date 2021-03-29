/** @jsxRuntime classic /
/**@jsx jsx */
import * as React from 'react'
import {jsx} from '@emotion/react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'
import {getSortedBlogsData} from '../lib/blog'
import {BlogPostCard} from '../components/blog-post-card'
import {useRouter} from 'next/router'
import {matchSorter} from 'match-sorter'
import {searchBlog} from '../utils/search'
import * as mq from '../styles/media-queries'

export default function Home({blogs}) {
  const router = useRouter()
  const inputRef = React.useRef()

  const vocabulariesResult = React.useMemo(
    () => [...new Set(blogs.flatMap((item) => item.vocabularies ?? []))],
    [blogs],
  )
  const [vocabularies, setVocabularies] = React.useState([])

  const [search, setSearch] = React.useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    const {searchParams} = new URL(window.location)

    if (searchParams.has('q')) {
      return searchParams.get('q')
    } else {
      return ''
    }
  })

  const [filteredBlogPosts, setFilteredBlogPosts] = React.useState(blogs)

  function handleToggleSearch(vocabulary) {
    setSearch((s) => {
      if (s.indexOf(vocabulary) !== -1) {
        return s.split(vocabulary).join('').trim()
      } else {
        return `${s} ${vocabulary}`.trim()
      }
    })
  }

  function handleSearch(event) {
    setSearch(event.target.value)
  }

  React.useEffect(() => {
    inputRef.current.focus()
  }, [])

  React.useEffect(() => {
    setVocabularies(vocabulariesResult)
  }, [])

  React.useEffect(() => {
    const newUrl = new URL(window.location)
    newUrl.searchParams.set('q', search)

    if (search) {
      router.replace({}, newUrl, {shallow: true})
    } else {
      newUrl.searchParams.delete('q')
      router.replace({}, newUrl, {shallow: true})
    }
  }, [search])

  React.useEffect(() => {
    if (!search) {
      setFilteredBlogPosts(blogs)
      return
    }

    const options = {
      keys: [
        {
          key: 'title',
          threshold: matchSorter.rankings.CONTAINS,
          maxRanking: matchSorter.rankings.CONTAINS,
        },
        {
          key: 'vocabularies',
          threshold: matchSorter.rankings.CONTAINS,
          maxRanking: matchSorter.rankings.CONTAINS,
        },
      ],
    }

    const newFilteredBlogPosts = searchBlog(blogs, search, options)

    setFilteredBlogPosts(newFilteredBlogPosts)
  }, [search, blogs])

  return (
    <Layout
      css={{
        background: '#fafafa',
      }}
    >
      <Head>
        <title>Blog | Phan Cong Thang</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        css={{
          padding: '40px',
          [mq.small]: {
            padding: '20px',
          },
        }}
      >
        <div css={{maxWidth: '500px', margin: 'auto'}}>
          <form
            css={{
              marginBottom: 0,
            }}
          >
            <input
              placeholder="Search Shadowing"
              aria-label="Search Shadowing"
              type="search"
              value={search}
              onChange={handleSearch}
              ref={inputRef}
              css={{
                width: '100%',
                border: 'solid 1px #d3d3d3',
                borderRadius: 6,
                padding: '5px 10px',
              }}
            />
          </form>
          <div
            css={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: '0.25rem',
              fontSize: '0.75em',
            }}
          >
            {vocabularies.map((vocabulary) => {
              const isSelected = search.includes(vocabulary)
              const selectedStyles = {
                background: '#4124d4',
                color: 'white',
              }
              const unselectedStyles = {
                background: 'white',
                color: '#4124d4',
              }

              return (
                <button
                  key={`${vocabulary}`}
                  css={[
                    {
                      border: 'solid 1px #d3d3d3',
                      borderRadius: 3,
                      marginRight: 5,
                      marginTop: 5,
                    },
                    () => (isSelected ? selectedStyles : unselectedStyles),
                  ]}
                  onClick={() => handleToggleSearch(vocabulary)}
                >
                  {vocabulary}
                </button>
              )
            })}
          </div>
        </div>
        <div
          css={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            margin: '0 auto',
            maxWidth: '90vw',
            width: '100%',
          }}
        >
          {filteredBlogPosts.map((blog) => (
            <BlogPostCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </main>
    </Layout>
  )
}

export function getStaticProps() {
  const blogs = getSortedBlogsData()
  return {
    props: {
      blogs,
    },
  }
}
