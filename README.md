# MPJ IMPORTS — Experiência Interativa (56 camisas)

Projeto estático em **HTML, CSS e JavaScript puro**, sem servidor, banco de dados, instalação de pacotes ou frameworks. Esta versão modifica a loja MPJ IMPORTS existente, preservando a logo, os 56 produtos e suas 56 fotografias reais em `assets/products/`, além da colaboração editorial com quatro fotografias de campanha.

## Como abrir
Extraia o ZIP, entre na pasta `MPJ-IMPORTS` e abra `index.html` no navegador. Para editar, abra a mesma pasta no VS Code. O site não exige Live Server. Fontes opcionais podem vir do Google Fonts; sem internet a tipografia usa alternativas locais. Carrinho, favoritos e comparação continuam disponíveis neste navegador quando o armazenamento local é permitido.

## Finalizar pedido pelo WhatsApp
O número **(13) 99734-2745** já está configurado em `js/config.js` como `5513997342745`. No carrinho lateral ou na página `carrinho.html`, clique em **Finalizar pedido pelo WhatsApp**. O site abre a conversa com resumo de produtos, modelos, tamanhos, quantidades, preços unitários e total dos produtos (sem frete). A mensagem solicita confirmação de disponibilidade, preço final, pagamento e entrega.

**Atenção:** o cliente precisa apertar **Enviar** no WhatsApp; o site não transmite automaticamente a mensagem, não cobra e não registra pedido confirmado. O carrinho continua salvo localmente até o cliente alterá-lo ou esvaziá-lo. Para mudar o número, edite somente `js/config.js`.

## Catálogo e novas fotos
A lista de 56 produtos fica em `js/base-products.js`. Cada produto tem `id`, `club`, `region`, `country`, `kit`, `season`, `price` e dados opcionais como `edition`, `description` e `tag`. As fotos principais ficam em `assets/products/{id}.webp`. Para cadastrar um novo produto permanentemente, adicione um novo objeto ao catálogo e a foto real correspondente. Não há painel administrativo nem cadastro de usuário.

Para galerias com várias fotos reais, inclua `images: ['assets/products/exemplo-costas.webp','assets/products/exemplo-detalhe.webp']` no objeto. O sistema adiciona miniaturas e habilita troca de imagem no hover, toque, teclado e galeria. Se houver somente uma fotografia, não cria fotos fictícias.

Para tamanhos reais, preencha `sizes: ['P','M','G']` **somente quando comprovados**. Como não foram fornecidos estoques ou tamanhos reais das 56 camisas, o catálogo utiliza a opção **“A combinar”**, que exige seleção e significa consulta de disponibilidade (não venda garantida). Se um produto tiver modelos reais, adicione `models: ['...']`. Se medidas reais forem fornecidas, pode incluir `sizeGuide` como array de objetos com as medidas de cada tamanho; o guia não aparece sem medidas fornecidas.

Os preços são valores demonstrativos já presentes no projeto; não são ofertas verificadas. Nenhuma porcentagem de desconto, avaliação, venda, quantidade em estoque, prazo de frete ou urgência artificial é anunciada.

## Interações
- Cards com hover, zoom, favoritos, comparação e visualização rápida (também por toque/teclado)
- Modal de compra com seleção obrigatória de opção, quantidade e aviso de validação
- Página de produto com galeria responsiva, zoom, setas e swipe quando houver mais de uma foto
- Busca instantânea, sugestões, categorias, clubes, modelos, tamanhos cadastrados, preço e ordenação
- Filtros combináveis, etiquetas ativas, indicador de resultados, estado vazio, limpar filtros e URLs compartilháveis
- Comparação de até três camisas, com informações já cadastradas
- Produtos relacionados e vistos recentemente
- Carrinho lateral e página de carrinho com quantidades, variantes e subtotal; sem checkout falso
- Compartilhamento nativo quando possível ou cópia do endereço do produto
- Navegação móvel, retornos visuais, Escape para fechar, foco e `prefers-reduced-motion`

## Privacidade e limites
`localStorage` guarda apenas carrinho, favoritos, comparação e histórico de visualizações no navegador **deste dispositivo**. Não há sincronização entre clientes, contas ou servidor. Quando o armazenamento é bloqueado, o site pode funcionar na sessão atual, mas os dados podem não sobreviver à atualização. Ao compartilhar um link de arquivo `file://`, outros dispositivos não poderão abri-lo; para compartilhamento público, a loja precisa ser publicada em hospedagem estática.

### Arquivos principais
- `index.html`, `produtos.html`, `produto.html`, `carrinho.html`, `favoritos.html`
- `js/base-products.js` — catálogo
- `js/config.js` — único lugar para informar WhatsApp
- `js/store.js` — funcionalidades
- `css/experience.css` — melhorias de interação
- `assets/brand/` — logo original
- `assets/products/` — 56 fotografias de produtos

A loja é demonstrativa. Antes de uso comercial é necessário verificar direitos sobre as fotografias e os uniformes, disponibilidade, tamanhos, preços e regras aplicáveis.
