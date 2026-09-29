#!/bin/bash
set -e

echo "Waiting for request to Primary to be ready..."
sleep 20

echo "Configuring Replication..."

mysql -h mysql-primary -u root -prootpassword -e "SHOW MASTER STATUS" > /tmp/master_status.txt
CURRENT_LOG=$(awk 'NR==2 {print $1}' /tmp/master_status.txt)
CURRENT_POS=$(awk 'NR==2 {print $2}' /tmp/master_status.txt)

echo "Master Log: $CURRENT_LOG"
echo "Master Pos: $CURRENT_POS"

mysql -u root -prootpassword -e "CHANGE MASTER TO MASTER_HOST='mysql-primary', MASTER_USER='replicator', MASTER_PASSWORD='replica_password', MASTER_LOG_FILE='$CURRENT_LOG', MASTER_LOG_POS=$CURRENT_POS;"
mysql -u root -prootpassword -e "START SLAVE;"

echo "Replication started."
