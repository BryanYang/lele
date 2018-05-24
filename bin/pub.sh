#!/bin/sh

pwd
sftp uploadweb@119.28.223.71 <<EOF   
put -r ./build/* ./
bye  
EOF

