#!/bin/bash
#
# This script installs latest certbot release and 
# sets up a new certificate with a cronjob for certificate renewal.
#

sudo apt install snapd -y &&
sudo snap install core &&
sudo snap refresh core &&
sudo apt-get remove certbot -y &&
sudo snap install --classic certbot &&
sudo ln -s /snap/bin/certbot /usr/bin/certbot &&
sudo certbot certonly --standalone &&

if $(sudo certbot renew --dry-run); then
    echo "cron-job: successful dry-run."
else
    echo "cron-job: faulty dry-run for cron-job."
fi