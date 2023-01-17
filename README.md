# Desafio Innovation

## Como rodar o projeto

Caso tenha o docker instalado, será necessário o seguinte comando:

`yarn docker:dev`

Ao terminar de testar a aplicação rode o comando ` yarn container:stop`, este passo é necessário, pois hooks pre/post do npm não compatíveis com a cli do nest, ou seja, não existe (até o momento) uma forma automática de parar os contêineres após sair da aplicação.

Para rodar localmente é necessário a versão 16 do node e o postgres instalado.

Mude o arquivo .env para refletir as configurações do seu usuário postgres.

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"
```

Crie o banco de dados e aplique as migrações com o comando `yarn migration`, após finalizar o comando execute o projeto com `yarn start:dev`

Agora http://localhost:8000 estará pronto para receber requisições.

Documentação no Swagger: http://localhost:8000/api
