## **1. Preparar o ambiente**

* [x] Instalar dependências:

  * [x] `@nestjs/mongoose` e `mongoose`
  * [x] `@nestjs/passport` e `passport`
  * [x] `@nestjs/jwt`
  * [x] `passport-local` (para login)
  * [x] `bcrypt`
  * [x] `cookie-parser`
  * [x] `mongodb-memory-server` (para testes)
* [x] Configurar `.env` com:

  * [x] JWT_SECRET
  * [x] JWT_EXPIRES
  * [x] DB_URI
  * [x] BCRYPT_SALT_ROUNDS

---

# **2. Configuração de Testes (TDD)**

* [x] Configurar **MongoDB in-memory** para jest
* [ ] Criar mock de `JwtService` para testes unitários
* [ ] Criar helper para testes de integração com Supertest

---

# **3. Criar o módulo de Users (TDD)**

### 🔹 **Testes primeiro**

* [x] Deve criar usuário com senha hasheada
* [x] Deve impedir criação de usuário duplicado
* [x] Deve retornar usuário por email
* [x] Deve validar senha com bcrypt

### 🔹 Implementação

* [x] Criar schema User (email + password + name)
* [x] Criar UsersService com:

  * [x] create()
  * [x] findByEmail()
  * [x] validatePassword()
* [ ] Criar UsersController (opcional, se quiser endpoint de registro)

# **4. Criar testes de autenticação (TDD)**

## **4.1. Testes da estratégia LocalStrategy**

* [ ] Deve autenticar usuário com email e senha corretos
* [ ] Deve rejeitar credenciais inválidas
* [ ] Deve chamar o UsersService corretamente

## **4.2. Testes do AuthService**

* [ ] validateUser() deve retornar o usuário sem senha se credenciais forem válidas
* [ ] validateUser() deve retornar null se inválido
* [ ] login() deve gerar JWT
* [ ] login() deve definir HttpOnly cookie

## **4.3. Testes do AuthController**

* [ ] POST /auth/login deve:

  * [ ] Autenticar com LocalGuard
  * [ ] Criar cookie com JWT (`httpOnly`, `secure`, `sameSite: 'none'`)
  * [ ] Retornar apenas dados públicos do usuário
* [ ] POST /auth/logout deve limpar cookie
* [ ] GET /auth/me deve retornar usuário baseado no cookie JWT

---

# **5. Implementação — Auth Module**

## **5.1. Criar LocalStrategy**

* [ ] Fazer login usando email em vez de username
* [ ] Usar AuthService.validateUser()

## **5.2. Criar AuthService**

* [ ] validateUser()
* [ ] login()

  * [ ] Gerar JWT
  * [ ] Configurar cookie:

    ```ts
    res.cookie('auth', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    ```

## **5.3. Criar AuthController**

* [ ] POST /auth/login usando `@UseGuards(AuthGuard('local'))`
* [ ] POST /auth/logout (limpar cookie)
* [ ] GET /auth/me (usar JwtGuard + extrair do cookie)

---

# **6. Configurar Passport + JWT**

* [ ] Registrar LocalStrategy
* [ ] Criar JwtStrategy com extração via cookie:

  ```ts
  jwtFromRequest: ExtractJwt.fromExtractors([
      (req) => req?.cookies?.auth,
  ])
  ```
* [ ] Criar JwtModule com env:

  * JWT_SECRET
  * JWT_EXPIRES_IN

---

# **7. Configurar Cookies e Credentials**

* [ ] Em `main.ts`:

  ```ts
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParser());
  ```
* [ ] No front:

  ```js
  axios.post('/auth/login', data, { withCredentials: true })
  ```

---

# **8. Testes E2E com Supertest**

* [ ] Teste login:

  * [ ] Enviar email + senha
  * [ ] Confirmar que retorna Set-Cookie
* [ ] Teste acesso autenticado usando cookie retornado
* [ ] Testar logout limpando cookie

---