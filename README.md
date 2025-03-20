# Desafio Urbis: Upload de usuários

Este projeto é destinado a criação de uma API para gerenciamento eficiente, veloz e escalável de upload de usuários através de planilhas, usando processamento assíncrono e filas, dada a problemática de proporcionar mais estabilidade e segurança para upload em massa de usuários.


# Explicação do fluxo de funcionamento da API
1. Basicamente, a API gera uma Pre-Signed URL através do nosso bucket S3 e disponibiliza para o cliente (usuário ou front-end) consumir, assim em uma requisição o front-end pode anexar a planilha;
2. Ao fazer o upload da planilha via Pre-Signed URL, o arquivo vai diretamente para um bucket S3 onde dispara um trigger para uma fila SQS com metadados do arquivo que foi recém colocado no bucket
3. O consumer (SQSConsumerMessage) que já está pronto para consumir mensagens da fila **send-file-api-from-s3**, recebe o Body da mesma e encaminhando para a próxima fila SQS **receive-body-from-queue**
4. Como penúltima parte, a fila **receive-body-from-queue** recebe a mensagem com o Body, fazendo o parse da mesma para JSON e assim conseguindo fazer o download da planilha a partir do S3; Em seguida é realizado a transformação da planilha para JSON (independente se a planilha tem abas ou não), então quando o processamento acaba, o array de objetos (usuários) é enviado para o próximo job;
5. A última parte do processo é a inserção em massa com o método createMany do Prisma com a opção **skipDuplicates = true**, assim eliminando a possibilidade de duplicatas com registros dentro do array de objetos a ser inserido como no banco de dados.


![imagem_arquitetura_whimsical](https://github.com/user-attachments/assets/df244ffc-560a-42a9-8c1a-1e6a41a9b3a4)


# Tecnologias utilizadas

1. Nestjs
2. Node.js
3. PrismaORM
3. Swagger
4. PostgreSQL
5. Docker Compose
6. Jest
7. Biblioteca aws-sdk
8. Biblioteca sqs-consumer
8. Biblioteca xlsx
9. Insomnia
10. Serviços AWS (S3, SQS, RDS, EC2, VPC)


# Pré-requisitos para rodar o projeto
1. Node.js v17 >=
2. npm v10 >=
3. Nestjs v11>=
2. Docker v20.10.x >= 
3. Docker Compose v2.6.x >=
4. HTTP Client (Insomnia, Postman, APIDog)
5. Visual Studio Code

# Como executar o projeto
## Como executar o back-end localmente

Após fazer o download do repositório, abra o Visual Studio Code, crie na raiz do projeto back-end o arquivo **.env** e cole os valores que foram disponibilizados via e-mail junto com o desafio. No terminal, rode o comando: ```docker-compose up -d``` e então o banco de dados será criado assim como o container da API. Ou se preferir rodar sem containers específicos, crie um container postgres e cole os valores respectivos em DATABASE_URL, substituindo user, password, host e database_name

Em seguida rode no terminal os seguintes comandos:

1. **npx prisma generate** 
2. **npx prisma migrate dev** 

Para realizar requisições a API, acesse eu API client, importe as requisições que foram disponibilizadas (neste arquivo ou via e-mail) e a ordem para execução é a seguinte:

1. **POST**: Criação do whitelabel
2. **POST**: Criação da Pre-signed URL (O nome do campo **fileNameLocator** precisa ser **EXATAMENTE** o nome da sua planilha)
3. **PUT**: Enviar o arquivo para o S3 (Selecione o arquivo desejado )

Assim, o restante do processo será executado em background, e quando terminar a inserção no banco de dados, poderá recuperar os usuários cadastrados

1. **GET**: Recuperar todos os usuários (Lista de forma paginada)

E ainda é possível recuperar todas as whitelabels criadas no sistema.

1. **GET**: Recuperar todas as whitelabels (Lista de forma paginada)

# Observações

1. Caso queira realizar testes locais com as planilhas disponibilizadas por e-mail ou aqui pela grande volumetria de dados a fim de teste de carga, é recomendado que crie duas whitelabels e substitua os ids pelos ids das whitelabels já preenchidas nas tabelas disponibilizadas. Caso queira fazer a criação das whitelabels, pegar o id delas e substituir nas planilhas, não há problema.
2. Comandos para rodar no banco: 

``` sql 
UPDATE whitelabels SET id = '0d2276d1-de12-4611-a8ef-e17bd2d5ecd7' WHERE id = '**ID_PRIMEIRA_WHITELABEL_CRIADA_POR_VOCE**';
```

```sql
UPDATE whitelabels SET id = 'bc2064e6-66eb-4ae6-a3fe-cc8f58c0831c' WHERE id = '**ID_SEGUNDA_WHITELABEL_CRIADA_POR_VOCE**';
```

# Documentação da API

Caso queira acessar a documentação da API e realizar requisições pela interface do browser, basta rodar localmente ela seguindo os requisitos acima e acessar a URL: http://localhost:3000/api/docs

![swagger_urbis](https://github.com/user-attachments/assets/632d8f47-b264-4463-bf30-b52f4eefb181)


## Como rodar o front-end localmente 

Abra o Visual Studio Code, navegue até a pasta do projeto e selecione a pasta front-urbis para ser aberta. Então no terminal, digite: ```npm install``` para adicionar as dependências. Após isso, digitar ```npm run dev``` e o projeto vai subir na porta 3000 e poderá ser visualizado no navegador, já em integrado com o back-end (caso ele esteja de pé). 

![cento_vinte_comeco](https://github.com/user-attachments/assets/e4fd38bf-c2f9-4ea1-b72d-98a0a8ee1b9e)
![cento_vinte_loading](https://github.com/user-attachments/assets/86159c77-5978-49c4-81a4-520fddace2b6)
![cento_vinte_processando](https://github.com/user-attachments/assets/507d072b-0288-462b-9ebd-41d94753c626)

![cento_vinte_final](https://github.com/user-attachments/assets/3c8a1163-ed4f-4937-93e8-74a647b45a34)


