#!/bin/sh

echo "Generation envariments..."
export STORM_GLASS_TOKEN=$(cat /run/secrets/storm-glass-api-key)

echo "Starting app"
exec "$@"
