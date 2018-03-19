export default function getArgumentsForCompressor (compressorName, fileName, options){
  var args
  switch (compressorName) {
  case 'advpng':
    /*
    advancecomp v1.21 by Andrea Mazzoleni, http://www.advancemame.it
    Usage: advpng [options] [FILES...]

    Modes:
      -l, --list            List the content of the files
      -z, --recompress      Recompress the specified files
    Options:
      -0, --shrink-store    Don't compress
      -1, --shrink-fast     Compress fast (zlib)
      -2, --shrink-normal   Compress normal (7z)
      -3, --shrink-extra    Compress extra (7z)
      -4, --shrink-insane   Compress extreme (zopfli)
      -i N, --iter=N        Compress iterations
      -f, --force           Force the new file also if it's bigger
      -q, --quiet           Don't print on the console
      -h, --help            Help of the program
      -V, --version         Version of the program
    */
    // Our defaults: advpng -z3 fileName
    if (options == 'fast') {
      args = ['-z2', fileName]
    } else {
      args = ['-z3', fileName]
    }
    break;
  case 'jpegoptim':
    /*
    jpegoptim v1.4.4beta  Copyright (c) 1996-2015, Timo Kokkonen
    Usage: jpegoptim [options] <filenames>

      -d<path>, --dest=<path>
                        specify alternative destination directory for
                        optimized files (default is to overwrite originals)
      -f, --force       force optimization
      -h, --help        display this help and exit
      -m<quality>, --max=<quality>
                        set maximum image quality factor (disables lossless
                        optimization mode, which is by default on)
                        Valid quality values: 0 - 100
      -n, --noaction    don't really optimize files, just print results
      -S<size>, --size=<size>
                        Try to optimize file to given size (disables lossless
                        optimization mode). Target size is specified either in
                        kilo bytes (1 - n) or as percentage (1% - 99%)
      -T<threshold>, --threshold=<threshold>
                        keep old file if the gain is below a threshold (%)
      -b, --csv         print progress info in CSV format
      -o, --overwrite   overwrite target file even if it exists (meaningful
                        only when used with -d, --dest option)
      -p, --preserve    preserve file timestamps
      -P, --preserve-perms
                        preserve original file permissions by overwriting it
      -q, --quiet       quiet mode
      -t, --totals      print totals after processing all files
      -v, --verbose     enable verbose mode (positively chatty)
      -V, --version     print program version

      -s, --strip-all   strip all markers from output file
      --strip-none      do not strip any markers
      --strip-com       strip Comment markers from output file
      --strip-exif      strip Exif markers from output file
      --strip-iptc      strip IPTC/Photoshop (APP13) markers from output file
      --strip-icc       strip ICC profile markers from output file
      --strip-xmp       strip XMP markers markers from output file

      --all-normal      force all output files to be non-progressive
      --all-progressive force all output files to be progressive
      --stdout          send output to standard output (instead of a file)
      --stdin           read input from standard input (instead of a file)
    */
    // Our options: jpegoptim --strip-com --strip-exif --strip-iptc --strip-xmp --all-normal fileName
    args = ['--strip-com', '--strip-exif', '--strip-iptc', '--strip-xmp', '--all-normal', fileName]
    break;
  case 'jpegtran':
    /*
    usage: jpegtran [switches] [inputfile]
    Switches (names may be abbreviated):
      -copy none     Copy no extra markers from source file
      -copy comments Copy only comment markers (default)
      -copy all      Copy all extra markers
      -optimize      Optimize Huffman table (smaller file, but slow compression)
      -progressive   Create progressive JPEG file
    Switches for modifying the image:
      -crop WxH+X+Y  Crop to a rectangular subarea
      -flip [horizontal|vertical]  Mirror image (left-right or top-bottom)
      -grayscale     Reduce to grayscale (omit color data)
      -perfect       Fail if there is non-transformable edge blocks
      -rotate [90|180|270]         Rotate image (degrees clockwise)
      -scale M/N     Scale output image by fraction M/N, eg, 1/8
      -transpose     Transpose image
      -transverse    Transverse transpose image
      -trim          Drop non-transformable edge blocks
      -wipe WxH+X+Y  Wipe (gray out) a rectangular subarea
    Switches for advanced users:
      -arithmetic    Use arithmetic coding
      -restart N     Set restart interval in rows, or in blocks with B
      -maxmemory N   Maximum memory to use (in kbytes)
      -outfile name  Specify name for output file
      -verbose  or  -debug   Emit debug output
    Switches for wizards:
      -scans file    Create multi-scan JPEG per script file
    */
    // Our settings: jpegtran -copy none -optimize fileName
    args = ['-copy none', '-optimize', fileName]
    break;
  case 'optipng':
    /*
    Synopsis:
        optipng [options] files ...
    Files:
        Image files of type: PNG, BMP, GIF, PNM or TIFF
    Basic options:
        -?, -h, -help	show the extended help
        -o <level>		optimization level (0-7)		[default: 2]
        -v			run in verbose mode / show copyright and version info
    Examples:
        optipng file.png						(default speed)
        optipng -o5 file.png					(slow)
        optipng -o7 file.png					(very slow)
    Type "optipng -h" for extended help.
    */
    // Our settings (fast): optipng -o1 fileName
    // Our settings (best): optipng -o5 fileName
    args = options == 'fast' ? ['-o1', fileName] : ['-o5', fileName]
    break;
  case 'pngcrush':
    /*
    usage: pngcrush [options except for -e -d] infile.png outfile.png
           pngcrush -e ext [other options] file.png ...
           pngcrush -d dir/ [other options] file.png ...
           pngcrush -ow [other options] file.png [tempfile.png]
           pngcrush -n -v file.png ...
    options:
             -bail (bail out of trial when size exceeds best size found
          -blacken (zero samples underlying fully-transparent pixels)
            -brute (use brute-force: try 148 different methods)
                -c color_type of output file [0, 2, 4, or 6]
                -d directory_name/ (where output files will go)
                -e extension  (used for creating output filename)
                -f user_filter [0-5] for specified method
              -fix (salvage PNG with otherwise fatal conditions)
            -force (write output even if IDAT is larger)
                -g gamma (float or fixed*100000, e.g., 0.45455 or 45455)
          -huffman (use only zlib strategy 2, Huffman-only)
             -iccp length "Profile Name" iccp_file
             -itxt b[efore_IDAT]|a[fter_IDAT] "keyword"
             -keep chunk_name
                -l zlib_compression_level [0-9] for specified method
             -loco ("loco crush" truecolor PNGs)
                -m method [1 through 150]
              -max maximum_IDAT_size [default 524288L]
              -mng (write a new MNG, do not crush embedded PNGs)
                -n (no save; doesn't do compression or write output PNG)
              -new (Use new default settings (-reduce))
     -newtimestamp (Reset file modification time [default])
           -nobail (do not bail out early from trial -- see "-bail")
      -nofilecheck (do not check for infile.png == outfile.png)
          -noforce (default; do not write output when IDAT is larger)
         -nolimits (turns off limits on width, height, cache, malloc)
         -noreduce (turns off all "-reduce" operations)
    -noreduce_palette (turns off "-reduce_palette" operation)
              -old (Use old default settings (no -reduce))
     -oldtimestamp (Do not reset file modification time)
               -ow (Overwrite)
                -q (quiet) suppresses console output except for warnings
           -reduce (do lossless color-type or bit-depth reduction)
              -rem chunkname (or "alla" or "allb")
    -replace_gamma gamma (float or fixed*100000) even if it is present.
              -res resolution in dpi
              -rle (use only zlib strategy 3, RLE-only)
                -s (silent) suppresses console output including warnings
             -save (keep all copy-unsafe PNG chunks)
            -speed Avoid the AVG and PAETH filters, for decoding speed
             -srgb [0, 1, 2, or 3]
             -ster [0 or 1]
             -text b[efore_IDAT]|a[fter_IDAT] "keyword" "text"
       -trns_array n trns[0] trns[1] .. trns[n-1]
             -trns index red green blue gray
                -v (display more detailed information)
          -version (display the pngcrush version)
                -w compression_window_size [32, 16, 8, 4, 2, 1, 512]
                -z zlib_strategy [0, 1, 2, or 3] for specified method
             -zmem zlib_compression_mem_level [1-9, default 9]
            -zitxt b|a "keyword" "lcode" "tkey" "text"
             -ztxt b[efore_IDAT]|a[fter_IDAT] "keyword" "text"
                -h (help and legal notices)
                -p (pause)
    */
    // Our settings (quick): pngcrush -ow -speed -noforce -blacken -bail -rem alla fileName
    // Our settings (small): pngcrush -ow -reduce -noforce -blacken -bail -rem alla fileName
    // ImageOptim also uses a '-cc' option, but it seems to be nonexistant on this version of pngcrush
    // They also have an optional '-brute' option, but we'll leave that out by now…
    // Also, there's this warning on their code: "// pngcrush sometimes writes only PNG header (70 bytes)!"
    if (options == 'fast') {
      args = ['-ow', '-new', fileName]
    } else {
      args = ['-ow', '-reduce', '-noforce', '-blacken', '-bail', '-rem alla', '-new', fileName]
    }
    break;
  case 'zopflipng':
    /*
    ZopfliPNG, a Portable Network Graphics (PNG) image optimizer.

    Usage: zopflipng [options]... infile.png outfile.png
           zopflipng [options]... --prefix=[fileprefix] [files.png]...

    If the output file exists, it is considered a result from a previous run and not overwritten if its filesize is smaller.

    Options:
    -m: compress more: use more iterations (depending on file size)
    --prefix=[fileprefix]: Adds a prefix to output filenames. May also contain a directory path. When using a prefix, multiple input files can be given and the output filenames are generated with the prefix
     If --prefix is specified without value, 'zopfli_' is used.
     If input file names contain the prefix, they are not processed but considered as output from previous runs. This is handy when using *.png wildcard expansion with multiple runs.
    -y: do not ask about overwriting files.
    --lossy_transparent: remove colors behind alpha channel 0. No visual difference, removes hidden information.
    --lossy_8bit: convert 16-bit per channel image to 8-bit per channel.
    -d: dry run: don't save any files, just see the console output (e.g. for benchmarking)
    --always_zopflify: always output the image encoded by Zopfli, even if it's bigger than the original, for benchmarking the algorithm. Not good for real optimization.
    -q: use quick, but not very good, compression (e.g. for only trying the PNG filter and color types)
    --iterations=[number]: number of iterations, more iterations makes it slower but provides slightly better compression. Default: 15 for small files, 5 for large files.
    --splitting=[0-3]: ignored, left for backwards compatibility
    --filters=[types]: filter strategies to try:
     0-4: give all scanlines PNG filter type 0-4
     m: minimum sum
     e: entropy
     p: predefined (keep from input, this likely overlaps another strategy)
     b: brute force (experimental)
     By default, if this argument is not given, one that is most likely the best for this image is chosen by trying faster compression with each type.
     If this argument is used, all given filter types are tried with slow compression and the best result retained. A good set of filters to try is --filters=0me.
    --keepchunks=nAME,nAME,...: keep metadata chunks with these names that would normally be removed, e.g. tEXt,zTXt,iTXt,gAMA, ...
     Due to adding extra data, this increases the result size. Keeping bKGD or sBIT chunks may cause additional worse compression due to forcing a certain color type, it is advised to not keep these for web images because web browsers do not use these chunks. By default ZopfliPNG only keeps (and losslessly modifies) the following chunks because they are essential: IHDR, PLTE, tRNS, IDAT and IEND.

    Usage examples:
    Optimize a file and overwrite if smaller: zopflipng infile.png outfile.png
    Compress more: zopflipng -m infile.png outfile.png
    Optimize multiple files: zopflipng --prefix a.png b.png c.png
    Compress really good and trying all filter strategies: zopflipng --iterations=500 --filters=01234mepb --lossy_8bit --lossy_transparent infile.png outfile.png
    */
    // Our options (quick): zopflipng -q -y
    // Our options (small): zopflipng -m -y --lossy_transparent
    if (options == 'fast') {
      args = ['-q', '-y', '--keepchunks=iCCP,sRGB,gAMA,cHRM', fileName, fileName]
    } else {
      args = ['-m', '-y', '--keepchunks=iCCP,sRGB,gAMA,cHRM', fileName, fileName]
    }
    break;
  default:

  }
  return args
}
