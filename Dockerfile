FROM node:18


WORKDIR /roletronic
COPY package.json .
RUN npm install
# Copia o script post-install
COPY post-install.sh .

# Executa o script post-install
COPY . .
RUN echo "OBSEVANDO MARIADB"
HEALTHCHECK --interval=5s --timeout=3s \
    CMD mysqladmin ping -h db -u root -p${MYSQL_ROOT_PASSWORD} || exit 1
# RUN chmod +x ./post-install.sh && ./post-install.sh
CMD ["./post-install.sh"]
CMD npm run start:dev