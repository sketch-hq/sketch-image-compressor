import prettyBytesOriginal from 'pretty-bytes'
import prettyMs from 'pretty-ms'

import getArgumentsForCompressor from './get-arguments-for-compressor'

var pluginInterval
var progress = 0
var environment = {
  compressors: [],
  totalCompressors: 0,
  originalFileSize: 0,
  completionRatio: 0,
  filesToCompress: [],
  progressAnimation: 0,
  emojis: ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']
}

var prettyBytes = function(size){
  var r = prettyBytesOriginal(size).toUpperCase().replace(/\sB/g,' bytes')
  return r
}
var showMessage = function(txt){
  NSApplication.sharedApplication().orderedDocuments().firstObject().showMessage('Image Compressor: ' + txt)
}

var runCompressor = function(context, compressorName, fileName, options){
  // console.log('Running compressor: ' + compressorName + ' for image ' + fileName)
  var compressorPath = context.plugin.urlForResourceNamed(compressorName).path()
  var compressTask = NSTask.alloc().init()
  compressTask.setLaunchPath(compressorPath)
  var args = getArgumentsForCompressor(compressorName, fileName, options)
  compressTask.setArguments(args)
  compressTask.launch()
  environment.compressors.push(compressTask)
  environment.totalCompressors += 1
  // compressTask.waitUntilExit() // This blocks the UI, which sucks for non-trivial jobs
  console.log(compressorName + ': ' + fileName + ' — ' + (prettyBytes(fileSizeForPath(fileName))))
}
var runFullCompressor = function(context, fileObject){
  if (fileObject.type == 'png' || fileObject.type == 'jpg') {
    var compressorPath
    if (fileObject.type == 'png') {
      compressorPath = context.plugin.urlForResourceNamed('compress-full-png.sh').path()
    } else {
      compressorPath = context.plugin.urlForResourceNamed('compress-full-jpg.sh').path()
    }
    var compressTask = NSTask.alloc().init()
    compressTask.setLaunchPath(compressorPath)
    compressTask.setArguments(NSArray.arrayWithArray([fileObject.path]))
    compressTask.launch()
    // compressTask.waitUntilExit()
    environment.compressors.push(compressTask)
    environment.totalCompressors += 1
    console.log('Full Compression: ' + fileObject.path + ' — ' + (prettyBytes(fileSizeForPath(fileObject.path))))
  }
}
var fileSizeForPath = function(path){
  var fileSize = 0
  if (path) {
    fileSize = NSFileManager.defaultManager().attributesOfItemAtPath_error(path, nil).fileSize()
  }
  return fileSize
}
var ratioForNumbers = function(one, two){
  return (100 - ((two * 100) / one)).toFixed(2) + '%'
}
var onInterval = function(context){
  var runningTime = prettyMs(progress * 100)
  var ratioPerCompressor = 100 / environment.totalCompressors

  for( var i=0; i < environment.compressors.length; i++ ) {
    var task = environment.compressors[i]
    // console.log(task.terminationStatus())
    if(!task.isRunning()) { // In theory this was deprecated in 10.9?
      environment.compressors.splice(i,1) // Remove compressor from array when we're done with it
      environment.completionRatio += ratioPerCompressor
    }
  }
  // If all compressors are done running, disable shouldKeepAround:
  if (environment.compressors.length == 0) {
    var originalFileSize = prettyBytes(environment.originalFileSize)
    var compressFileSize = 0
    for (var i=0; i < environment.filesToCompress.length; i++) {
      var f = environment.filesToCompress[i]
      compressFileSize += fileSizeForPath(f.path)
    }
    var ratio = ratioForNumbers(environment.originalFileSize, compressFileSize)
    compressFileSize = prettyBytes(compressFileSize)
    var msg = `finished in ${runningTime}. ${originalFileSize} → ${compressFileSize} (${ratio} off)`
    showMessage(msg)
    console.log(msg)
    disableBackgroundPlugin()
  } else {
    var emojiAnimation = environment.emojis[++environment.progressAnimation % 12]
    showMessage(emojiAnimation + ' ' + environment.compressors.length + ' compressor' + (environment.compressors.length > 1 ? 's' : '') + ' running. ' + environment.completionRatio.toFixed(2) + '% done.' )
    progress++
  }
}
var getFilesToCompress = function(exportedAssets){
  var filesToCompress = []
  for (var i=0; i < exportedAssets.length; i++) {
    var currentExport = exportedAssets[i]
    // TODO: sometimes, when you try to export *huge* files from Sketch, it will simply refuse
    // to export them. But it will still report those assets as exported in context.actionContext.exports.
    // I've filed the issue in <https://github.com/BohemianCoding/Sketch/issues/9597> and will hopefully
    // be fixed soon, but meanwhile we'll work around it (which is a good idea anyway)
    // TODO: Maybe we should show a warning message explaining why those huge assets weren't exported?
    if (NSFileManager.defaultManager().fileExistsAtPath(currentExport.path)) {
      var fileSize = fileSizeForPath(currentExport.path)
      // TODO: Maybe we could simply have a generic compression Plugin that also does SVG and PDF?
      if (currentExport.request.format() == 'png' || currentExport.request.format() == 'jpg') {
        filesToCompress.push({ path: currentExport.path, size: fileSize, type: currentExport.request.format() })
        environment.originalFileSize += fileSize
      }
    }
  }
  return filesToCompress
}
var openFileDialog = function(path){
  var openDlg = NSOpenPanel.openPanel()
  // var openDlg = NSSavePanel.savePanel()
  openDlg.setTitle('Export & Compress All Assets In…')
  openDlg.setCanChooseFiles(false)
  openDlg.setCanChooseDirectories(true)
  openDlg.allowsMultipleSelection = false
  openDlg.setCanCreateDirectories(true)
  openDlg.setPrompt('Save')
  if (path) {
    openDlg.setDirectoryURL(path)
  }
  var buttonClicked = openDlg.runModal()
  var ret = null
  if (buttonClicked == NSOKButton) {
    ret = openDlg.URLs().firstObject().path()
  }
  return ret
}
var enableBackgroundPlugin = function(){
  pluginInterval = setInterval(onInterval, 100)
}
var disableBackgroundPlugin = function(){
  clearInterval(pluginInterval)
}

// called from the menu
export function exportAndCompress (context) {
  var potentialExports = context.document.allExportableLayers()
  if (potentialExports.count() > 0) {
    showMessage('Exporting compressed assets. This may take a while…')
    var exportFolder = openFileDialog()
    if (exportFolder) {
      enableBackgroundPlugin()
      // TODO: If there's any exportable layer selected, only export those. Otherwise, export everything under the sun
      var exportRequests = []
      for (var exportCount=0; exportCount < potentialExports.count(); exportCount++) {
        var exportableLayer = potentialExports.objectAtIndex(exportCount)
        var requests = MSExportRequest.exportRequestsFromExportableLayer(exportableLayer)
        if (requests.count() > 0) {
          for (var j=0; j < requests.count(); j++) {
            var request = requests.objectAtIndex(j)
            var path = NSString.pathWithComponents([exportFolder, request.name() + '.' + request.format()])
            exportRequests.push({ request: request, path: path })
          }
        }
      }

      // First we'll need to actually export the assets
      for (var k=0; k < exportRequests.length; k++) {
        var currentExport = exportRequests[k]
        var render
        if (currentExport.request.format() == "svg") {
          render = MSExportRendererWithSVGSupport.exporterForRequest_colorSpace(currentExport.request, NSColorSpace.sRGBColorSpace())
        } else {
          render = MSExporter.exporterForRequest_colorSpace(currentExport.request, NSColorSpace.sRGBColorSpace())
        }
        render.data().writeToFile_atomically(currentExport.path, true)
      }
      // …and then we'll be able to compress them :)
      environment.filesToCompress = getFilesToCompress(exportRequests)
      if (environment.filesToCompress.length > 0) {
        for (var p = 0; p < environment.filesToCompress.length; p++) {
          var currentFile = environment.filesToCompress[p];
          runFullCompressor(context, currentFile)
        }
      } else {
        // showMessage('nothing to compress')
        disableBackgroundPlugin()
      }
    }
  } else {
    showMessage('There are no exportable layers in the document.')
  }
}

// called from an action
export function compressAutomatically (context) {

  environment.filesToCompress = getFilesToCompress(context.actionContext.exports)

  if (environment.filesToCompress.length > 0) {
    enableBackgroundPlugin()
    for (var p = 0; p < environment.filesToCompress.length; p++) {
      var currentFile = environment.filesToCompress[p];
      // PNG Compressors.
      if (currentFile.type == 'png') {
        runCompressor(context, 'optipng', currentFile.path, 'fast')
      }
      if (currentFile.type == 'jpg') {
        runCompressor(context, 'jpegoptim', currentFile.path)
      }
    }
  } else {
    // showMessage('nothing to compress')
  }
}
