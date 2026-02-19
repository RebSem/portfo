#!/usr/bin/env bash
set -euo pipefail

install -m 0644 ops/apache/rebsem.ru.conf /etc/apache2/sites-available/rebsem.ru.conf

a2enmod proxy proxy_http rewrite headers
a2ensite rebsem.ru.conf
systemctl reload apache2

echo "Apache vhost installed for rebsem.ru."
echo "Run SSL issuance: certbot --apache -d rebsem.ru -d www.rebsem.ru"
