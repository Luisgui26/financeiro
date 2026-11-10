# Saldo — finanças pessoais

Aplicação Next.js para acompanhar receitas e despesas cadastradas manualmente. Os valores são armazenados em centavos inteiros, e as operações são vinculadas ao usuário autenticado.

## Requisitos

Node.js 20.19 ou superior e um banco PostgreSQL do Neon. Use um banco ou branch dedicado para desenvolvimento.

## Configuração local

1. Instale as dependências: `npm install`.
2. No Neon, crie ou selecione um projeto e uma branch de desenvolvimento. Copie a URL **pooled** e a URL **direct** do mesmo banco.
3. Copie `.env.example` para `.env.local`. Defina `DATABASE_URL` com a URL pooled, `DATABASE_URL_UNPOOLED` com a URL direct e `NEON_AUTH_BASE_URL` com a URL do Neon Auth da branch e `NEON_AUTH_COOKIE_SECRET` com um segredo aleatório de pelo menos 32 caracteres. Nunca versionar esse arquivo.
4. Aplique as migrações: `npm run db:migrate`.
5. Insira as categorias iniciais: `npm run db:seed` (o seed pode ser executado novamente sem duplicar categorias).
6. Inicie: `npm run dev`. Acesse http://localhost:3000 e crie uma conta.

Para alterações no esquema, edite `src/db/schema.ts`, execute `npm run db:generate`, revise a migração gerada e aplique-a em uma branch de teste antes de produção.

## Verificações

- `npm test`: regras de valores, comparação e limites de mês.
- `npm run lint`: análise estática.
- `npm run build`: compilação de produção com webpack.

## Deploy na Vercel

Importe a pasta `financeiro` como raiz do projeto. Configure `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL` e `NEON_AUTH_COOKIE_SECRET` nas variáveis de ambiente do projeto. Execute migrações e seed com a URL direta no ambiente apropriado antes de disponibilizar a aplicação. Use um segredo diferente para cada ambiente.

## Escopo e limitações atuais

O projeto inclui autenticação gerenciada pelo Neon Auth, cadastro manual, dashboard e análises. O histórico aplica os filtros no banco e é paginado. O cadastro, login, sessão e lançamento manual foram testados com Neon; ainda são necessários testes automatizados de isolamento entre usuários e revisão de segurança antes de uso com dados financeiros reais. Integração bancária e lançamentos recorrentes não fazem parte desta versão.



A migração inicial em `drizzle-neon` inclui uma chave estrangeira para `neon_auth.user`; mantenha essa referência ao alterar o esquema. O diretório `drizzle` contém a versão anterior, não usada pela configuração atual.

