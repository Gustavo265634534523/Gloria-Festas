#!/bin/bash
# sheet.sh saida.jpg f1 f2 f3 f4 f5 f6 : folha 3x2
cd "/c/Users/tvnn/Desktop/site minha mae/_trabalho/review"
out=$1; shift
args=(); for f in "$@"; do args+=(-i "$f"); done
ffmpeg -v error -y "${args[@]}" -filter_complex "[0][1][2][3][4][5]xstack=inputs=6:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0,scale=1440:-1" -q:v 3 "$out"
