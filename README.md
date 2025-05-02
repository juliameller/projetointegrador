# 🌐 T-Solution

Projeto Integrador da disciplina de Inteligência Artificial, composto por uma aplicação fullstack com backend em Java (Spring Boot) e frontend em JavaScript (Node + React). O sistema integra conceitos modernos de desenvolvimento web e inteligência artificial, com persistência de dados utilizando PostgreSQL.

---

## 🛠️ Tecnologias Utilizadas

* **Backend**: Java, Spring Boot, Maven
* **Frontend**: Node.js, React, Vite
* **Banco de Dados**: PostgreSQL
* **Gerenciamento de Dependências**: NPM & Maven

---

## ✨ Como Rodar o Projeto

### 1. Pré-requisitos

Certifique-se de que as seguintes ferramentas estão instaladas em sua máquina:

* [Node.js](https://nodejs.org/)
* [NPM](https://www.npmjs.com/)
* [Java JDK 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
* [Maven](https://maven.apache.org/)
* [PostgreSQL](https://www.postgresql.org/)
* Editor de Código (como VS Code ou IntelliJ)

---

### 2. Banco de Dados (PostgreSQL)

1. Acesse o **PgAdmin** e crie um **servidor** apontando para o `localhost`.
2. Crie uma **senha** e um banco de dados com o nome `TS` (ou outro de sua preferência).
3. Clique com o botão direito no banco criado > **Query Tool**.
4. Cole e execute o script presente em:
   `SQL/DDL.sql`
5. Esse script irá criar as tabelas, relacionamentos e dados iniciais automaticamente.

---

### 3. Backend (Spring Boot)

1. Acesse a pasta `TSBackEnd` no seu editor de código.
2. Edite o arquivo `src/main/resources/application.properties` para refletir os dados do seu banco:

```properties
spring.application.name=TS /*Nome do Banco*/
spring.datasource.url=jdbc:postgresql://localhost:5432/DGC /*Configuração padrão de localhost postgres + Nome do banco*/
spring.datasource.username=postgres /*Nome de usuário padrão postgres*/
spring.datasource.password=admin /*Senha criada por você no inicio da criação do banco de dados postgres*/
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

3. Execute a classe `TSApplication.java`, localizada em:

```
TSBackEnd/src/main/java/com/example/dgc/TSApplication.java
```

> A aplicação será iniciada por padrão na porta `8080`.

---

### 4. Frontend (React + Vite)

1. Acesse o diretório raiz do projeto onde está o frontend.
2. Execute o comando abaixo para instalar as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

---

## ✅ Observações

* Certifique-se de que o backend esteja rodando antes de iniciar o frontend.
* A aplicação se conecta ao backend por padrão em `http://localhost:8080`.

---

## 📂 Estrutura do Projeto

```

BackEnd:

   TSBackEnd/
   ├── src/
   │   └── main/
   │       └── java/com/example/dgc/
   │           └── TSApplication.java
   └── resources/
           └── application.properties

FrontEnd:

   src/
   └── app/
       ├── Components/
       ├── ERP/
       ├── auth/
       ├── css/
       ├── pages/
       ├── layout.jsx
       ├── not-found.jsx
       └── ... (outros arquivos e pastas)

```

