# 🍕 Sistema de Pizzaria Profissional (Web)

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

Sistema web completo para gerenciamento de pizzarias, desenvolvido com **React** e **TypeScript**, utilizando o **Firebase (Firestore)** como banco de dados em tempo real.

O projeto apresenta uma interface moderna "Gourmet" (Dark Mode), sistema de segurança para áreas administrativas e um fluxo de pedidos passo a passo (Wizard).

---

## 👥 Autores / Desenvolvedores

Trabalho acadêmico desenvolvido pelos alunos:

* **Eduardo Escuer** - RA: 2500241
* **Gabriel Cannuto** - RA: 2505604
* **Gustavo Facione** - RA: 2506276
* **Matheus Babler** - RA: 2506053
* **Pedro Henrique Tonhon** - RA: 2507542

---

## 🚀 Funcionalidades do Sistema

### 🔐 Segurança e Controle de Acesso
* **Sistema de Login:** Proteção por senha para áreas sensíveis.
* **Áreas Restritas:** Apenas o administrador pode acessar:
    * Gestão de Clientes.
    * Gestão de Cardápio.
    * Relatórios Financeiros.
* **Painel de Controle (Dashboard):** Visão geral com contadores em tempo real.

### 🛒 Fluxo de Pedidos Inteligente (Wizard)
Sistema de vendas otimizado para evitar erros no atendimento:
1.  **Seleção de Cliente:** Busca rápida no banco de dados.
2.  **Configuração do Produto:**
    * Seleção do Sabor.
    * **Passo 1:** Escolha Obrigatória do Tamanho.
    * **Passo 2:** Seleção de Adicionais (Borda, Bacon, etc.).
    * **Passo 3:** Definição de Quantidade (+/-).
3.  **Carrinho de Compras:** Visualização detalhada e soma automática.
4.  **Botão de Pânico:** Opção para cancelar/limpar o pedido atual instantaneamente.
5.  **Pagamento:** Múltiplas formas (Dinheiro, Pix, Cartão).

### 📋 Gestão de Cardápio Dinâmico
O sistema permite gerenciar cada aspecto do produto separadamente via abas:
* **Pizzas:** Cadastro de sabores.
* **Tamanhos:** Definição de tamanhos e preços base.
* **Adicionais:** Ingredientes extras cobrados à parte.
* **Bebidas e Sobremesas:** Itens complementares.

### 📄 Comprovantes e Relatórios
* **Cupom Automático:** O sistema gera e baixa um arquivo `.txt` com o resumo do pedido ao finalizar a venda.
* **Relatório de Vendas:** Tabela completa com histórico de transações salvas no banco.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React.js + Vite
* **Linguagem:** TypeScript
* **Estilização:** CSS3 (Variáveis, Flexbox, Grid Layout, Animações e Design Responsivo)
* **Banco de Dados:** Google Firebase (Firestore)
* **Ferramentas:** Node.js, NPM, Git

---

## 💻 Guia de Instalação e Execução

Siga os passos abaixo para rodar o projeto na sua máquina.

### Pré-requisitos
* Ter o **[Node.js](https://nodejs.org/)** instalado.

### 1. Clonar o repositório
Abra o terminal e digite:
```bash
git clone [https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git](https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git)
cd NOME-DA-PASTA

2. Instalar dependências
Bash

npm install
3. Configurar o Banco de Dados (Firebase)
O sistema precisa das chaves de acesso para funcionar.

Crie um arquivo chamado firebaseConfig.ts dentro da pasta src/.

Cole o seguinte código (substituindo pelas suas chaves do Firebase Console):

TypeScript

// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
4. Rodar a aplicação
Bash

npm run dev
O terminal irá mostrar o link de acesso, geralmente: http://localhost:5173.

🔑 Credenciais de Acesso
Para acessar as áreas administrativas (Clientes, Cardápio e Relatórios), utilize a senha padrão configurada no código:

Senha de Admin: admin123

(A senha pode ser alterada no arquivo src/App.tsx na função verificarSenha).
