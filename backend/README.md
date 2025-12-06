
## 2 — Escrever testes **antes** de implementar (faltarão/irão falhar)

### Unitários

* [ ] `x-source.guard.spec.ts`

  * deve permitir quando header `x-source` = `go-worker`
  * deve recusar (lançar Forbidden) quando header ausente
  * deve recusar quando header diferente
* [ ] `items.controller.spec.ts`

  * controller chama `itemsService.create` com DTO validado
  * validação do DTO não é responsabilidade do controller test (mas checar delegação)
* [ ] `items.service.spec.ts`

  * `create()` deve transformar/validar entrada mínima e chamar repositório
  * em caso de erro de persistência, propagar/expor erro esperado
* [ ] `dto` tests (opcional)

  * validar que payloads inválidos falham (campos faltando/tipos errados)
  * validar transformação snake_case ↔ camelCase se necessário

### E2E

* [ ] `items.e2e-spec.ts`

  * 403 se header `x-source` ausente/errado (mesmo com auth válida)
  * 401/403 se autenticação inválida (reaproveitar comportamento de auth existente)
  * 400 se body inválido (mesmo com header e auth corretos)
  * 201 (ou 200) e body com id/campo salvo se tudo OK (header + auth + body válido)
  * testar persistência real usando mongodb-memory-server ou util `MongoInMemory` do projeto

---

## 3 — Implementação mínima (faça para tornar testes verdes)

* [ ] Criar `XSourceGuard` (`CanActivate`) que verifica `req.headers['x-source'] === 'go-worker'` e retorna/lança Forbidden.
* [ ] Registrar/usar `XSourceGuard` na rota: `@UseGuards(AuthGuard, XSourceGuard)` (AuthGuard já existente).
* [ ] Criar DTO `CreateItemDto` com `class-validator`/`class-transformer` para refletir o payload.
* [ ] Aplicar `ValidationPipe` (local na rota ou global) com `transform: true, whitelist: true`.
* [ ] Criar `ItemsController` com `@Post()` que injeta `ItemsService` e chama `create(dto)`.
* [ ] Criar `ItemsService.create(dto)` que persiste (via model/repository) e retorna o registro salvo.
* [ ] Criar schema/model mínimo (Mongoose/TypeORM) conforme decisão de persistência.

---

## 4 — Testes de integração / infra para e2e

* [ ] Configurar mongo em memória (mongodb-memory-server) ou reutilizar `MongoInMemory`.
* [ ] Helper de autenticação para e2e: gerar token válido ou chamar rota de login no `beforeAll`.
* [ ] Setup/teardown para limpar DB entre testes.

---

## 5 — Casos de borda / qualidade

* [ ] Validar formatos numéricos (lat/lon floats), timestamps (inteiros).
* [ ] Rejeitar campos extras se necessário (`whitelist: true`).
* [ ] Testar entradas extremas (valores nulos, arrays faltando, números fora de range).
* [ ] Log de requisições inválidas (opcional).

---

## 6 — CI / Execução

* [ ] Incluir `npm run test` / `npm run test:e2e` no pipeline.
* [ ] Rodar testes em ambiente isolado (setup do DB em CI).

---

## 7 — Documentação / manutenção

* [ ] Documentar header obrigatório (`x-source: go-worker`) na API (Swagger README).
* [ ] Escrever README curto no módulo `items` explicando contrato do body e pré-requisitos (auth, header).
* [ ] Adicionar testes de contrato (opcional) para garantir compatibilidade com produtor (go-worker).

---

Se quiser eu **reduzo/transformo** essa TODO list em um checklist em formato Markdown pronto pra colar no seu board (ou em um arquivo `TODO.md`) — só avisar — mas parei aqui porque você pediu *apenas a todo*. Quer que eu gere esse `TODO.md` pronto?
