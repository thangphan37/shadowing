/** @jsxRuntime classic /
/**@jsx jsx */
import * as React from 'react'
import {jsx} from '@emotion/react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'
import {getSortedBlogsData} from '../lib/blog'
import {BlogPostCard} from '../components/blog-post-card'
import {matchSorter} from 'match-sorter'
import {useRouter} from 'next/router'

export default function Home({blogs}) {
  const router = useRouter()
  const vocabularies = React.useMemo(
    () => [...new Set(blogs.flatMap((item) => item.vocabularies ?? []))],
    [blogs],
  )

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

  const [filteredBlogPosts, setFilteredBlogPosts] = React.useState(() =>
    search ? [] : blogs,
  )

  function handleToggleSearch(text) {
    let newSearch = search

    if (newSearch.indexOf(text) !== -1) {
      newSearch = newSearch.split(text).join('').trim()
    } else {
      newSearch += ` ${text}`
    }

    setSearch(newSearch.trim())
  }

  function handleSearch(event) {
    setSearch(event.target.value)
  }

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

    const blogList = []

    search.split(' ').forEach((searchItem) => {
      const list = matchSorter(blogs, searchItem, {
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
      })
      blogList.push(list)
    })

    const newFilteredBlogPosts = [
      ...new Set(blogList.flatMap((li) => li)),
    ].filter((post) => {
      return blogList.reduce((acc, list) => {
        const commonPost = list.find((listItem) => listItem === post)
        return acc && commonPost
      }, true)
    })

    setFilteredBlogPosts(newFilteredBlogPosts)
  }, [search])

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

      <main className={styles.main}>
        <div css={{maxWidth: '27.77rem', marginBottom: '1.5rem'}}>
          <form
            css={{
              marginBottom: 0,
            }}
          >
            <input
              placeholder="Search Shadowing"
              value={search}
              onChange={handleSearch}
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
            {vocabularies.map((vocabulary, index) => {
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
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 320px)',
            gap: '3rem',
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
