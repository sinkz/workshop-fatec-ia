# 🚀 Como Rodar o Sistema - 3 Passos Simples

## Passo 1: Backend

```bash
cd exemplo_02/backend
npm install
npm start
```

**Deve mostrar:**

```
🚀 Backend rodando na porta 3001
📦 Mock inicializado com 3 produtos

Endpoints disponíveis:
  GET  http://localhost:3001/produtos
  POST http://localhost:3001/produtos
```

✅ **Checkpoint:** Abra `http://localhost:3001/produtos` no navegador - deve mostrar JSON

---

## Passo 2: Frontend

**Abra OUTRO terminal:**

```bash
cd exemplo_02/frontend
npm install
npm start
```

**Deve:**

- Instalar `http-server` (~10 segundos)
- Abrir browser automaticamente em `http://localhost:3000`
- Mostrar produtos do lado esquerdo

✅ **Checkpoint:** Página carregou com 3 produtos à esquerda

---

## Passo 3: Configurar Token Groq

1. Edite `frontend/config.js`
2. Substitua `COLOCAR_SEU_TOKEN_GROQ_AQUI` pelo seu token
3. Salve (Ctrl+S)
4. **Recarregue** a página no navegador (F5)

**Obter token:** https://console.groq.com/keys

✅ **Checkpoint:** Chat responde "👋 Olá! Sou seu assistente..."

---

## 🧪 Testar

No chat, digite:

```
Liste os produtos
```

**Deve responder** com os 3 produtos!

Depois:

```
Crie um produto chamado Webcam por R$ 300 na categoria Periféricos
```

**Produto deve aparecer** na lista à esquerda!

---

## 🛑 Para Parar

- Backend: `Ctrl+C` no terminal
- Frontend: `Ctrl+C` no terminal do http-server

---

## ⚡ Quick Start (1 Linha)

Se já tiver tudo instalado:

```bash
cd exemplo_02/backend && npm start
```

**Outro terminal:**

```bash
cd exemplo_02/frontend && npm start
```

---

**🎉 Pronto para usar!**
