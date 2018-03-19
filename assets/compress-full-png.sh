#!/usr/bin/env bash
basedir=${0%/*}

# $1 is the file to be compressed
"$basedir"/advpng -z3 "$1" && "$basedir"/optipng -o5 "$1" && "$basedir"/pngcrush -ow -reduce -blacken -bail -rem alla -new "$1" && "$basedir"/pngout -f3 -b128 "$1" && "$basedir"/zopflipng -m -y "$1" "$1"