-- ===================================================
-- 🗄️ SCHEMA DO BANCO DE DADOS - RECEITAS
-- ===================================================
--
-- Execute este SQL no Neon SQL Editor para criar a tabela
-- e inserir dados iniciais.
--
-- Como acessar o SQL Editor:
-- 1. Acesse https://console.neon.tech/app/projects/round-flower-02803473
-- 2. Clique em "SQL Editor" no menu lateral
-- 3. Cole e execute este código
--
-- ===================================================

-- Criar tabela de receitas
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  ingredientes TEXT[] NOT NULL,
  modo_preparo TEXT NOT NULL,
  tempo_preparo INTEGER,
  porcoes INTEGER,
  dificuldade VARCHAR(20) CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
  categoria VARCHAR(50),
  imagem_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_recipes_categoria ON recipes(categoria);
CREATE INDEX IF NOT EXISTS idx_recipes_dificuldade ON recipes(dificuldade);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- ===================================================
-- 🌱 DADOS INICIAIS (SEED)
-- ===================================================

-- Inserir receitas de exemplo
INSERT INTO recipes (titulo, descricao, ingredientes, modo_preparo, tempo_preparo, porcoes, dificuldade, categoria) VALUES
(
  'Bolo de Chocolate',
  'Bolo fofinho e delicioso de chocolate, perfeito para qualquer ocasião',
  ARRAY[
    '2 ovos',
    '1 xícara de açúcar',
    '1 xícara de farinha de trigo',
    '1/2 xícara de chocolate em pó',
    '1/2 xícara de óleo',
    '1 xícara de água quente',
    '1 colher (sopa) de fermento em pó'
  ],
  E'1. Pré-aqueça o forno a 180°C.\n2. Em uma tigela, misture os ingredientes secos: farinha, açúcar, chocolate em pó e fermento.\n3. Adicione os ovos e o óleo, mexendo bem.\n4. Por último, adicione a água quente e misture até ficar homogêneo.\n5. Despeje em forma untada e enfarinhada.\n6. Leve ao forno por 40 minutos.\n7. Faça o teste do palito antes de retirar.\n8. Deixe esfriar antes de desenformar.',
  40,
  8,
  'medio',
  'doce'
),
(
  'Salada Caesar',
  'Salada clássica americana, refrescante e saborosa',
  ARRAY[
    '1 pé de alface romana',
    '200g de frango grelhado em cubos',
    '1/2 xícara de croutons',
    '50g de queijo parmesão ralado',
    '4 colheres (sopa) de molho Caesar',
    'Suco de 1/2 limão',
    'Sal e pimenta a gosto'
  ],
  E'1. Lave e seque bem a alface romana.\n2. Corte a alface em tiras médias.\n3. Grelhe o frango e corte em cubos.\n4. Em uma saladeira grande, coloque a alface.\n5. Adicione o frango grelhado por cima.\n6. Espalhe os croutons.\n7. Regue com molho Caesar e suco de limão.\n8. Finalize com parmesão ralado.\n9. Misture delicadamente e sirva.',
  15,
  2,
  'facil',
  'salgado'
),
(
  'Brigadeiro',
  'Doce tradicional brasileiro, perfeito para festas',
  ARRAY[
    '1 lata de leite condensado',
    '2 colheres (sopa) de chocolate em pó',
    '1 colher (sopa) de manteiga',
    'Chocolate granulado para decorar'
  ],
  E'1. Em uma panela, coloque o leite condensado, chocolate em pó e manteiga.\n2. Cozinhe em fogo médio-baixo, mexendo sempre.\n3. Continue mexendo até a mistura desgrudar do fundo da panela (ponto de brigadeiro).\n4. Despeje em um prato untado com manteiga.\n5. Deixe esfriar completamente.\n6. Unte as mãos com manteiga.\n7. Faça bolinhas com a massa.\n8. Passe no chocolate granulado.\n9. Coloque em forminhas de papel.',
  20,
  30,
  'facil',
  'doce'
);

-- ===================================================
-- ✅ VERIFICAR INSERÇÃO
-- ===================================================

-- Executar para ver se as receitas foram criadas:
SELECT titulo, categoria, dificuldade FROM recipes ORDER BY id;

-- Deve retornar 3 receitas:
-- 1. Bolo de Chocolate (doce, medio)
-- 2. Salada Caesar (salgado, facil)
-- 3. Brigadeiro (doce, facil)

-- ===================================================
-- 🎉 PRONTO! Banco configurado!
-- ===================================================

