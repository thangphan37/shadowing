import * as React from 'react'

const langValues = {
  jp: 'jp',
  en: 'en',
}

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 1000))
}
function useToggle({
  key = 'lang',
  serialize = JSON.parse,
  deserialize = JSON.stringify,
} = {}) {
  const [lang, setLang] = React.useState(() => {
    // if (typeof window === 'undefined') {
    return langValues.jp
    // }
  })

  const [status, setStatus] = React.useState('idle')

  React.useEffect(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    setStatus('pending')
    try {
      if (valueInLocalStorage) {
        delay().then(() => {
          setLang(serialize(valueInLocalStorage))
          setStatus('success')
        })
      }
    } catch (error) {
      window.localStorage.removeItem(key)
    }

    // return langValues.jp
  }, [])

  const toggle = () =>
    setLang(lang === langValues.jp ? langValues.en : langValues.jp)

  React.useEffect(() => {
    window.localStorage.setItem(key, deserialize(lang))
  }, [lang])

  return {lang, status, toggle}
}

export {useToggle}
