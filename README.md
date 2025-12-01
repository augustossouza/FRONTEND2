# LOJA - E-commerce Frontend

Uma aplicação web moderna e responsiva para um e-commerce com funcionalidades completas de gerenciamento de produtos e usuários.

## 📋 Descrição

**LOJA** é um projeto frontend desenvolvido com HTML, CSS e JavaScript vanilla. Apresenta uma experiência de compras elegante com:
- Página inicial com produtos em promoção
- Catálogo completo de produtos com busca e filtros
- Gerenciamento de usuários
- Persistência de dados em localStorage
- Design responsivo e moderno
- Validações de formulário com feedback inline

## ✨ Funcionalidades

### 🏠 Página Inicial
- Exibe todos os produtos em promoção (preço < R$ 200)
- Cards com imagem, título, preço e badge de promoção
- Design atrativo com hover effects

### 📦 Página de Produtos
- **Listagem completa** de produtos com imagens
- **Busca em tempo real** por título, marca ou categoria
- **Filtros por preço** (mín e máx)
- **Formulário para adicionar produtos** com validação
- **Remoção de produtos** com confirmação
- **Ordenação automática** de promoções no início
- Preços formatados em Real (R$)
- Badges amarelas para produtos em promoção

### 👥 Página de Usuários
- Listagem de usuários com foto
- **Formulário para adicionar usuários** com validação
- **Email com validação** de formato
- **Idade com intervalo** (1-119)
- Remoção de usuários com confirmação
- Persistência em localStorage

### 🎨 Design & UX
- **Logo centralizado** na barra de navegação
- **Navegação clara** com destaque da página ativa
- **Responsividade completa** (desktop, tablet, mobile)
- **Paleta de cores** profissional (azul #0847a6, verde #1a9b44)
- **Transições suaves** e hover effects elegantes
- **Shadows refinadas** para profundidade
- **Validações inline** com mensagens de erro coloridas

### 🔐 Validações
- **Produtos**: título, descrição, preço, marca, categoria, URL de imagem
- **Usuários**: nome, sobrenome, email (RFC), idade (1-119), URL de foto
- Todos os campos com minlength/maxlength
- Feedback visual em tempo real

## 🚀 Como Usar

### Instalação & Setup

1. **Clonar ou extrair o projeto:**
   ```bash
   cd frontend-desafio-final
   ```

2. **Iniciar servidor local (Python 3):**
   ```bash
   python -m http.server 8000
   ```

3. **Abrir no navegador:**
   ```
   http://localhost:8000
   ```

### Uso das Funcionalidades

#### Página Inicial
- Acesse `http://localhost:8000/`
- Visualize todos os produtos em promoção
- Clique na navegação para acessar outras páginas

#### Adicionar Produto
1. Vá para a página **Produtos**
2. Preencha todos os campos do formulário:
   - **Título**: 3-50 caracteres
   - **Descrição**: 3-50 caracteres
   - **Preço**: número positivo
   - **Marca**: 3-50 caracteres
   - **Categoria**: 3-50 caracteres
   - **URL da foto**: opcional, deve ser URL válida
3. Clique em **Adicionar**
4. O produto aparecerá no topo da lista
5. Se o preço for < R$ 200, receberá badge de promoção

#### Buscar e Filtrar Produtos
1. Na página **Produtos**, use a barra de busca:
   - Digite para filtrar por título, marca ou categoria
   - Resultados aparecem em tempo real
2. Use os filtros de preço:
   - **Preço mín.**: valor mínimo (opcional)
   - **Preço máx.**: valor máximo (opcional)
3. Clique em **Limpar Filtros** para resetar

#### Remover Produto
1. Na página **Produtos**, clique em **Remover** no card
2. Confirme a remoção no diálogo
3. Produto será removido da lista e do localStorage

#### Adicionar Usuário
1. Vá para a página **Usuários**
2. Preencha todos os campos:
   - **Nome**: 3-50 caracteres
   - **Sobrenome**: 3-50 caracteres
   - **Email**: formato válido (ex: user@example.com)
   - **Idade**: 1-119 anos
   - **URL da foto**: opcional, deve ser URL válida
3. Clique em **Adicionar**
4. O usuário aparecerá no topo da lista

#### Remover Usuário
1. Na página **Usuários**, clique em **Remover** no card
2. Confirme a remoção
3. Usuário será removido da lista e do localStorage

## 📁 Estrutura do Projeto

```
frontend-desafio-final/
├── index.html                    # Página inicial
├── main.js                       # Script da página inicial
├── README.md                     # Este arquivo
├── assets/
│   ├── css/
│   │   └── styles.css           # Estilos globais
│   ├── img/
│   │   ├── logo.svg             # Logo da loja
│   │   └── products/            # Imagens dos produtos
│   ├── js/
│   │   └── utils.js             # Helpers compartilhados
│   └── products-seed.json       # Seed de produtos iniciais
├── products/
│   ├── products.html            # Página de produtos
│   └── products.js              # Script de gerenciamento de produtos
└── users/
    ├── users.html               # Página de usuários
    └── users.js                 # Script de gerenciamento de usuários
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Layout flexbox/grid, responsividade, animações
- **JavaScript (Vanilla)**: Lógica pura, sem frameworks
- **localStorage**: Persistência de dados no navegador
- **SVG**: Logo em formato vetorial

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente no **localStorage** do navegador:
- **Chave `products`**: Lista de produtos adicionados
- **Chave `users`**: Lista de usuários adicionados

**Nota**: Os dados são perdidos se você limpar o cache do navegador.

## 📦 Dados Iniciais

O projeto inclui um seed com 12 produtos de exemplo:
- Produtos de beleza, cosméticos e alimentos
- Preços variados (alguns em promoção < R$ 200)
- Imagens reais do site Sufgang

Os dados iniciais carregam nesta ordem de prioridade:
1. Arquivo seed local (`assets/products-seed.json`)
2. localStorage
3. API Sufgang (scraping leve)
4. API DummyJSON (fallback)

## 🎯 Validações & Regras

### Preço de Produto
- Deve ser um número positivo
- Se < R$ 200 → recebe badge "PROMOÇÃO"
- Formatado automaticamente em BRL

### Email de Usuário
- Segue padrão RFC válido
- Exemplo: `nome@dominio.com.br`

### Imagens
- Opcional em ambos formulários
- Devem ser URLs válidas
- Se inválida, mostra placeholder

### Confirmação ao Remover
- Obrigatória para evitar exclusões acidentais
- Mensagem personalizada com nome do item

## 📱 Responsividade

- **Desktop (>1200px)**: Layout otimizado com logo grande (110px)
- **Tablet (600px-1200px)**: Ajustes de espaçamento
- **Mobile (<600px)**: 
  - Logo reduzido (70px)
  - Navegação empilhada abaixo do logo
  - Filtros em coluna única
  - Cards em grid responsivo

## 🌈 Paleta de Cores

- **Primária**: Azul #0847a6 (títulos, links, destaques)
- **Secundária**: Verde #1a9b44 (preços)
- **Destaque**: Amarelo #ffc107 (badges de promoção)
- **Neutra**: Cinza #e0e0e0 (borders), #f9f9f9 (backgrounds)
- **Erro**: Vermelho #ff6b6b (botões remover)

## 🔧 Helpers Compartilhados (assets/js/utils.js)

Funções disponíveis globalmente:
- `escapeHtml(str)`: Previne injeção de HTML
- `formatPrice(value)`: Formata preço em BRL
- `saveToStorage(key, data)`: Salva em localStorage
- `loadFromStorage(key)`: Carrega de localStorage
- `isPromotion(price)`: Verifica se é promoção (< 200)
- `sortPromotionFirst(arr)`: Ordena promoções primeiro

## 📝 Notas de Desenvolvimento

- Todo o JavaScript é **vanilla** (sem dependências externas)
- CSS é **minificado** mas legível
- Estrutura modular com separação de responsabilidades
- Sem build process necessário
- Compatible com navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🐛 Troubleshooting

**"Porta 8000 já está em uso":**
```bash
python -m http.server 8001  # Use outra porta
```

**"Produtos não carregam":**
- Verifique se o servidor está rodando
- Abra o console (F12) para ver erros
- Limpe o cache (Ctrl+Shift+Delete)

**"localStorage cheia":**
- Remova alguns produtos/usuários
- Ou acesse DevTools > Storage > localStorage > Delete

## 📄 Licença

Projeto educacional. Sinta-se livre para usar e modificar.

---

**Desenvolvido com ❤️ para o desafio de E-commerce Frontend**

**Versão**: 1.0  
**Última atualização**: Novembro 2025


