import UI from 'sketch/ui'
import dialog from '@skpm/dialog'

export function showMessage (txt){
  console.log(txt)
  UI.message('Image Compressor: ' + txt)
}

export function getExportFolder() {
  const result = dialog.showOpenDialog({
    title: 'Export & Compress All Assets In…',
    buttonLabel: 'Save',
    properties: {
      openFile: false,
      openDirectory: true,
      multiSelections: false,
      createDirectory: true
    }
  })
  return result ? result[0] : result
}
