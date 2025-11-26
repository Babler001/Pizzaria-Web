import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './App.css';

// ================= TIPOS =================
interface ItemBase { id?: string; nome: string; preco: number; }
interface Pizza extends ItemBase {}
interface Tamanho extends ItemBase {}
interface Adicional extends ItemBase {}
interface Bebida extends ItemBase {}
interface Sobremesa extends ItemBase {}

interface Cliente {
  id?: string;
  nome: string;
  endereco: string;
  telefone: string;
}

interface PedidoPizza extends Pizza {
  tamanho?: Tamanho;
  adicionais?: Adicional[];
  uuid?: string;
}

type PedidoItem = (PedidoPizza | Bebida | Sobremesa) & { uuid?: string, tipo: 'PIZZA' | 'BEBIDA' | 'SOBREMESA' };
type FormaPagamento = "Dinheiro" | "Cartão de Crédito" | "Cartão de Débito" | "Pix";

interface Venda {
  data: string;
  clienteNome: string;
  clienteEndereco: string;
  clienteTelefone: string;
  pedido: PedidoItem[];
  total: number;
  pagamento: FormaPagamento;
}

// ================= APP PRINCIPAL =================
function App() {
  const [tela, setTela] = useState<'MENU' | 'PEDIDO' | 'CLIENTES' | 'CARDAPIO' | 'RELATORIOS'>('MENU');
  const [abaCardapio, setAbaCardapio] = useState<'PIZZAS' | 'TAMANHOS' | 'ADICIONAIS' | 'BEBIDAS' | 'SOBREMESAS'>('PIZZAS');

  // --- DADOS DO BANCO ---
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [tamanhos, setTamanhos] = useState<Tamanho[]>([]);
  const [adicionais, setAdicionais] = useState<Adicional[]>([]);
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [sobremesas, setSobremesas] = useState<Sobremesa[]>([]);

  // --- INPUTS CADASTRO ---
  const [novoCliente, setNovoCliente] = useState<Cliente>({ nome: '', endereco: '', telefone: '' });
  const [clienteEmEdicao, setClienteEmEdicao] = useState<string | null>(null);
  const [novoItem, setNovoItem] = useState<ItemBase>({ nome: '', preco: 0 });

  // --- CARRINHO E PEDIDO ---
  const [carrinho, setCarrinho] = useState<PedidoItem[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<FormaPagamento>('Dinheiro');

  // --- ESTADOS PARA PERSONALIZAÇÃO DA PIZZA ---
  const [pizzaEmConfiguracao, setPizzaEmConfiguracao] = useState<Pizza | null>(null);
  const [tamanhoTemp, setTamanhoTemp] = useState<string>(""); 
  const [adicionaisTemp, setAdicionaisTemp] = useState<string[]>([]);
  const [quantidadeTemp, setQuantidadeTemp] = useState<number>(1);

  useEffect(() => { carregarTudo(); }, []);

  const carregarColecao = async (nomeColecao: string, setEstado: any) => {
    try {
      const query = await getDocs(collection(db, nomeColecao));
      setEstado(query.docs.map(d => ({ ...d.data(), id: d.id })));
    } catch (e) { console.error(`Erro ao carregar ${nomeColecao}`, e); }
  };

  const carregarTudo = async () => {
    await carregarColecao("clientes", setClientes);
    await carregarColecao("vendas", setVendas);
    await carregarColecao("pizzas", setPizzas);
    await carregarColecao("tamanhos", setTamanhos);
    await carregarColecao("adicionais", setAdicionais);
    await carregarColecao("bebidas", setBebidas);
    await carregarColecao("sobremesas", setSobremesas);
  };

  // --- CLIENTES ---
  const prepararEdicaoCliente = (c: Cliente) => { setNovoCliente(c); setClienteEmEdicao(c.id!); };
  const cancelarEdicaoCliente = () => { setNovoCliente({ nome: '', endereco: '', telefone: '' }); setClienteEmEdicao(null); };

  const salvarCliente = async () => {
    if (!novoCliente.nome) return alert("Preencha o nome!");
    try {
      if (clienteEmEdicao) {
        await updateDoc(doc(db, "clientes", clienteEmEdicao), { ...novoCliente });
        alert("Cliente atualizado!");
      } else {
        await addDoc(collection(db, "clientes"), novoCliente);
        alert("Cliente cadastrado!");
      }
      cancelarEdicaoCliente();
      carregarTudo();
    } catch (e) { alert("Erro ao salvar cliente"); }
  };

  const excluirCliente = async (id: string) => { 
    if(confirm("Excluir cliente?")) { await deleteDoc(doc(db, "clientes", id)); carregarTudo(); } 
  };

  // --- CARDÁPIO ---
  const salvarItemCardapio = async () => {
    if (!novoItem.nome) return alert("Preencha o nome!");
    let colecao = "";
    if (abaCardapio === 'PIZZAS') colecao = "pizzas";
    if (abaCardapio === 'TAMANHOS') colecao = "tamanhos";
    if (abaCardapio === 'ADICIONAIS') colecao = "adicionais";
    if (abaCardapio === 'BEBIDAS') colecao = "bebidas";
    if (abaCardapio === 'SOBREMESAS') colecao = "sobremesas";

    try {
      await addDoc(collection(db, colecao), novoItem);
      alert(`${abaCardapio} salvo com sucesso!`);
      setNovoItem({ nome: '', preco: 0 });
      carregarTudo();
    } catch (e) { alert("Erro ao salvar item"); }
  };

  const excluirItemCardapio = async (id: string, colecao: string) => {
    if(confirm("Excluir item?")) { await deleteDoc(doc(db, colecao, id)); carregarTudo(); }
  };

  // Placeholders visuais
  const getPlaceholderNome = () => {
      switch(abaCardapio) {
          case 'TAMANHOS': return "Ex: Gigante, Broto...";
          case 'ADICIONAIS': return "Ex: Borda de Catupiry, Bacon Extra...";
          case 'PIZZAS': return "Ex: Calabresa, Portuguesa...";
          default: return "Nome do Item";
      }
  }

  const getPlaceholderPreco = () => {
      switch(abaCardapio) {
          case 'TAMANHOS': return "Valor adicional (Ex: 10.00)";
          case 'ADICIONAIS': return "Valor do extra (Ex: 5.00)";
          default: return "Preço (Ex: 35.00)";
      }
  }

  // ================= LÓGICA DE PEDIDOS =================

  // --- CANCELAMENTO (NOVO) ---
  const cancelarPedidoAtual = () => {
    if (carrinho.length === 0 && !clienteSelecionado) return;
    
    if (confirm("Tem certeza que deseja cancelar todo o pedido e limpar o carrinho?")) {
        setCarrinho([]);
        setClienteSelecionado(null);
        setPagamentoSelecionado('Dinheiro');
        setPizzaEmConfiguracao(null);
    }
  };

  const iniciarConfiguracaoPizza = (pizza: Pizza) => {
    if (tamanhos.length === 0) return alert("ERRO: Cadastre Tamanhos no cardápio antes de vender!");
    setPizzaEmConfiguracao(pizza);
    setTamanhoTemp("");
    setAdicionaisTemp([]);
    setQuantidadeTemp(1);
  };

  const toggleAdicional = (idAdicional: string) => {
    if (adicionaisTemp.includes(idAdicional)) {
        setAdicionaisTemp(adicionaisTemp.filter(id => id !== idAdicional));
    } else {
        setAdicionaisTemp([...adicionaisTemp, idAdicional]);
    }
  };

  const confirmarPizzaNoCarrinho = () => {
      if (!tamanhoTemp) return alert("Selecione um tamanho!");

      const objTamanho = tamanhos.find(t => t.id === tamanhoTemp);
      const objsAdicionais = adicionais.filter(a => adicionaisTemp.includes(a.id!));

      const novosItens: PedidoItem[] = [];
      for (let i = 0; i < quantidadeTemp; i++) {
        novosItens.push({
          ...pizzaEmConfiguracao!,
          tamanho: objTamanho,
          adicionais: objsAdicionais,
          tipo: 'PIZZA',
          uuid: Math.random().toString()
        });
      }

      setCarrinho([...carrinho, ...novosItens]);
      setPizzaEmConfiguracao(null); 
  };

  const adicionarItemSimples = (item: ItemBase, tipo: 'BEBIDA' | 'SOBREMESA') => {
      setCarrinho([...carrinho, { ...item, tipo, uuid: Math.random().toString() }]);
  };

  const calcularTotal = () => {
      return carrinho.reduce((total, item) => {
          let sub = item.preco;
          if (item.tipo === 'PIZZA') {
            const p = item as PedidoPizza;
            if (p.tamanho) sub += p.tamanho.preco;
            if (p.adicionais) sub += p.adicionais.reduce((a, b) => a + b.preco, 0);
          }
          return total + sub;
      }, 0);
  };

  const gerarComprovante = (venda: Venda) => {
    let txt = `--- COMPROVANTE ---\nCliente: ${venda.clienteNome}\nData: ${new Date(venda.data).toLocaleString()}\n\nITENS:\n`;
    venda.pedido.forEach(i => {
        txt += `- ${i.nome} (R$${i.preco.toFixed(2)})`;
        if(i.tipo === 'PIZZA') {
            const p = i as PedidoPizza;
            if(p.tamanho) txt += ` [${p.tamanho.nome} +${p.tamanho.preco.toFixed(2)}]`;
            if(p.adicionais?.length) txt += ` [Extras: ${p.adicionais.map(a=>a.nome).join(',')}]`;
        }
        txt += "\n";
    });
    txt += `\nTOTAL: R$${venda.total.toFixed(2)}\nPagamento: ${venda.pagamento}`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([txt], {type: 'text/plain'}));
    link.download = `cupom_${venda.clienteNome}.txt`;
    document.body.appendChild(link);
    link.click();
  };

  const finalizarPedido = async () => {
      if (!clienteSelecionado || carrinho.length === 0) return alert("Selecione cliente e itens!");
      const venda: Venda = {
          data: new Date().toISOString(), clienteNome: clienteSelecionado.nome,
          clienteEndereco: clienteSelecionado.endereco, clienteTelefone: clienteSelecionado.telefone,
          pedido: carrinho, total: calcularTotal(), pagamento: pagamentoSelecionado
      };
      await addDoc(collection(db, "vendas"), venda);
      gerarComprovante(venda);
      alert("Pedido realizado!"); setCarrinho([]); setTela('MENU');
  };

  return (
    <div className="app-container">
      <header>
          <h1>🍕 Sistema Pizzaria </h1>
          <nav>
              <button onClick={() => setTela('MENU')}>Início</button>
              <button onClick={() => setTela('PEDIDO')}>Novo Pedido</button>
              <button onClick={() => setTela('CLIENTES')}>Clientes</button>
              <button onClick={() => setTela('CARDAPIO')}>Cardápio</button>
              <button onClick={() => setTela('RELATORIOS')}>Relatórios</button>
          </nav>
      </header>

      <main>
        {tela === 'MENU' && (
            <div className="card-central">
                <h2>Painel de Controle</h2>
                <div className="dashboard-stats">
                    <div className="stat-box">📦 {pizzas.length} Pizzas</div>
                    <div className="stat-box">👥 {clientes.length} Clientes</div>
                    <div className="stat-box">💰 {vendas.length} Vendas</div>
                </div>
            </div>
        )}

        {tela === 'CLIENTES' && (
            <div className="container-largo">
                <div className="card-formulario">
                    <h2>{clienteEmEdicao ? "✏️ Editar Cliente" : "➕ Novo Cliente"}</h2>
                    <div className="form-column">
                        <input placeholder="Nome" value={novoCliente.nome} onChange={e => setNovoCliente({...novoCliente, nome: e.target.value})} />
                        <input placeholder="Telefone" value={novoCliente.telefone} onChange={e => setNovoCliente({...novoCliente, telefone: e.target.value})} />
                        <input placeholder="Endereço" value={novoCliente.endereco} onChange={e => setNovoCliente({...novoCliente, endereco: e.target.value})} />
                        <div className="btn-group">
                          <button className="btn-action" onClick={salvarCliente}>{clienteEmEdicao ? "Atualizar" : "Cadastrar"}</button>
                          {clienteEmEdicao && <button className="btn-cancel" onClick={cancelarEdicaoCliente}>Cancelar</button>}
                        </div>
                    </div>
                </div>
                <div className="grid-clients">
                    {clientes.map(c => (
                        <div key={c.id} className="client-card">
                            <strong>{c.nome}</strong>{c.telefone}<br/>{c.endereco}
                            <div className="client-actions">
                              <button className="btn-edit" onClick={() => prepararEdicaoCliente(c)}>Editar</button>
                              <button className="btn-delete" onClick={() => excluirCliente(c.id!)}>Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {tela === 'CARDAPIO' && (
            <div className="container-largo">
                <div className="tabs-cardapio">
                    <button className={abaCardapio === 'PIZZAS' ? 'active' : ''} onClick={() => setAbaCardapio('PIZZAS')}>🍕 Pizzas</button>
                    <button className={abaCardapio === 'TAMANHOS' ? 'active' : ''} onClick={() => setAbaCardapio('TAMANHOS')}>📏 Tamanhos</button>
                    <button className={abaCardapio === 'ADICIONAIS' ? 'active' : ''} onClick={() => setAbaCardapio('ADICIONAIS')}>🥓 Adicionais</button>
                    <button className={abaCardapio === 'BEBIDAS' ? 'active' : ''} onClick={() => setAbaCardapio('BEBIDAS')}>🥤 Bebidas</button>
                    <button className={abaCardapio === 'SOBREMESAS' ? 'active' : ''} onClick={() => setAbaCardapio('SOBREMESAS')}>🍰 Sobremesas</button>
                </div>

                <div className="card-central">
                    <h2>Cadastrar: {abaCardapio}</h2>
                    <div className="form-column">
                        <input 
                            placeholder={getPlaceholderNome()} 
                            value={novoItem.nome} 
                            onChange={e => setNovoItem({...novoItem, nome: e.target.value})} 
                        />
                        <input 
                            type="number" 
                            placeholder={getPlaceholderPreco()} 
                            value={novoItem.preco} 
                            onChange={e => setNovoItem({...novoItem, preco: parseFloat(e.target.value)})} 
                        />
                        <button className="btn-action" onClick={salvarItemCardapio}>Salvar {abaCardapio}</button>
                    </div>

                    <ul className="lista">
                        {abaCardapio === 'PIZZAS' && pizzas.map(p => <li key={p.id}>🍕 {p.nome} - R${p.preco} <button className="btn-delete" onClick={() => excluirItemCardapio(p.id!, "pizzas")}>X</button></li>)}
                        {abaCardapio === 'TAMANHOS' && tamanhos.map(p => <li key={p.id}>📏 {p.nome} (+R${p.preco}) <button className="btn-delete" onClick={() => excluirItemCardapio(p.id!, "tamanhos")}>X</button></li>)}
                        {abaCardapio === 'ADICIONAIS' && adicionais.map(p => <li key={p.id}>🥓 {p.nome} (+R${p.preco}) <button className="btn-delete" onClick={() => excluirItemCardapio(p.id!, "adicionais")}>X</button></li>)}
                        {abaCardapio === 'BEBIDAS' && bebidas.map(p => <li key={p.id}>🥤 {p.nome} - R${p.preco} <button className="btn-delete" onClick={() => excluirItemCardapio(p.id!, "bebidas")}>X</button></li>)}
                        {abaCardapio === 'SOBREMESAS' && sobremesas.map(p => <li key={p.id}>🍰 {p.nome} - R${p.preco} <button className="btn-delete" onClick={() => excluirItemCardapio(p.id!, "sobremesas")}>X</button></li>)}
                    </ul>
                </div>
            </div>
        )}

        {tela === 'PEDIDO' && (
            <div className="layout-flex">
                <div className="coluna">
                    <h3>1. Cliente</h3>
                    <select onChange={e => setClienteSelecionado(clientes.find(c => c.id === e.target.value) || null)} value={clienteSelecionado?.id || ""}>
                        <option value="">Selecione...</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                    
                    <h3>2. Itens Disponíveis</h3>
                    
                    {pizzaEmConfiguracao ? (
                        <div className="configuracao-pizza">
                            <h4 className="titulo-config">Passo 1: Personalizar {pizzaEmConfiguracao.nome}</h4>
                            
                            <label className="step-label">1. Escolha o Tamanho (Obrigatório):</label>
                            <select onChange={e => setTamanhoTemp(e.target.value)} value={tamanhoTemp} className="select-destaque">
                                <option value="">-- Selecione o tamanho --</option>
                                {tamanhos.map(t => <option key={t.id} value={t.id}>{t.nome} (+R${t.preco.toFixed(2)})</option>)}
                            </select>

                            {/* SÓ MOSTRA O RESTO SE TIVER ESCOLHIDO O TAMANHO */}
                            {tamanhoTemp && (
                              <div className="fade-in-steps">
                                  <label className="step-label">2. Escolha os Adicionais (Opcional):</label>
                                  <div className="grid-adicionais">
                                      {adicionais.map(ad => (
                                          <div key={ad.id} 
                                              className={`adicional-item ${adicionaisTemp.includes(ad.id!) ? 'selected' : ''}`}
                                              onClick={() => toggleAdicional(ad.id!)}>
                                              <span>{ad.nome}</span>
                                              <small>+R${ad.preco.toFixed(2)}</small>
                                          </div>
                                      ))}
                                  </div>

                                  <label className="step-label">3. Quantidade:</label>
                                  <div className="qty-control">
                                    <button onClick={() => setQuantidadeTemp(q => Math.max(1, q - 1))}>-</button>
                                    <span>{quantidadeTemp}</span>
                                    <button onClick={() => setQuantidadeTemp(q => q + 1)}>+</button>
                                  </div>

                                  <div className="btn-group" style={{marginTop: '30px'}}>
                                      <button className="btn-action" onClick={confirmarPizzaNoCarrinho}>Confirmar e Adicionar</button>
                                  </div>
                              </div>
                            )}

                            <button className="btn-cancel" style={{marginTop: '10px'}} onClick={() => setPizzaEmConfiguracao(null)}>Cancelar e Voltar</button>
                        </div>
                    ) : (
                        <div className="itens-grid">
                            <h4>Pizzas</h4>
                            {pizzas.map(p => <button key={p.id} onClick={() => iniciarConfiguracaoPizza(p)} className="btn-item">🍕 {p.nome} (R${p.preco})</button>)}
                            
                            <h4>Bebidas</h4>
                            {bebidas.map(b => <button key={b.id} onClick={() => adicionarItemSimples(b, 'BEBIDA')} className="btn-item">🥤 {b.nome} (R${b.preco})</button>)}

                            <h4>Sobremesas</h4>
                            {sobremesas.map(s => <button key={s.id} onClick={() => adicionarItemSimples(s, 'SOBREMESA')} className="btn-item">🍰 {s.nome} (R${s.preco})</button>)}
                        </div>
                    )}
                </div>

                <div className="coluna">
                    <h3>3. Carrinho</h3>
                    {carrinho.length === 0 ? <p>Carrinho Vazio</p> : (
                        <ul className="lista-carrinho">{carrinho.map((it, i) => <li key={i}>
                            <div>
                                <strong>{it.nome}</strong>
                                {it.tipo === 'PIZZA' && <small><br/>Tamanho: {(it as PedidoPizza).tamanho?.nome}</small>}
                                {it.tipo === 'PIZZA' && (it as PedidoPizza).adicionais?.length! > 0 && <small><br/>Extras: {(it as PedidoPizza).adicionais?.map(a => a.nome).join(', ')}</small>}
                            </div>
                            <span>R${it.preco.toFixed(2)}*</span>
                        </li>)}</ul>
                    )}
                    <h3>Total: R$ {calcularTotal().toFixed(2)}</h3>
                    <label>Pagamento:</label>
                    <select onChange={e => setPagamentoSelecionado(e.target.value as FormaPagamento)} value={pagamentoSelecionado}>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Pix">Pix</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                    </select>

                    <button onClick={finalizarPedido} className="btn-finalizar">✅ Finalizar Pedido</button>
                    
                    {/* BOTÃO DE CANCELAR PEDIDO NOVO */}
                    <button onClick={cancelarPedidoAtual} className="btn-cancelar-pedido">🗑️ Cancelar Pedido</button>
                </div>
            </div>
        )}

        {tela === 'RELATORIOS' && (
            <div className="container-largo">
                <div className="card-central">
                  <h2>Relatório de Vendas</h2>
                  <table className="tabela-relatorio">
                    <thead><tr><th>Data</th><th>Cliente</th><th>Pgto</th><th>Total</th></tr></thead>
                    <tbody>
                      {vendas.map((v, i) => (
                        <tr key={i}>
                          <td>{new Date(v.data).toLocaleDateString()} {new Date(v.data).toLocaleTimeString()}</td>
                          <td>{v.clienteNome}</td>
                          <td>{v.pagamento}</td>
                          <td className="valor">R$ {v.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

export default App;