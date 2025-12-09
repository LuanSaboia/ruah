# Ruah - Digital Songbook

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

**Ruah** é uma aplicação moderna de repertório musical (Songbook) desenvolvida para facilitar o acesso a letras e cifras em comunidades, grupos de oração e liturgias (focado no repertório *Cantai* da Comunidade Shalom).

Construído com foco em **Performance**, **UX Mobile-First** e **Design Minimalista**.

## ✨ Funcionalidades

- **🔍 Busca Inteligente (Spotlight):** Pesquise músicas ou artistas instantaneamente (Atalho `Ctrl + K`).
- **📱 Mobile First:** Interface totalmente adaptada para celulares, com menus deslizantes e listas otimizadas.
- **🌙 Dark Mode:** Alternância nativa entre temas Claro e Escuro.
- **📂 Organização Poderosa:**
  - Navegação por **Artistas** (A-Z).
  - Filtros por **Categorias/Temas** (Louvor, Adoração, Litúrgico, etc.).
  - Suporte a múltiplas categorias por música.
- **🔒 Área Administrativa Protegida:**
  - Login seguro via Supabase Auth.
  - Painel para Cadastrar, Editar e Excluir músicas.
  - Editor de letras simples e direto.

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
```bash
git clone [https://github.com/SEU_USUARIO/ruah.git](https://github.com/SEU_USUARIO/ruah.git)
cd ruah
