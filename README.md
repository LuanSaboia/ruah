# 🕊️ Ruah - Plataforma para Ministério de Música

> "Quem canta, reza duas vezes."

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

**Ruah** é uma aplicação moderna de repertório musical (Songbook) desenvolvida para facilitar o acesso a letras e cifras em comunidades, grupos de oração e liturgias (focado no repertório *Cantai* da Comunidade Shalom).

Construído com foco em **Performance**, **UX Mobile-First** e **Design Minimalista**.

## ✨ Funcionalidades

O Ruah oferece um ecossistema completo para o ministério:

### 🎸 Execução Musical
- **Cifras Inteligentes:** Transposição de tom em tempo real.
- **Acordes Interativos:** Passe o mouse (ou toque) sobre a cifra para ver o desenho do acorde.
- **Rolagem Automática:** Ajuste a velocidade para tocar sem usar as mãos.
- **Modo Apresentação:** Visualização limpa e focada para usar durante a missa, com navegação rápida entre as músicas do repertório.

### 📅 Planejamento Litúrgico (Novo!)
- **Gerador de Liturgia:** Crie o repertório da missa baseado em modelos (Missa Comum, Grupo de Oração, etc.).
- **Filtro Inteligente:** O sistema sugere músicas baseadas no momento da celebração (ex: ao clicar em "Comunhão", lista apenas músicas de comunhão).
- **Mapeamento de Categorias:** Reconhece temas (ex: Sugere cantos Marianos para o Final).

### 🛠️ Ferramentas do Músico
- **Afinador Cromático:** Afinador preciso integrado direto no navegador (requer microfone).
- **Metrônomo:** Controle de BPM visual e sonoro integrado à tela da cifra.
- **Meus Repertórios:** Crie e salve listas de músicas para eventos específicos (funciona offline via LocalStorage).

### 🤝 Comunidade e Moderação
- **Wiki Colaborativa:** Usuários podem sugerir novas músicas ou correções em cifras existentes.
- **Painel Administrativo:** Sistema de revisão para aprovar ou rejeitar sugestões antes de irem ao ar.
- **Busca Global:** Pesquisa rápida (Command+K) por músicas, artistas ou trechos da letra.

## 🛠️ Tech Stack

O projeto utiliza as tecnologias mais modernas do ecossistema React:

- **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Roteamento:** [React Router DOM](https://reactrouter.com/)

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (v18 ou superior).
- Uma conta no [Supabase](https://supabase.com/) (Gratuito).

### 1. Clone o repositório
``git clone [https://github.com/SEU_USUARIO/ruah.git](https://github.com/SEU_USUARIO/ruah.git)``
``cd ruah``


### 2. Instale as dependências:
``npm install``

### 3. Configure as Variáveis de Ambiente: Crie um arquivo .env na raiz do projeto com as credenciais do seu Supabase:

``VITE_SUPABASE_URL=sua_url_do_supabase``
``VITE_SUPABASE_ANON_KEY=sua_chave_anonima``

### 4. Inicie o projeto
``npm run dev``

### 5. Acesse: O projeto estará rodando em ``http://localhost:5173.``

## 🗄️ Estrutura do Banco de Dados (Supabase)

O projeto utiliza duas tabelas principais:

1. **`musicas`**: Armazena o catálogo oficial.
   - Colunas: `id`, `titulo`, `artista`, `letra`, `cifra`, `categoria`, `bpm`, `tom_original`, etc.
2. **`sugestoes`**: Fila de espera para novas músicas ou correções enviadas pelos usuários.

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Se você tem uma ideia para melhorar o app:

1. Faça um **Fork** do projeto.
2. Crie uma Branch para sua Feature (`git checkout -b feature/IncrivelFeature`).
3. Faça o Commit (`git commit -m 'Add some IncrivelFeature'`).
4. Faça o Push (`git push origin feature/IncrivelFeature`).
5. Abra um **Pull Request**.
