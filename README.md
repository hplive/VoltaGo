# VoltaGo *(nome provisório)*

> Plataforma de recolha de embalagens com depósito (sistema **Volta** / SDR Portugal) — ao domicílio e em volume.

⚠️ **Protótipo de demonstração** — dados fictícios. Não ligado a base de dados, pagamentos ou GPS reais.

## Modelo de negócio
- **Condomínios e restaurantes** geram rotas (B2B)
- **Casas** encaixam nessas rotas (custo marginal ~zero)
- Casa sem rota → lista de espera + recrutamento do bairro
- Recolha executada por **parceiro logístico licenciado** (e-GAR)
- Arranque: **Zona Porto**

## Três tipos de conta
| Tipo | Quem paga | Depósito vai para |
|---|---|---|
| Condomínio | Taxa de serviço mensal | Fundo comum do prédio |
| Restaurante | Taxa por recolha | Carteira ou abate na fatura |
| Casa | Gratuito (encaixa na rota) | Carteira individual |

## Stack pretendida
Flutter · Supabase · PostgreSQL · FCM · OpenStreetMap · GitHub Actions

## Abrir o protótipo
Abrir `index.html` no browser. Sem dependências.

## Próximos passos
1. Validar com 3 condomínios + 3 restaurantes reais (Fase 2)
2. Confirmar enquadramento legal transporte de resíduos (DL 152-D/2017)
3. Fechar nome (risco marca "Volta" — SDR Portugal)
