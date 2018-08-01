#!/bin/bash

# Generate HTML files from the input sources
# ./compile.sh [input_dir] [output_dir] [template_file]
#
#     [input_dir] specifies where to pick the input .md files (recursive)
#     [output_dir] specifies where to save the output .html files
#     [template_file] (optional) specifies the path of the template file

RESET=$(echo -en '\033[0m')
RED=$(echo -en '\033[00;31m')
GREEN=$(echo -en '\033[00;32m')
YELLOW=$(echo -en '\033[00;33m')
BLUE=$(echo -en '\033[00;34m')
MAGENTA=$(echo -en '\033[00;35m')
PURPLE=$(echo -en '\033[00;35m')
CYAN=$(echo -en '\033[00;36m')
LRED=$(echo -en '\033[01;31m')
LGREEN=$(echo -en '\033[01;32m')
LYELLOW=$(echo -en '\033[01;33m')

if [ -z "$1" ] || [ -z "$2" ];then
  echo $RED Please specify two arguments: source_dir dest_dir $RESET
  exit 0
fi

source_dir="$1"
dest_dir="$2"
template_path="$3" # Template file name

parse_file(){
  local fpath="$1"
  local relpath="$2"

  local n0=${#relpath}
  local fname=$(basename $fpath)

  local n=${#source_dir}
  local source_subdir=$(echo "$relpath" | cut -c${n}-)

  local dest_fullpath="${dest_dir}${source_subdir}/${fname}"

  mkdir -p "${dest_dir}${source_subdir}"

  if [ "$fname" != "*.md" ]; then
    echo "${CYAN}  $fname ${RESET}"
  fi
}

process_dir(){
  echo Reading files in ${GREEN}$1 ${RESET}
  # for f in "$1"/*.md
  # do
  #   parse_file "$f" "$1"
  # done

  local n=${#source_dir}
  local source_subdir=$(echo "$1" | cut -c${n}-)
  local out_subdir="${dest_dir}${source_subdir}"
  mkdir -p $out_subdir

  node markdown.js $1 $out_subdir $template_path

  # Subdir 
  for d in "$1"/*; do
  if [ -d "$d" ]; then
    process_dir "$d"
  fi
  done
}


process_dir "$source_dir" "$dest_dir"