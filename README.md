### 1. **Configuração do pre-commit**

```sh
pip install pre-commit
pre-commit install
```

Certifique-se de ter um arquivo `.pre-commit-config.yaml` corretamente configurado, e que ele esteja no diretório raiz do repositório. O comando `pre-commit install` instala o hook no seu repositório.

### 2. **Iniciar o Docker Swarm**

```sh
docker swarm init
```

Este comando inicializa o Swarm, permitindo que você execute containers no modo de swarm. Certifique-se de que o Docker esteja corretamente instalado e configurado.

### 3. **Criar Segredos**
Apenas certifique-se de que a pasta `./secrets` exista antes de rodar o comando, caso contrário, o arquivo não será criado. O comando é:

```sh
echo "minha-chave-super-secreta" > ./secrets/storm-glass-api-key.txt
```

### 4. **Iniciar o aplicativo com Docker Compose**

```sh
docker-compose -p storm-glass up -d
```

Isso deve iniciar os containers definidos no seu arquivo `docker-compose.yml` com o nome de projeto `storm-glass`. 

### 5. **Verificar Logs**
Verificar os logs do serviço `server-express`:

```sh
docker-compose -p storm-glass logs server-express
```


### 6. **Executar Testes Unitários**

```sh
docker-compose -p storm-glass exec server-express yarn test:unit
```

### 7. **Executar Testes Funcionais**

```sh
docker-compose -p storm-glass exec server-express yarn test:functional
```

### 8. **Verificar Lint**
Para verificar o lint:

```sh
docker-compose -p storm-glass exec server-express yarn lint:check
```


### 9. **Verificar Estilo**

```sh
docker-compose -p storm-glass exec server-express yarn style:check
```
