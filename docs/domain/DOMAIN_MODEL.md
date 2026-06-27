# Modelo de Domínio — VoltaGo *(nome provisório)*

> Estado: proposta para discussão. Base para o modelo de base de dados e para a app.
> Âmbito alinhado: B2B primeiro (condomínios + restaurantes), casas encaixadas em rotas, zona inicial Porto, recolha por parceiro logístico.

## 1. Entidades principais

| Entidade | O que representa | Notas-chave |
|---|---|---|
| **Zona** | Localidade/concelho onde a VoltaGo opera | Porto é a primeira. Unidade de expansão. |
| **Bairro** | Subdivisão de uma Zona usada para agrupar rotas | Onde vive a regra de densidade das casas. |
| **Município** | Câmara que pode ser parceira de uma Zona | Futuro; opcional. |
| **ParceiroLogístico** | Transportadora licenciada que faz a recolha | Detém o registo de transportador + e-GAR. |
| **Motorista** | Pessoa que executa a rota (do parceiro) | É o "estafeta" na app. |
| **Conta** | Cliente da plataforma | Tipo: `condominio` \| `restaurante` \| `casa`. |
| **Utilizador** | Identidade de login que gere uma Conta | Admin de condomínio, gestor de restaurante ou residente. |
| **Morada** | Localização geocodificada de uma Conta | Origem das paragens. |
| **Rota** | Viagem de recolha planeada numa Zona | Gerada por contas B2B (ou casas promovidas). |
| **Paragem** | Um ponto de uma Rota, ligado a uma Conta | Casa só existe se já houver Rota no bairro. |
| **Recolha** | O evento real de levantamento numa Paragem | Contagem de embalagens + comprovativo. |
| **ItemRecolha** | Linha de contagem por material | plástico / lata / vidro / outro. |
| **Depósito** | Valor monetário gerado por uma Recolha | Destino depende do tipo de conta. |
| **Carteira** | Saldo de uma Conta (ou do fundo comum) | Movimentada por transações. |
| **Transação** | Movimento de carteira | crédito / levantamento / doação. |
| **Comprovativo** | PDF com contagem e destino de cada Recolha | Para assembleia/registos do cliente. |
| **Fatura** | Cobrança do serviço VoltaGo ao cliente B2B | **É a receita da VoltaGo.** |
| **Subscrição** | Plano recorrente de uma Conta | b2b_recorrente / casa. |
| **ListaEspera** | Casas inscritas num bairro ainda sem rota | Conta para o limiar de promoção. |

## 2. Regras de negócio embutidas

- **R1 — Casa só em rota existente.** Uma Paragem de tipo `casa` só pode ser criada numa Rota cujo Bairro já tenha rota gerada por uma conta B2B (condomínio/restaurante). Nunca há deslocação isolada a uma casa.
- **R2 — Rotas nascem do B2B.** Condomínios e restaurantes geram as rotas de um bairro/zona.
- **R3 — Promoção por densidade.** Quando as casas aderentes de um Bairro ultrapassam o `limiar_promocao` (nº de casas / embalagens estimadas), o bairro é promovido e pode gerar **rota própria de casas** (`origem = casas_promovidas`).
- **R4 — Casa sem rota → lista de espera.** Estado `espera`; a app comunica "ainda não há rota no seu bairro" e quantos faltam para abrir.
- **R5 — Destino do depósito por tipo:** condomínio → `fundo_comum`; restaurante → `abate_fatura` ou `carteira`; casa → `carteira` individual; sempre com opção `doacao`.
- **R6 — Transporte é do parceiro.** O ParceiroLogístico é o transportador registado; e-GAR associada à Rota/Recolha. *(A confirmar com jurista antes de operar.)*
- **R7 — Receita não sai do depósito.** A VoltaGo cobra serviço/subscrição (Fatura); o valor do depósito é 100% do cliente. O reembolso em numerário é gratuito por lei.
- **R8 — Tudo pertence a uma Zona.** Rotas, contas, motoristas e paragens são da Zona. No arranque, só a Zona Porto está ativa.

## 3. Decisões de modelação

- **Conta única com discriminador `tipo`** em vez de três entidades separadas: condomínio, restaurante e casa partilham quase tudo (morada, recolhas, carteira, paragens). Os campos específicos vivem em perfis por tipo. Evita triplicar lógica.
- **Utilizador separado de Conta**: um condomínio tem vários utilizadores (administração); um utilizador pode gerir várias contas. Login ≠ cliente.
- **Bairro como entidade de 1.ª classe**: é o que torna executáveis as regras R1–R4 (sem ele, não há como "encaixar casas em rotas" nem medir densidade).
- **Depósito e Fatura separados**: deixam claro, no modelo, que o dinheiro do cliente (depósito) e a receita da VoltaGo (serviço) nunca se misturam — alinhado com R7.

## 4. Questões em aberto (a decidir antes da base de dados)

1. **Limiar de promoção (R3):** que número de casas / embalagens dispara uma rota só de casas? (a validar no terreno)
2. **Quem confirma a contagem** numa Recolha: o motorista do parceiro na app? validação posterior? Impacta fraude e fatura.
3. **Modelo de preço B2B:** subscrição fixa, taxa por recolha, ou misto? Define o cálculo da Fatura.
4. **Fundo comum do condomínio:** carteira própria do condomínio ou abate direto na quota via relatório? (decisão adiada anteriormente)
