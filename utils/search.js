import {matchSorter} from 'match-sorter'

function searchBlog(blogs, searchString, options) {
  const searches = new Set(searchString.split(' '))

  if (searches.size < 2) {
    return matchSorter(blogs, searchString, options)
  }

  const blogList = []
  for (let searchItem of searches) {
    const searchResult = matchSorter(blogs, searchItem, options)

    if (searchResult.length) {
      blogList.push(...searchResult)
    }
  }

  const results = []

  Array.from(new Set(blogList)).forEach((blog) => {
    const apperancesInResults = blogList.filter((b) => b === blog)

    if (apperancesInResults.length === searches.size) {
      results.push(blog)
    }
  })

  return results
}

export {searchBlog}
