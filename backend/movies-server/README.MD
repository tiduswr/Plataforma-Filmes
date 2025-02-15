# API principal | PlatFilmes

Essa api serve para se comunicar com os outros serviços do site além de realizar a autenticação dos usuários.

## Gerando as chaves públicas e privadas

É necessário gerar as chaves públicas e privadas para o protocolo OAuth2, para isso, utilize os comandos abaixo em uma distribuição linux.

```bash
$ openssl genrsa >> ./src/main/resources/sec-priv.key
$ openssl rsa -in ./src/main/resources/sec-priv.key -pubout -out ./src/main/resources/sec-pub.key
```
