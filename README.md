# Image Compressor

A Plugin for Sketch that compresses your exported bitmap assets, to keep filesize to a minimum. This Plugin requires Sketch 3.8.

Please note that the compression is lossless, so **no pixels will be harmed by running this Plugin** : )

## Installation

- Download [Sketch Image Compressor](https://github.com/BohemianCoding/sketch-image-compressor/files/1439529/sketch.image.compressor.sketchplugin.zip) & unzip it.
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

## LICENSE

The MIT License (MIT)

Copyright (c) 2016 Bohemian Coding

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
