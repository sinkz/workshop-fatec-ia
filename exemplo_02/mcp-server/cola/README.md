# 📚 Cola - MCP Server Completo com Todas as Ferramentas

Esta pasta contém **a versão completa da configuração do MCP** com todas as 5 ferramentas implementadas.

## 📁 Arquivos

### `config.js` ⭐ **ARQUIVO PRINCIPAL - COPIE ESTE!**

Configuração completa com 5 ferramentas MCP:

- ✅ `listar_produtos` - Lista todos os produtos
- ✅ `criar_produto` - Cria um novo produto
- ✅ `buscar_produto` - Busca produto por ID
- ✅ `editar_produto` - Edita produto existente
- ✅ `excluir_produto` - Remove produto do sistema

**⚠️ Importante:** Os handlers (implementações) **já estão prontos** no `../index.js`!  
Os alunos **NÃO precisam mexer nos handlers** devido à complexidade.

### `config-extras.js`

Configurações individuais separadas (apenas para referência/estudo):

- Documentação detalhada de cada ferramenta
- Exemplos de uso
- Explicações sobre inputSchema

## 🎯 Objetivo do Exercício

Os alunos devem:

1. **Copiar** o arquivo `cola/config.js` completo para substituir o `config.js` principal
2. ✅ **Handlers já estão implementados no `index.js`** (não precisa mexer!)
3. **Reiniciar** o MCP Server
4. **Testar** via frontend com comandos de IA

**💡 Por que os handlers já estão prontos?**  
Os handlers envolvem lógica mais complexa (axios, tratamento de erros, formato MCP).  
Para fins didáticos, os alunos focam apenas na **configuração** das ferramentas.

## 🚀 Como Usar

### Opção 1: Copiar o Arquivo Completo (RECOMENDADO) ⭐

**Mais Fácil:** Simplesmente copie **TODO** o conteúdo do arquivo `cola/config.js` e **substitua** o conteúdo do `mcp-server/config.js`.

```bash
# Na pasta mcp-server/
cp cola/config.js config.js
```

Ou copie e cole manualmente todo o conteúdo.

### Opção 2: Copiar Apenas as Ferramentas Extras

Se preferir copiar apenas as 3 novas ferramentas:

1. Abra `cola/config-extras.js`
2. Copie as configurações das ferramentas individuais
3. Adicione no array `ferramentas` do `config.js`

### Passo 2: Reiniciar o MCP Server

```bash
cd mcp-server
npm run dev
```

Você verá os logs indicando 5 ferramentas registradas! ✅

### Passo 3: Verificar Ferramentas Disponíveis

```bash
# Listar ferramentas registradas
curl http://localhost:3003/tools | jq
```

**Esperado:** Ver 5 ferramentas (listar, criar, buscar, editar, excluir)

### Passo 4: Testar no Frontend

Abra o navegador em `http://localhost:5173` e teste comandos com a IA:

#### 🔍 Buscar Produto

```
"Busque o produto 1"
"Mostre os detalhes do produto 2"
"Me diga as informações do produto 3"
```

#### ✏️ Editar Produto

```
"Edite o produto 1 para ter o nome 'Notebook Dell XPS'"
"Atualize o preço do produto 2 para R$ 75"
"Mude a categoria do produto 3 para 'Hardware'"
```

#### 🗑️ Excluir Produto

```
"Exclua o produto 4"
"Delete o produto com ID 3"
"Remova o produto 'Mouse Logitech'"
```

#### 🧪 Comandos Avançados

```
"Liste todos os produtos da categoria Periféricos"
"Qual é o produto mais caro? Edite ele para custar R$ 2000"
"Exclua todos os produtos que custam menos de R$ 100"
```

## 🧪 Testes Rápidos

### Teste 1: Verificar ferramentas via HTTP

```bash
curl http://localhost:3003/tools | jq '.tools[] | .name'
```

**Esperado:**

```
"listar_produtos"
"criar_produto"
"buscar_produto"
"editar_produto"
"excluir_produto"
```

### Teste 2: Testar ferramenta via HTTP

```bash
# Buscar produto
curl -X POST http://localhost:3003/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "buscar_produto", "arguments": {"id": 1}}'

# Editar produto
curl -X POST http://localhost:3003/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "editar_produto", "arguments": {"id": 1, "preco": 3500}}'

# Excluir produto
curl -X POST http://localhost:3003/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "excluir_produto", "arguments": {"id": 4}}'
```

## 🎓 Conceitos Importantes

### 1. inputSchema

Define os parâmetros que a ferramenta aceita:

```javascript
inputSchema: {
  type: "object",
  properties: {
    id: { type: "number", description: "ID do produto" },
    nome: { type: "string", description: "Nome (opcional)" }
  },
  required: ["id"] // Apenas ID é obrigatório
}
```

### 2. Argumentos Opcionais

A ferramenta `editar_produto` aceita atualização parcial:

```javascript
// ✅ Válido - só editar nome
{ id: 1, nome: "Novo Nome" }

// ✅ Válido - só editar preço
{ id: 1, preco: 3500 }

// ✅ Válido - editar tudo
{ id: 1, nome: "Novo", preco: 3500, categoria: "Nova" }
```

### 3. Description (Descrição)

A descrição da ferramenta é crucial - ela guia a IA sobre **quando** usar cada ferramenta:

```javascript
{
  name: "editar_produto",
  description: "Edita/atualiza os dados de um produto existente. Use quando o usuário quiser modificar nome, preço ou categoria.",
  // ...
}
```

## 💡 Dicas para os Alunos

### Sobre buscar_produto

- ✅ Útil para verificar se produto existe
- ✅ IA pode usar antes de editar/excluir
- ✅ Retorna erro claro se não encontrado

### Sobre editar_produto

- ✅ Aceita atualização parcial (só campos enviados)
- ✅ IA decide quais campos atualizar
- ✅ Valida se produto existe

### Sobre excluir_produto

- ✅ Remove permanentemente (nesta sessão)
- ✅ Retorna dados do produto removido
- ✅ IA pode confirmar antes de excluir

## ✅ Checklist do Exercício

Antes de prosseguir, confirme que:

- [ ] Arquivo `config.js` copiado/atualizado
- [ ] MCP Server reiniciado sem erros
- [ ] Backend rodando com 5 endpoints
- [ ] Endpoint `/tools` lista 5 ferramentas
- [ ] Frontend consegue acessar MCP Server
- [ ] Testes manuais via curl funcionando
- [ ] Comandos de IA executando ferramentas

## 🔗 Próximos Passos

1. ✅ Implementar endpoints no backend (`../backend/cola/`)
2. ✅ Configurar ferramentas no MCP (você está aqui!)
3. ⏭️ Testar com IA via frontend
4. ⏭️ Explorar comandos avançados

## ❓ Troubleshooting

### Erro: "Ferramenta não encontrada"

- Verifique se copiou o `config.js` completo
- Reinicie o MCP Server
- Confira se não há erros de sintaxe no arquivo

### IA não executa a ferramenta

- Verifique se a descrição da ferramenta está clara
- Tente reformular o comando de forma mais direta
- Confira logs do MCP Server no terminal

### Handlers não encontrados

- **Não se preocupe!** Os handlers já estão implementados no `index.js`
- Você só precisa copiar o `config.js`
- Se mesmo assim der erro, verifique se o `index.js` tem os handlers

## 🎉 Parabéns!

Ao completar este exercício, você terá:

- ✅ MCP Server com 5 ferramentas funcionais
- ✅ Configuração completa de inputSchema
- ✅ IA capaz de gerenciar produtos via linguagem natural
- ✅ Compreensão da separação: Config (o que) vs Handlers (como)

---

**🎓 Criado para o Workshop FATEC - Inteligência Artificial com MCP**
