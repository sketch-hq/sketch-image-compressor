import child_process from '@skpm/child_process'
import * as fs from '@skpm/fs'
import { prettyMs, prettyBytes, ratioForNumbers } from './formatter'
import { showMessage, getExportFolder } from './UI'

import * as compressors from './compressors'
import getArgumentsForCompressor from './get-arguments-for-compressor'

const EMOJIS = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']

var pluginInterval
var startTime = Date.now()
var environment = {
  originalFileSize: 0,
  completionRatio: 0,
  filesToCompress: [],
  progressAnimation: 0,
}

/**
 * SHOW THE EXPORT PROGRESS EVERY 100ms
 */

function showProgress() {
  const emojiAnimation = EMOJIS[++environment.progressAnimation % 12]
  showMessage(emojiAnimation + ' ' + environment.filesToCompress.length + ' compressor' + (environment.filesToCompress.length > 1 ? 's' : '') + ' running. ' + environment.completionRatio.toFixed(2) + '% done.' )
}

function startShowingProgress(){
  pluginInterval = setInterval(showProgress, 100)
}
function stopShowingProgress(){
  clearInterval(pluginInterval)
}

function runCompressor ({path, type}, options) {
  const compressor = compressors[type]
  const args = getArgumentsForCompressor(compressor.name, path, options)
  console.log(compressor.name + ': ' + path + ' — ' + (prettyBytes(fileSizeForPath(path))))
  return new Promise((resolve, reject) => {
    const task = child_process.spawn(compressor.path, args)

    task.on('error', reject)

    task.on('close', () => {
      var ratioPerCompressor = 100 / environment.filesToCompress.length
      environment.completionRatio += ratioPerCompressor
      resolve()
    })
  })
}

function runFullCompressor ({path, type}) {
  if (type == 'png' || type == 'jpg') {
    const compressor = compressors[type]
    console.log('Full Compression: ' + path + ' — ' + (prettyBytes(fileSizeForPath(path))))
    return new Promise((resolve, reject) => {
      const task = child_process.spawn(compressor.full, [path])

      task.on('error', reject)

      task.on('close', () => {
        var ratioPerCompressor = 100 / environment.filesToCompress.length
        environment.completionRatio += ratioPerCompressor
        resolve()
      })
    })
  } else {
    return Promise.resolve()
  }
}

function fileSizeForPath(path){
  try {
    return fs.statSync(path).size
  } catch (err) {
    return 0
  }
}

function onAllCompressed(err){
  stopShowingProgress()

  if (err) {
    console.log(err)
    showMessage('Error: ' + err.message)
    return
  }

  const runningTime = prettyMs(Date.now() - startTime)
  const originalFileSize = prettyBytes(environment.originalFileSize)
  let compressFileSize = environment.filesToCompress.reduce(
    (prev, f) => prev + fileSizeForPath(f.path)
  , 0)

  const ratio = ratioForNumbers(environment.originalFileSize, compressFileSize)
  compressFileSize = prettyBytes(compressFileSize)
  const msg = `finished in ${runningTime}. ${originalFileSize} → ${compressFileSize} (${ratio} off)`
  showMessage(msg)
}

function getFilesToCompress(exportedAssets){
  const filesToCompress = []
  exportedAssets.forEach(currentExport => {
    const type = String(currentExport.request.format())
    const path = String(currentExport.path)
    // TODO: sometimes, when you try to export *huge* files from Sketch, it will simply refuse
    // to export them. But it will still report those assets as exported in context.actionContext.exports.
    // I've filed the issue in <https://github.com/BohemianCoding/Sketch/issues/9597> and will hopefully
    // be fixed soon, but meanwhile we'll work around it (which is a good idea anyway)
    // TODO: Maybe we should show a warning message explaining why those huge assets weren't exported?
    if (fs.existsSync(path)) {
      // TODO: Maybe we could simply have a generic compression Plugin that also does SVG and PDF?
      if (type === 'png' || type === 'jpg') {
        const size = fileSizeForPath(path)
        filesToCompress.push({ path, size, type })
        environment.originalFileSize += size
      }
    }
  })
  return filesToCompress
}

// called from the menu
export function exportAndCompress (context) {
  const potentialExports = context.document.allExportableLayers()
  if (potentialExports.length > 0) {
    const exportFolder = getExportFolder()
    if (!exportFolder) {
      // the user canceled the picking of the export folder so bail out
      return
    }

    showMessage('Exporting compressed assets. This may take a while…')

    // TODO: If there's any exportable layer selected, only export those. Otherwise, export everything under the sun
    const exportRequests = []
    potentialExports.forEach(exportableLayer => {
      const requests = MSExportRequest.exportRequestsFromExportableLayer(exportableLayer)
      requests.forEach(request => {
        const path = String(exportFolder).replace('file://', '') + request.name() + '.' + request.format()
        exportRequests.push({ request, path })
      })
    })

    // First we'll need to actually export the assets
    exportRequests.forEach(currentExport => {
      let render
      if (currentExport.request.format() == "svg") {
        render = MSExportRendererWithSVGSupport.exporterForRequest_colorSpace(currentExport.request, NSColorSpace.sRGBColorSpace())
      } else {
        render = MSExporter.exporterForRequest_colorSpace(currentExport.request, NSColorSpace.sRGBColorSpace())
      }
      render.data().writeToFile_atomically(currentExport.path, true)
    })

    // …and then we'll be able to compress them :)
    environment.filesToCompress = getFilesToCompress(exportRequests)

    if (environment.filesToCompress.length) {
      startShowingProgress()
      Promise.all(environment.filesToCompress.map(runFullCompressor))
        .then(() => onAllCompressed())
        .catch(onAllCompressed)
    }
  } else {
    showMessage('There are no exportable layers in the document.')
  }
}

// called from an action
export function compressAutomatically (context) {

  environment.filesToCompress = getFilesToCompress(context.actionContext.exports)

  if (environment.filesToCompress.length > 0) {
    startShowingProgress()
    Promise.all(environment.filesToCompress.map(currentFile => {
      return runCompressor(currentFile, currentFile.type == 'png' ? 'fast' : undefined)
    }))
      .then(() => onAllCompressed())
      .catch(onAllCompressed)
  } else {
    // showMessage('nothing to compress')
  }
}
