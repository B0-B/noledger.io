#!/bin/bash
clear                              
printf '\033[0;36m
                      __           __                   
        .-----.-----.|  |.-----.--|  |.-----.-----.----.
        |     |  _  ||  ||  -__|  _  ||  _  |  -__|   _|
        |__|__|_____||__||_____|_____||___  |_____|__|  
                                      |_____| \033[0m\n'
sudo apt update -y &&
sudo apt install nodejs -y &&
sudo apt install npm -y && 
sudo apt install git -y &&
npm i &&