#!/bin/sh

# Indicate default nginx config template (default is dev)
nginxConf=nginx.conf.dev.template

# Informative lines showing the current runtime environment
echo "checking nginx running env...."
echo "$NODE_ENV"

# Depending upon the runtime environment, set the appropriate
# template file for nginx.conf generation
if [ "$NODE_ENV" != "development" ]; then
    if [ "$NODE_ENV" == "production" ]; 
       then
        nginxConf=nginx.conf.template
        echo "Running in production and using nginx.conf.template"
       else
        nginxConf=nginx.conf.test.template
        echo "Running in Test and using nginx.conf.test.template"
    fi

    if [ -z "$APP_SERVER_DOMAIN" ]; then
        echo "Please set value for APP_SERVER_DOMAIN"
        exit 1
    fi  
    if [ -z "$APP_SSL_CERTBOT_EMAIL" ]; then
        echo "Please set value for APP_SSL_CERTBOT_EMAIL"
        exit 1
    fi  
fi  

# Prepare  nginx.conf from the environment template
# Read More: https://linuxhint.com/set-command-bash/#:~:text=The%20set%20command%20of%20Bash,are%20described%20in%20this%20tutorial.
set -eu

# Substitute Domains from environment variables
# Read More: https://linuxhandbook.com/envsubst-command/
envsubst '${APP_SERVER_DOMAIN}' < /etc/nginx/${nginxConf} > /etc/nginx/nginx.conf
exec "$@"

# Except development environment, production and test
# environments are to be deployed with nginx having SSL (https)
if [ "$NODE_ENV" != "development" ]; then

    # Make sure all the possible subdomains are defined here
    appDomains="${APP_SERVER_DOMAIN},api.${APP_SERVER_DOMAIN},admin.${APP_SERVER_DOMAIN},doctors.${APP_SERVER_DOMAIN},inst.${APP_SERVER_DOMAIN},patients.${APP_SERVER_DOMAIN}"

    # Get https (SSL) certificates using certbot plugin
    certbot certonly \
            --noninteractive \
            --domains  $appDomains \
            --standalone \
            --preferred-challenges http \
            --email ${APP_SSL_CERTBOT_EMAIL} \
            --agree-tos \
            --expand

    # Kick off cron job for certificate renewal every 8 days
    /usr/sbin/crond -f -d 8 &
fi  

# Start nginx service
/usr/sbin/nginx -g "daemon off;"
