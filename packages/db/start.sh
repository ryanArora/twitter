docker run -p "5432:5432" -e "POSTGRES_HOST_AUTH_METHOD=trust" -it --rm --name twitter_postgres postgres
