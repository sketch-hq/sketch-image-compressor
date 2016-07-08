# Sketch Image Compressor

A Plugin for Sketch that compresses your bitmap assets, to keep filesize to a minimum.

Please note that the compression is lossless, so **no pixels will be harmed by running this Plugin** : )

## Installation

- Download [Sketch Image Compressor](https://github.com/BohemianCoding/image-compressor/archive/master.zip) & unzip it.
- Double click **Sketch Image Compressor.sketchplugin** to install the Plugin.

## Usage

The Plugin uses two methods for asset compression:

- **Quick Compression** happens automatically, whenever you export an asset from Sketch using the File › Export… menu option or the Export button in the toolbar. The Plugin will run your PNG & JPG assets through [`optipng`](http://optipng.sourceforge.net) and [`jpegoptim`](https://github.com/tjko/jpegoptim) using the quickest settings for both, so that you get smaller files as fast as possible.
- **Full Compression** happens when you choose the Plugins › Sketch Image Compressor › Export All Assets menu option. You'll be asked for a path where your assets will be exported, and then the Plugin will export *every exportable layer* from your document, and run the assets through [`advpng`](https://github.com/amadvance/advancecomp), [`optipng`](http://optipng.sourceforge.net), [`pngcrush`](https://sourceforge.net/projects/pmt/files/), [`zopflipng`](https://github.com/google/zopfli), [`jpegtran`](http://www.infai.org/jpeg/) and [`jpegoptim`](https://github.com/tjko/jpegoptim), using more aggressive settings than the Quick Compression (i.e: the operation will be **extremely slow**)

Please note that both methods won't block Sketch's UI when running, so you'll be able to keep on working while the compressors run. *However*, running a Full Compression on a non-trivial document will most likely consume a lot of CPU for a long time, so don't expect Sketch to be as snappy as usual : )

You'll get some feedback about the process in the Sketch window while it's running, and some stats when it is done.

## Acknowledgements

- Thank you [ImageOptim](https://imageoptim.com) for the inspiration. If you're looking for more fine-grained control of your compression settings, or a way to do lossy compression, it doesn't get any better than this.
- Thanks to the following projects:
  - [advpng](https://github.com/amadvance/advancecomp)
  - [jpegoptim](https://github.com/tjko/jpegoptim)
  - [jpegtran](http://www.infai.org/jpeg/)
  - [optipng](http://optipng.sourceforge.net)
  - [pngcrush](https://sourceforge.net/projects/pmt/files/)
  - [zopflipng](https://github.com/google/zopfli)
