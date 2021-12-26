#!/bin/bash
echo "Create SSL certificate for Atlantic server ..."
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && (pwd -W 2> /dev/null || pwd))
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $SCRIPT_DIR/ssl.key -out $SCRIPT_DIR/ssl.crt
echo "Finished."