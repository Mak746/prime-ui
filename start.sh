#!/bin/bash

printf "\n***************************************"
printf "\nWelcome to WeCare.et Deployment!\n"
printf "***************************************\n\n"
PS3='Please enter your choice for Deployment Environment: '
options=("Production-Build" "Production-Start" "Test-Up" "Test-Down" "Development" "Stop Development" "Remove Development" "Exit")
select opt in "${options[@]}"
do
    case $opt in
        "Production-Build")
            echo -e "\nStarting Production Build...\n"
            docker compose  -p wecare --env-file ./.env -f ./docker-compose.yml  build
            break
            ;;
        "Production-Start")
            echo -e "\nStarting Production Deployment...\n"
            docker compose --env-file ./.env -p wecare -f ./docker-compose.yml up --build --scale api=32  -d && docker stop adminer
            break
            ;;
        "Test-Up")
            echo -e "\nStarting Deployment Test at https://wecare.et...\n"
            docker compose --env-file ./backend/env/test.env -p wecare -f ./docker-compose.test.yml up --build --scale wecare-api=4 -d 
            break
            ;;
        "Test-Down")
            echo -e "\nStarting Deployment Test at https://wecare.et...\n"
            docker compose --env-file ./backend/env/test.env -p wecare -f ./docker-compose.test.yml down 
            break
            ;;
        "Development")
            echo -e "\nStarting localhost Deployment...\n"
            docker compose --env-file ./backend/env/development.env -f ./docker-compose.dev.yml up --build -d
            break
            ;;
        "Stop Development")
            echo -e "\nStopping localhost Deployment...\n"
            
            docker compose  --env-file ./backend/env/development.env -f ./docker-compose.dev.yml stop
            break
            ;;
        "Remove Development")
            echo -e "\nRemoving localhost Deployment...\n"
            docker compose --env-file ./backend/env/development.env -f ./docker-compose.dev.yml down
            break
            ;;
        "Exit")
            break
            ;;
        *) echo "Invalid Environment $REPLY Selected, Please Try again";;
    esac
done

