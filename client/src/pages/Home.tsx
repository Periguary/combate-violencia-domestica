import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Heart, Scale, Users, AlertCircle, BookOpen } from "lucide-react";

/**
 * Home Page - Combate a Violencia Domestica
 * Design: Institutional Minimalism with Purpose
 * Color Palette: Deep Blue (#1e3a8a) + Soft Beige (#f5f1e8) + Soft Red (#dc2626)
 * Typography: Playfair Display (titles) + Source Sans Pro (body)
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}\n      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Combate a Violencia Domestica</h1>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#inicio" className="text-sm font-medium hover:text-primary transition">
              Inicio
            </a>
            <a href="#tipos" className="text-sm font-medium hover:text-primary transition">
              Tipos de Violencia
            </a>
            <a href="#denunciar" className="text-sm font-medium hover:text-primary transition">
              Como Denunciar
            </a>
            <a href="#ods" className="text-sm font-medium hover:text-primary transition">
              ODS 16
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-primary to-primary/90 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Voce nao esta sozinho
              </h2>
              <p className="text-lg mb-8 text-primary-foreground opacity-90">
                A violencia domestica e um problema serio que afeta milhoes de pessoas. Este site oferece informacoes, recursos e orientacoes para ajudar vitimas, familiares e profissionais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold">
                  <Phone className="w-5 h-5 mr-2" />
                  Ligue 180
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Saiba Mais
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/99ymdjzbK58iwsMUYH1TK6/sandbox/LT1JJJn3tA0fTkIrVRPL42-img-1_1770737123000_na1fn_aGVyby1iYW5uZXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOTl5bWRqemJLNThpd3NNVVlIMVRLNi9zYW5kYm94L0xUMUpKSm4zdEEwZlRrSXJWUlBMNDItaW1nLTFfMTc3MDczNzEyMzAwMF9uYTFmbl9hR1Z5YnkxaVlXNXVaWEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=DgIOxnN5~~KRiDYhF~DllRrws06pOaxC1IwVqAHqeSuYkTQm~OnNAZGFJuldeq59oHNczj9fG6qH8jwPgqtySGL-QN3De~KCnhK4seFnqSnrOTBViqsQW8JtzcNCMzVeA15at25rKmVUWcjK7KhLnm2E8le0Enu5T2aMzJVB~58b6Qecp0sm0YxoWZ-rGqfSkwL-Po1Qa~dPc5CUMJo86W~-Bkfzoq-OBG-JmBRcvwhAhQ0WrOuZci5wlUsroHpmyVaHOFU37Iw2-9hMN2c98YrzKBrsUZ-am4RYdAmfeYFqfOdZaSLz6MKXnPfbT3ei59aPG5whhfloLYg8ho8itw__"
                alt="Hands together in support"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Alert */}
      <section className="bg-destructive/10 border-l-4 border-destructive py-6">
        <div className="container flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-destructive mb-2">Em Situacao de Emergencia?</h3>
            <p className="text-sm mb-3">
              Se voce esta em perigo imediato, ligue para a Policia Militar (190) ou procure uma delegacia mais proxima.
            </p>
            <p className="text-sm">
              <strong>Ligue 180:</strong> Central de Atendimento a Mulher (24h, gratuito e confidencial)
            </p>
          </div>
        </div>
      </section>

      {/* Types of Violence Section */}
      <section id="tipos" className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-primary">Tipos de Violencia Domestica</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            A Lei Maria da Penha reconhece cinco tipos de violencia domestica e familiar contra a mulher. Compreender cada tipo e fundamental para identificar situacoes de abuso.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Violencia Fisica",
                description: "Qualquer conduta que ofenda a integridade ou saude corporal, como agressoes, espancamentos, queimaduras ou lesoes.",
                icon: AlertCircle
              },
              {
                title: "Violencia Psicologica",
                description: "Dano emocional, diminuicao da autoestima, humilhacao, isolamento, controle e intimidacao que prejudicam o desenvolvimento.",
                icon: Heart
              },
              {
                title: "Violencia Sexual",
                description: "Constranger a presenciar, manter ou participar de relacao sexual nao desejada mediante forca, ameaca ou coacacao.",
                icon: AlertCircle
              },
              {
                title: "Violencia Patrimonial",
                description: "Retencao, subtracao, destruicao ou danificacao de bens, documentos, instrumentos de trabalho ou valores da vitima.",
                icon: AlertCircle
              },
              {
                title: "Violencia Moral",
                description: "Calunia, difamacao ou injuria contra a mulher, prejudicando sua honra e reputacao.",
                icon: AlertCircle
              },
              {
                title: "Violencia Intrafamiliar",
                description: "Violencia que ocorre no ambito familiar, incluindo relacoes de parentesco, convivio ou afeto, nao apenas com parceiros.",
                icon: Users
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} className="p-6 hover:shadow-md transition border-l-4 border-l-primary">
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-primary mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Network */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-primary">Rede de Apoio e Suporte</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            Diversos orgaos e organizacoes trabalham juntos para oferecer protecao, acolhimento e justica as vitimas de violencia domestica.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/99ymdjzbK58iwsMUYH1TK6/sandbox/LT1JJJn3tA0fTkIrVRPL42-img-2_1770737113000_na1fn_c3VwcG9ydC1uZXR3b3Jr.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOTl5bWRqemJLNThpd3NNVVlIMVRLNi9zYW5kYm94L0xUMUpKSm4zdEEwZlRrSXJWUlBMNDItaW1nLTJfMTc3MDczNzExMzAwMF9uYTFmbl9jM1Z3Y0c5eWRDMXVaWFIzYjNKci5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=mcU27q-tnsW-zRsgVcDH~yDC9eEIehFV2Zi9i3X7h56RhHY9--jp9dfpeVPPHnFCSAAHCcei9ak~gSSkiX1YVZc2rjtLkxxly77i9MZJV9UPPbSXC67Zbu~CfnDy9iYuk10nve8liYAGNw4--Dofth5fq4gUKQ8RaEoe~LbUdImcgPfCh7h6zXZnBtS10-jeuuHKlYuIYxLzCwzuyEtSDI0a18M-1QSz-SDwIPBHoucmzL9JuXLN9VhTnRfjhw2o7o-sEHBCg3zWTk2ViPl7BLYYXQ4tEMNIhSNW2gQritmcUB09tNzBIYebeG2ge-FnklQsEQI2qud8quaOeL3iMw__"
                alt="Support Network"
                className="w-full max-w-md"
              />
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2">Policia e Seguranca</h3>
                  <p className="text-sm text-muted-foreground">
                    Delegacias especializadas em violencia domestica (DEAM) oferecem atendimento especializado e registro de ocorrencias.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2">Saude e Assistencia</h3>
                  <p className="text-sm text-muted-foreground">
                    Centros de Referencia de Assistencia Social (CRAS) e CREAS oferecem acompanhamento psicossocial e apoio integral.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Scale className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2">Justica e Direitos</h3>
                  <p className="text-sm text-muted-foreground">
                    Defensoria Publica e ONGs oferecem orientacao juridica e apoio na obtencao de medidas protetivas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Report */}
      <section id="denunciar" className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-primary">Como Denunciar</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            Existem varias formas seguras e confidenciais de denunciar violencia domestica. Escolha a que se sinta mais confortavel.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-l-4 border-l-accent">
              <h3 className="text-xl font-bold text-primary mb-4">Ligue 180</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Central de Atendimento a Mulher oferece orientacao, informacoes sobre direitos e encaminhamento para servicos de protecao.
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="font-bold text-primary text-lg">180</p>
                <p className="text-xs text-muted-foreground mt-2">24 horas | Gratuito | Confidencial</p>
              </div>
            </Card>

            <Card className="p-8 border-l-4 border-l-accent">
              <h3 className="text-xl font-bold text-primary mb-4">Delegacia da Mulher (DEAM)</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Registre uma ocorrencia policial de forma especializada. Procure a delegacia mais proxima de sua casa.
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="font-bold text-primary">Presencialmente</p>
                <p className="text-xs text-muted-foreground mt-2">Leve documentos de identificacao</p>
              </div>
            </Card>

            <Card className="p-8 border-l-4 border-l-accent">
              <h3 className="text-xl font-bold text-primary mb-4">Disque 190</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Policia Militar para situacoes de emergencia e risco imediato. Use para denuncias urgentes.
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="font-bold text-primary text-lg">190</p>
                <p className="text-xs text-muted-foreground mt-2">Emergencias | Imediato</p>
              </div>
            </Card>

            <Card className="p-8 border-l-4 border-l-accent">
              <h3 className="text-xl font-bold text-primary mb-4">CRAS/CREAS</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Centros de Assistencia Social oferecem acolhimento, orientacao e encaminhamento para medidas protetivas.
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="font-bold text-primary">Presencialmente</p>
                <p className="text-xs text-muted-foreground mt-2">Procure o mais proximo de voce</p>
              </div>
            </Card>
          </div>

          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-lg font-bold text-primary mb-4">Passos para Denunciar</h3>
            <ol className="space-y-4 text-sm">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>
                  <strong>Procure ajuda:</strong> Entre em contato com um dos canais acima ou confie em alguem de confianca.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>
                  <strong>Reuna informacoes:</strong> Anote datas, horarios, locais e testemunhas dos incidentes.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>
                  <strong>Registre a ocorrencia:</strong> Faca o registro na delegacia ou atraves do Ligue 180.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <span>
                  <strong>Solicite medidas protetivas:</strong> Voce tem direito a medidas de protecao imediata.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <span>
                  <strong>Acompanhamento:</strong> Procure apoio psicossocial e juridico durante o processo.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ODS 16 Section */}
      <section id="ods" className="py-20 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-primary">ODS 16: Paz, Justica e Instituicoes Eficazes</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            Este projeto esta alinhado com o Objetivo de Desenvolvimento Sustentavel 16 das Nacoes Unidas, que busca promover sociedades pacificas e inclusivas.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-primary mb-3">Meta 16.1: Reduzir Violencia</h3>
                <p className="text-sm text-muted-foreground">
                  Reduzir significativamente todas as formas de violencia e as taxas de mortalidade relacionada em todos os lugares, incluindo violencia domestica.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary mb-3">Meta 16.2: Proteger Criancas</h3>
                <p className="text-sm text-muted-foreground">
                  Acabar com o abuso, exploracao, trafico e todas as formas de violencia e tortura contra criancas, incluindo violencia domestica.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary mb-3">Meta 16.3: Acesso a Justica</h3>
                <p className="text-sm text-muted-foreground">
                  Promover o estado de direito e igualdade de acesso a justica para todos, garantindo que vitimas tenham acesso a medidas protetivas e processos judiciais.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/99ymdjzbK58iwsMUYH1TK6/sandbox/LT1JJJn3tA0fTkIrVRPL42-img-3_1770737113000_na1fn_b2RzMTYtdmlzdWFs.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOTl5bWRqemJLNThpd3NNVVlIMVRLNi9zYW5kYm94L0xUMUpKSm4zdEEwZlRrSXJWUlBMNDItaW1nLTNfMTc3MDczNzExMzAwMF9uYTFmbl9iMlJ6TVRZdGRtbHpkV0ZzLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=SmrUhiXdDTvIBLyPvvitXg5TX15yRlao3PCaHwF3gdQEh4tVcmtaz-3je5oqlTuG4yyNvAJZ~BlCuMUyJ8YCkm18DuYcbIUOqwRJLdliQuic9tRaomyJqSwF-KVKC4kp8RyNctRicEe~BCAzpBt1VuIml6imrZ7~DHLeJZ9qpgCLzwjdy-D2xJqqKksCHpG55gz6scxIg-hKYE97nXAMNpg5BXs3tfnBgOjyAwVCVeWKIakUV4zWImZAKO32-SJO0eyHqeTzOF4OS~gy6xzYk6aLgzeDoWTyuQhwdeDTlQcp6P049SYEm5pKFQjTgpJLAEJ5Wi~L65hD7sMyGi4u0w__"
                alt="ODS 16 - Peace, Justice and Strong Institutions"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-primary">Recursos e Documentos</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            Acesse documentos oficiais, cartilhas informativas e legislacao sobre violencia domestica.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href="https://www.gov.br/mdh/pt-br/navegue-por-temas/politicas-para-mulheres/arquivo/arquivos-diversos/sev/pacto/documentos/politica-nacional-enfrentamento-a-violencia-versao-final.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                <BookOpen className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-primary mb-2">Politica Nacional de Enfrentamento a Violencia</h3>
                <p className="text-sm text-muted-foreground">
                  Documento oficial do Ministerio dos Direitos Humanos sobre politicas de prevencao a violencia contra as mulheres.
                </p>
              </Card>
            </a>

            <a 
              href="https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                <Scale className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-primary mb-2">Lei no 11.340/2006 (Lei Maria da Penha)</h3>
                <p className="text-sm text-muted-foreground">
                  Legislacao federal que cria mecanismos para coibir a violencia domestica e familiar contra a mulher.
                </p>
              </Card>
            </a>

            <a 
              href="https://www.gov.br/pt-br/servicos/denunciar-e-buscar-ajuda-a-vitimas-de-violencia-contra-mulheres" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                <Phone className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-primary mb-2">Ligue 180 - Central de Atendimento</h3>
                <p className="text-sm text-muted-foreground">
                  Servico de utilidade publica oferecido pelo governo federal para orientacao e denuncia de violencia contra mulheres.
                </p>
              </Card>
            </a>

            <a 
              href="https://www.institutomariadapenha.org.br/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                <Heart className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-primary mb-2">Instituto Maria da Penha</h3>
                <p className="text-sm text-muted-foreground">
                  Organizacao dedicada ao combate a violencia domestica com informacoes, cartilhas e recursos educativos.
                </p>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Combate a Violencia Domestica
              </h3>
              <p className="text-sm opacity-90">
                Projeto de Ensino Extensionista vinculado ao ODS 16 - Paz, Justica e Instituicoes Eficazes.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contatos Rapidos</h4>
              <ul className="text-sm space-y-2 opacity-90">
                <li>Ligue 180 (24h)</li>
                <li>Disque 190 (Emergencias)</li>
                <li>CRAS/CREAS (Assistencia)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navegacao</h4>
              <ul className="text-sm space-y-2 opacity-90">
                <li>
                  <a href="#tipos" className="hover:underline">
                    Tipos de Violencia
                  </a>
                </li>
                <li>
                  <a href="#denunciar" className="hover:underline">
                    Como Denunciar
                  </a>
                </li>
                <li>
                  <a href="#ods" className="hover:underline">
                    ODS 16
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-75">
            <p>© 2026 Combate a Violencia Domestica. Todos os direitos reservados.</p>
            <p className="mt-2">Desenvolvido como Projeto de Ensino Extensionista | Prazo Final: 31/12/2028</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
