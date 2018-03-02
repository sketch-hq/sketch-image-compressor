import prettyBytesOriginal from 'pretty-bytes'

import prettyMsOriginal from 'pretty-ms'

export const prettyMs = prettyMsOriginal

export function prettyBytes (size){
  return prettyBytesOriginal(size).toUpperCase().replace(/\sB/g,' bytes')
}

export function ratioForNumbers(one, two){
  return (100 - ((two * 100) / one)).toFixed(2) + '%'
}
