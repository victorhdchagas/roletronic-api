#!/bin/bash

# Atualiza o cache de pacotes e instala o cliente MariaDB
apt-get update && apt install mariadb-client -y

# Gera o código do Prisma ORM
npx prisma generate

npx prisma db push

# Executa o script de seed para popular o banco de dados
#npx ts-node prisma/seed.ts
