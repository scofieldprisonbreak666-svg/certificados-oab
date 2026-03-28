// Cole suas credenciais do Supabase aqui
const SUPABASE_URL = 'https://kljjztrlojnckaibbcug.supabase.co'
const SUPABASE_KEY = 'sb_publishable_5CaB6jJ_0w-7UxQyXTgXXg_DczjvJTp'

const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_KEY)

// Registrar voto
async function votar(opcao) {
  await db.from('votos').insert({ opcao })
  alert('Voto registrado! ✅')
}

// Carregar e mostrar resultados
async function carregarResultados() {
  const { data } = await db.from('votos').select('opcao')

  const contagem = {}
  data.forEach(v => {
    contagem[v.opcao] = (contagem[v.opcao] || 0) + 1
  })

  const total = data.length || 1
  const div = document.getElementById('resultados')
  div.innerHTML = ''

  for (const [opcao, qtd] of Object.entries(contagem)) {
    const pct = Math.round((qtd / total) * 100)
    div.innerHTML += `
      <div class="resultado-item">
        <span>${opcao} — ${qtd} votos (${pct}%)</span>
        <div class="barra-fundo">
          <div class="barra" style="width: ${pct}%"></div>
        </div>
      </div>`
  }
}

// Atualização em tempo real (sem dar F5!)
db.channel('votos')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votos' },
    () => carregarResultados()
  ).subscribe()

// Carrega ao abrir a página
carregarResultados()