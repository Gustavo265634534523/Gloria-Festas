#!/bin/sh
# Fotos do nome 3D: abertura, festas, como funciona, dúvidas (e celular) numa folha só
# uso: sh n3d.sh [prefixo]
P=${1:-n3d}
cd "/c/Users/tvnn/Desktop/site minha mae/_trabalho/tools"
node sitetest.mjs 1440 900 $P '{"heroPs":[0,0.5],"steps":[{"scroll":"#festas","block":"start","wait":1500,"shot":"festas"},{"scroll":"#como-funciona","block":"start","wait":1500,"shot":"como"},{"scroll":"#duvidas","block":"start","wait":1500,"shot":"duvidas"},{"scroll":"#orcamento","block":"start","wait":1500,"shot":"orc"}]}' 2>&1 | tail -1
node sitetest.mjs 390 844 ${P}m '{"mobile":true,"touch":true,"steps":[{"y":0,"wait":1200,"shot":"topo"},{"scroll":"#festas","block":"start","wait":1500,"shot":"festas"},{"scroll":"#como-funciona","block":"start","wait":1500,"shot":"como"},{"scroll":"#duvidas","block":"start","wait":1500,"shot":"duvidas"}]}' 2>&1 | tail -1
cd ../review/site
ffmpeg -v error -y -i $P-hero-0.jpg -i $P-hero-0_5.jpg -i $P-festas.jpg -i $P-como.jpg -i $P-duvidas.jpg -i $P-orc.jpg -filter_complex "[0]scale=720:-1[a];[1]scale=720:-1[b];[2]scale=720:-1[c];[3]scale=720:-1[d];[4]scale=720:-1[e];[5]scale=720:-1[f];[a][b]hstack[t];[c][d]hstack[u];[e][f]hstack[w];[t][u][w]vstack=inputs=3" $P-grade.jpg
ffmpeg -v error -y -i ${P}m-topo.jpg -i ${P}m-festas.jpg -i ${P}m-como.jpg -i ${P}m-duvidas.jpg -filter_complex "[0]scale=300:-1[a];[1]scale=300:-1[b];[2]scale=300:-1[c];[3]scale=300:-1[d];[a][b][c][d]hstack=inputs=4" ${P}m-grade.jpg
echo pronto
