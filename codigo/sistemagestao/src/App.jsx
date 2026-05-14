import { useState, useEffect, useCallback } from "react";

//Mock API (substitui axios quando for rodar fora do backend)

const mockDb = {
  categorias: [
    { id: 1, nome: "Serviços" },
    { id: 2, nome: "Material" },
    { id: 3, nome: "Transporte" },
    { id: 4, nome: "Tecnologia" },
    { id: 5, nome: "Treinamento" },
  ],
  solicitantes: [
    { id: 1, nome: "Ana Paula Ferreira",     cpfCnpj: "123.456.789-00" },
    { id: 2, nome: "Carlos Eduardo Lima",    cpfCnpj: "987.654.321-11" },
    { id: 3, nome: "Fernanda Souza Costa",   cpfCnpj: "11.222.333/0001-44" },
    { id: 4, nome: "Roberto Mendes Alves",   cpfCnpj: "555.666.777-88" },
    { id: 5, nome: "Juliana Oliveira Santos",cpfCnpj: "999.888.777-66" },
  ],
  solicitacoes: [
    { id: 1, solicitanteId: 1, categoriaId: 1, descricao: "Contratação de serviço de limpeza predial mensal",        valor: 1500.00, dataSolicitacao: "2026-04-01", status: "SOLICITADO"  },
    { id: 2, solicitanteId: 2, categoriaId: 2, descricao: "Compra de material de escritório para o setor TI",         valor:  890.50, dataSolicitacao: "2026-04-05", status: "LIBERADO"   },
    { id: 3, solicitanteId: 3, categoriaId: 3, descricao: "Fretamento de ônibus para evento corporativo",            valor: 3200.00, dataSolicitacao: "2026-04-08", status: "APROVADO"   },
    { id: 4, solicitanteId: 4, categoriaId: 4, descricao: "Renovação de licenças de software Adobe Creative",        valor: 4750.00, dataSolicitacao: "2026-04-10", status: "REJEITADO"  },
    { id: 5, solicitanteId: 5, categoriaId: 5, descricao: "Inscrição em curso de capacitação em gestão de projetos", valor:  600.00, dataSolicitacao: "2026-04-12", status: "CANCELADO"  },
    { id: 6, solicitanteId: 1, categoriaId: 4, descricao: "Aquisição de notebooks para equipe de desenvolvimento",  valor:18900.00, dataSolicitacao: "2026-04-15", status: "SOLICITADO"  },
    { id: 7, solicitanteId: 2, categoriaId: 1, descricao: "Manutenção preventiva dos ar-condicionados",              valor: 2100.00, dataSolicitacao: "2026-04-18", status: "LIBERADO"   },
    { id: 8, solicitanteId: 3, categoriaId: 2, descricao: "Compra de cartuchos e tonners para impressoras",          valor:  430.00, dataSolicitacao: "2026-04-20", status: "SOLICITADO"  },
  ],
  nextId: 9,
};
  ]
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
