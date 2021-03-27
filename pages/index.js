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
  const categories = React.useMemo(
    () => [...new Set(blogs.flatMap((item) => item.vocabularies ?? []))],
    [],
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
    const newFilteredBlogPosts = matchSorter(blogs, search, {
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
            {categories.map((ca, index) => {
              return (
                <button
                  key={`category-item-${index}`}
                  css={{
                    background: 'white',
                    border: 'solid 1px #d3d3d3',
                    color: '#5935dc',
                    borderRadius: 3,
                    marginRight: 5,
                    marginTop: 5,
                  }}
                  onClick={() => setSearch(ca)}
                >
                  {ca}
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
