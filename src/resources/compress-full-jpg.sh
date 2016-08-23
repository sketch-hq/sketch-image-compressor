#!/usr/bin/env bash
basedir=${0%/*}
# $1 is the file to be compressed
"$basedir"/jpegoptim --strip-all --all-normal "$1" && "$basedir"/jpegtran -copy none -optimize "$1"