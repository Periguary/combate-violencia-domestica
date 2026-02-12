import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Denuncia() {
  const [step, setStep] = useState<'form' | 'confirmation' | 'tracking'>('form');
  const [showToken, setShowToken] = useState(false);
  const [denunciaToken, setDenunciaToken] = useState('');
  const [denunciaId, setDenunciaId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    tipoViolencia: '',
    descricao: '',
    nomeVitima: '',
    idadeVitima: '',
    telefone: '',
    email: '',
    endereco: '',
    dataOcorrencia: '',
    testemunhas: '',
    observacoes: '',
  });

  const criarDenuncia = trpc.denuncias.criar.useMutation({
    onSuccess: (data) => {
      setDenunciaToken(data.token);
      setDenunciaId(data.id);
      setStep('confirmation');
      toast.success('Denúncia registrada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao registrar denúncia');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipoViolencia || !formData.descricao) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    criarDenuncia.mutate({
      tipoViolencia: formData.tipoViolencia,
      descricao: formData.descricao,
      nomeVitima: formData.nomeVitima || undefined,
      idadeVitima: formData.idadeVitima ? parseInt(formData.idadeVitima) : undefined,
      telefone: formData.telefone || undefined,
      email: formData.email || undefined,
      endereco: formData.endereco || undefined,
      dataOcorrencia: formData.dataOcorrencia || undefined,
      testemunhas: formData.testemunhas || undefined,
      observacoes: formData.observacoes || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(denunciaToken);
    toast.success('Token copiado para a área de transferência');
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Denúncia Anônima</h1>
          </div>
          <p className="text-muted-foreground">
            Sua denúncia é criptografada e 100% anônima. Seus dados pessoais nunca serão compartilhados.
          </p>
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <Card className="p-6 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Seus dados estão protegidos</h3>
                  <p className="text-sm text-blue-800">
                    Utilizamos criptografia AES-256-GCM para proteger suas informações. Nenhum dado pessoal será armazenado sem criptografia.
                  </p>
                </div>
              </div>

              {/* Tipo de Violência */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Violência *
                </label>
                <select
                  name="tipoViolencia"
                  value={formData.tipoViolencia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione um tipo</option>
                  <option value="fisica">Violência Física</option>
                  <option value="psicologica">Violência Psicológica</option>
                  <option value="sexual">Violência Sexual</option>
                  <option value="patrimonial">Violência Patrimonial</option>
                  <option value="moral">Violência Moral</option>
                  <option value="intrafamiliar">Violência Intrafamiliar</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição da Situação * (mínimo 10 caracteres)
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows={5}
                  placeholder="Descreva detalhadamente a situação de violência..."
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Informações Opcionais */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">Informações Adicionais (Opcionais)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da Vítima</label>
                    <input
                      type="text"
                      name="nomeVitima"
                      value={formData.nomeVitima}
                      onChange={handleChange}
                      placeholder="Pode ser anônimo"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Idade da Vítima</label>
                    <input
                      type="number"
                      name="idadeVitima"
                      value={formData.idadeVitima}
                      onChange={handleChange}
                      placeholder="Ex: 25"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(XX) XXXXX-XXXX"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Endereço do Fato</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro, cidade"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Data da Ocorrência</label>
                  <input
                    type="date"
                    name="dataOcorrencia"
                    value={formData.dataOcorrencia}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Testemunhas</label>
                  <textarea
                    name="testemunhas"
                    value={formData.testemunhas}
                    onChange={handleChange}
                    placeholder="Nomes ou descrição de testemunhas"
                    rows={2}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Observações</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Informações adicionais relevantes"
                    rows={2}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={criarDenuncia.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {criarDenuncia.isPending ? 'Registrando...' : 'Registrar Denúncia'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Confirmation Step */}
        {step === 'confirmation' && (
          <Card className="p-6 border border-border">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">Denúncia Registrada!</h2>
              <p className="text-muted-foreground">
                Sua denúncia foi registrada com sucesso e está criptografada.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Guarde este token com segurança</h3>
                <p className="text-sm text-amber-800">
                  Use este token para acompanhar o status de sua denúncia. Não o compartilhe com ninguém.
                </p>
              </div>
            </div>

            {/* Token Display */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Seu Token de Rastreamento:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm break-all">
                  {showToken ? denunciaToken : '•'.repeat(denunciaToken.length)}
                </code>
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="p-2 hover:bg-gray-200 rounded"
                  title={showToken ? 'Ocultar' : 'Mostrar'}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Copiar
                </button>
              </div>
            </div>

            {/* ID Display */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">ID da Denúncia:</p>
              <p className="font-mono text-lg">{denunciaId}</p>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos Passos:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Guarde seu token em local seguro</li>
                <li>Sua denúncia será analisada por profissionais treinados</li>
                <li>Você pode acompanhar o status usando seu token</li>
                <li>Ações apropriadas serão tomadas conforme necessário</li>
              </ol>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setStep('form');
                  setFormData({
                    tipoViolencia: '',
                    descricao: '',
                    nomeVitima: '',
                    idadeVitima: '',
                    telefone: '',
                    email: '',
                    endereco: '',
                    dataOcorrencia: '',
                    testemunhas: '',
                    observacoes: '',
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Fazer Outra Denúncia
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Voltar ao Início
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
