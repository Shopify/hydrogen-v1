import {useLocation} from 'react-router-dom';

export function useQueryString() {
  const {search} = useLocation();
  // this function is intended to work for server component
  // TODO: rename to getServerSideQueryStringParam
  function getQueryStringParam(key: string) {
    const params = new URLSearchParams(search);
    return params.get(key);
  }
  function setQueryStringParam(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url.href);
  }

  return {
    getQueryStringParam,
    setQueryStringParam,
  };
}
