export const png = {
  type: 'png',
  name: 'optipng',
  path: String(context.plugin.urlForResourceNamed("optipng").path()),
  full: String(context.plugin.urlForResourceNamed("compress-full-png.sh").path())
}

export const jpg = {
  type: 'jpg',
  name: 'jpegoptim',
  path: String(context.plugin.urlForResourceNamed("jpegoptim").path()),
  full: String(context.plugin.urlForResourceNamed("compress-full-jpg.sh").path())
}
