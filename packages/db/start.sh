docker run \
  --name twitter_postgres \
  -p "5432:5432" \
  -v twitter-postgres-data:/var/lib/postgresql/data \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -e "POSTGRES_HOST_AUTH_METHOD=trust" \
  -it \
  --rm \
  postgres
