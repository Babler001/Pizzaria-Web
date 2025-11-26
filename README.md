# 🍕 Sistema de Pizzaria Profissional

Este é um sistema web completo e moderno para gerenciamento de pizzarias, desenvolvido com **React** e **TypeScript**, utilizando o **Firebase (Firestore)** como banco de dados em tempo real.

O projeto apresenta uma interface "Gourmet" (Dark Mode), responsiva e intuitiva, com foco na experiência do usuário e na agilidade do atendimento.

## 👥 Autores / Desenvolvedores

Trabalho desenvolvido pelos alunos:

* **Eduardo Escuer** - RA: 2500241
* **Gabriel Cannuto** - RA: 2505604
* **Gustavo Facione** - RA: 2506276
* **Matheus Babler** - RA: 2506053
* **Pedro Henrique Tonhon** - RA: 2507542

---

## 🚀 Funcionalidades do Sistema

### 🖥️ Painel de Controle (Dashboard)
* Visão geral com contadores de Pizzas cadastradas, Clientes e Vendas totais.

### 👤 Gestão de Clientes
* **CRUD Completo:** Cadastrar, Listar, Editar e Excluir clientes.
* Interface em Cards para fácil visualização.
* Botão de edição rápida que preenche o formulário automaticamente.

### 📋 Gestão de Cardápio Dinâmico
O sistema permite gerenciar todos os aspectos do produto separadamente através de abas:
* **Pizzas:** Sabores e preços base.
* **Tamanhos:** (Ex: Broto, Média, Gigante) com precificação adicional.
* **Adicionais:** (Ex: Borda Recheada, Bacon Extra) com custos extras.
* **Bebidas e Sobremesas:** Cadastro de itens complementares.

### 🛒 Sistema de Pedidos Inteligente (Wizard)
Fluxo de pedido otimizado para evitar erros:
1.  **Seleção do Cliente:** Busca rápida na base de dados.
2.  **Personalização da Pizza:**
    * Ao clicar no sabor, abre-se uma janela de configuração.
    * **Passo 1:** Escolha obrigatória do Tamanho.
    * **Passo 2:** Seleção de Adicionais (opcional).
    * **Passo 3:** Definição da Quantidade.
3.  **Carrinho de Compras:** Visualização detalhada dos itens e total.
4.  **Pagamento:** Seleção entre Dinheiro, Pix ou Cartão.
5.  **Botão de Pânico:** Opção para cancelar/limpar o pedido atual rapidamente.

### 📄 Comprovantes e Relatórios
* **Geração Automática de Cupom:** Ao finalizar o pedido, o sistema gera e baixa automaticamente um arquivo `.txt` com o comprovante do cliente.
* **Histórico de Vendas:** Tabela detalhada com Data, Cliente, Forma de Pagamento e Valor Total.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React.js, Vite
* **Linguagem:** TypeScript
* **Estilização:** CSS3 (Variáveis CSS, Flexbox, Grid Layout, Animações Keyframes)
* **Banco de Dados:** Google Firebase (Firestore)
* **Ferramentas:** Node.js, NPM, Git

---

## 💻 Como baixar e rodar este projeto

Siga as instruções abaixo para rodar o sistema na sua máquina local.

### Pré-requisitos
Certifique-se de ter o **Node.js** instalado.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git](https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git)
cd NOME-DA-PASTA
