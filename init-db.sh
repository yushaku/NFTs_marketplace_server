#! /bin/sh

psql -v --username "${POSTGRES_USER}" -c "CREATE DATABASE ${POSTGRES_DB_MAIN};"
psql -v --username "${POSTGRES_USER}" -c "CREATE DATABASE ${POSTGRES_DB_TEST};"
