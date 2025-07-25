import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, MapPin, User, Phone, FileText, Clock, CheckCircle, ArrowLeft, Building, Stethoscope, ChevronDown } from 'lucide-react';

const formatarCelular = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

const formatarCPF = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatarCelularExibicao = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

const formatarCPFExibicao = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Componente de Calendário Customizado
const CustomCalendar = ({ datasDisponiveis, agendamento, setAgendamento }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const isDateAvailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return datasDisponiveis.some(d => d.data === dateString);
  };

  const getAvailableSlots = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return datasDisponiveis.find(d => d.data === dateString);
  };

  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setAgendamento({...agendamento, data: date.toISOString().split('T')[0], turno: ''});
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const selectedSlots = selectedDate ? getAvailableSlots(selectedDate) : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <h3 className="text-lg font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={index} className="p-2"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const available = isDateAvailable(date);
            const isSelected = selectedDate && 
              selectedDate.getDate() === day && 
              selectedDate.getMonth() === currentMonth.getMonth();
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={!available}
                className={`p-2 text-sm rounded transition-colors ${
                  available 
                    ? isSelected
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-50 text-gray-900'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {day}
                {available && (
                  <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {selectedSlots && (
        <div className="p-6">
          <h4 className="font-medium mb-3">
            Horários Disponíveis - {selectedDate.toLocaleDateString('pt-BR')}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {selectedSlots.vagasManha > 0 && (
              <label
                className={`p-4 border rounded-lg cursor-pointer text-center transition-colors ${
                  agendamento.turno === 'manha'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <input
                  type="radio"
                  value="manha"
                  checked={agendamento.turno === 'manha'}
                  onChange={(e) => setAgendamento({...agendamento, turno: e.target.value})}
                  className="sr-only"
                />
                <div className="font-medium">Manhã</div>
                <div className="text-sm text-gray-600">8h às 12h</div>
                <div className="text-xs text-green-600">{selectedSlots.vagasManha} vagas</div>
              </label>
            )}
            {selectedSlots.vagasTarde > 0 && (
              <label
                className={`p-4 border rounded-lg cursor-pointer text-center transition-colors ${
                  agendamento.turno === 'tarde'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <input
                  type="radio"
                  value="tarde"
                  checked={agendamento.turno === 'tarde'}
                  onChange={(e) => setAgendamento({...agendamento, turno: e.target.value})}
                  className="sr-only"
                />
                <div className="font-medium">Tarde</div>
                <div className="text-sm text-gray-600">13h às 17h</div>
                <div className="text-xs text-green-600">{selectedSlots.vagasTarde} vagas</div>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Step1 = ({ userData, handleUserDataChange, setCurrentStep, canProceedStep1, cidades }) => (
  <div className="min-h-screen"
    style={{backgroundImage: "url('/imgCentral.jpg')", backgroundSize:"cover", backgroundPosition: "center"}}>
    <div className="bg-white/70  shadow rounded-lg ">
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-6 ">
        <div className="flex items-center ">
          <Calendar className="h-9 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 ">Sistema de Agendamento</h1>
            <p className="text-gray-600">Agende sua consulta médica online</p>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="shadow rounded-lg overflow-hidden">
        
          <div className="bg-white/100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Dados Pessoais</h2>
            <p className="text-sm text-gray-500">Preencha suas informações para continuar</p>
         </div>
          
    <div className="p-6 space-y-6 bg-white/70" > 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={userData.nomeCompleto}
                  onChange={(e) => handleUserDataChange('nomeCompleto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Celular
                </label>
                <input
                  type="tel"
                  value={userData.celular}
                  onChange={(e) => handleUserDataChange('celular', formatarCelular(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Cidade
                </label>
                <div className="relative">
                  <select
                    value={userData.cidade}
                    onChange={(e) => handleUserDataChange('cidade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">Selecione sua cidade</option>
                    {cidades.map(cidade => (
                      <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Documento
              </label>
              <div className="flex gap-6 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cpf"
                    checked={userData.tipoDocumento === 'cpf'}
                    onChange={(e) => handleUserDataChange('tipoDocumento', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">CPF</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="sus"
                    checked={userData.tipoDocumento === 'sus'}
                    onChange={(e) => handleUserDataChange('tipoDocumento', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Carteira do SUS</span>
                </label>
              </div>
              <input
                type="text"
                value={userData.documento}
                onChange={(e) => {
                  const value = userData.tipoDocumento === 'cpf' 
                    ? formatarCPF(e.target.value)
                    : e.target.value;
                  handleUserDataChange('documento', value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={userData.tipoDocumento === 'cpf' ? '123.456.789-01' : 'Número da Carteira do SUS'}
              />
              {userData.tipoDocumento === 'sus' && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ Não tenho CPF - usando Carteira do SUS
                </p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-center">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!canProceedStep1 || userData.cidade ===''}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                canProceedStep1
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Step2 = ({ 
  userData, 
  agendamento, 
  handleAgendamentoChange, 
  setCurrentStep, 
  canProceedStep2,
  unidadesPorCidade,
  servicos,
  datasDisponiveis,
  setAgendamento
}) => (
  <div className="min-h-screen "
    style={{backgroundImage: "url('/imgCentral.jpg')", backgroundSize:"cover", backgroundPosition: "center",}}>
    
    <div className="bg-white/70 shadow rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="">
          <button
            onClick={() => setCurrentStep(1)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Escolha sua consulta</h1>
            <p className="text-gray-600">Cidade: {userData.cidade}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap">
        <div className="space-y-6">
          {/* Seleção de Unidade */}
          <div className=" shadow rounded-lg">
            <div className="bg-white/100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Unidade de Saúde
              </h3>
            </div>
            <div className="bg-white/70 p-6">
              <div className="relative">
                <select
                  value={agendamento.unidade}
                  onChange={(e) => handleAgendamentoChange('unidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">Selecione uma unidade</option>
                  {unidadesPorCidade[userData.cidade]?.map(unidade => (
                    <option key={unidade.id} value={unidade.nome}>
                      {unidade.nome} - {unidade.endereco}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Seleção de Serviço */}
          <div className=" shadow rounded-lg">
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Tipo de Serviço
              </h3>
            </div>
            <div className="bg-white/70 p-6">
              <div className="relative">
                <select
                  value={agendamento.servico}
                  onChange={(e) => handleAgendamentoChange('servico', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map(servico => (
                    <option key={servico.id} value={servico.nome}>
                      {servico.icon} {servico.nome}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendário */}
        {agendamento.unidade && agendamento.servico && (
          <div className="bg-white shadow rounded-lg mt-2 lg:mt-0 lg:ml-2">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Data e Horário
              </h3>
            </div>
            <CustomCalendar 
              datasDisponiveis={datasDisponiveis}
              agendamento={agendamento}
              setAgendamento={setAgendamento}
            />
          </div>
        )}
      </div>

      {canProceedStep2 && (
        <div className="br-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between rounded-lg bg-white">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
            >
              Voltar
            </button>
          <button
            onClick={() => setCurrentStep(3)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  </div>
);

const Step3 = ({ 
  userData, 
  agendamento, 
  setCurrentStep, 
  datasDisponiveis,
  confirmarAgendamento
}) => {
  const dataEscolhida = datasDisponiveis.find(d => d.data === agendamento.data);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Confirmar Agendamento</h1>
              <p className="text-gray-600">Revise os dados antes de confirmar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Resumo do Agendamento</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Dados Pessoais</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nome</dt>
                    <dd className="text-sm text-gray-900">{userData.nomeCompleto}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Celular</dt>
                    <dd className="text-sm text-gray-900">{formatarCelularExibicao(userData.celular)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">{userData.tipoDocumento.toUpperCase()}</dt>
                    <dd className="text-sm text-gray-900">
                      {userData.tipoDocumento === 'cpf' ? formatarCPFExibicao(userData.documento) : userData.documento}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cidade</dt>
                    <dd className="text-sm text-gray-900">{userData.cidade}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Dados da Consulta</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Unidade</dt>
                    <dd className="text-sm text-gray-900">{agendamento.unidade}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Serviço</dt>
                    <dd className="text-sm text-gray-900">{agendamento.servico}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Data</dt>
                    <dd className="text-sm text-gray-900">{dataEscolhida?.dataFormatada}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Período</dt>
                    <dd className="text-sm text-gray-900">
                      {agendamento.turno === 'manha' ? 'Manhã (8h às 12h)' : 'Tarde (13h às 17h)'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">Instruções Importantes:</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Chegue com 15 minutos de antecedência
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Traga um documento com foto
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Leve a carteirinha do SUS se tiver
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Em caso de impossibilidade de comparecimento, cancele com antecedência
                </li>
              </ul>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
            >
              Voltar
            </button>
            <button
              onClick={confirmarAgendamento}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              Confirmar Agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgendamentoConsultas = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    nomeCompleto: '',
    celular: '',
    documento: '',
    tipoDocumento: 'cpf',
    cidade: ''
  });
  
  const [agendamento, setAgendamento] = useState({
    unidade: '',
    servico: '',
    data: '',
    turno: ''
  });

  const confirmarAgendamento = useCallback(() => {
    const novoAgendamento = {
      id: Date.now(),
      ...userData,
      ...agendamento,
      status: 'confirmado',
      dataAgendamento: new Date().toISOString()
    };
    
    alert('Consulta agendada com sucesso! Número do agendamento: ' + novoAgendamento.id);
    
    setCurrentStep(1);
    setUserData({
      nomeCompleto: '',
      celular: '',
      documento: '',
      tipoDocumento: 'cpf',
      cidade: ''
    });
    setAgendamento({
      unidade: '',
      servico: '',
      data: '',
      turno: ''
    });
  }, [userData, agendamento]);

  const cidades = useMemo(() => [
    { id: 1, nome: 'São luis' },
    { id: 2, nome: 'Imperatriz' },
    { id: 3, nome: 'Balsas' }
  ], []);

  const unidadesPorCidade = useMemo(() => ({
    'São luis': [
      { id: 1, nome: 'UBS Central São Paulo', endereco: 'Rua das Flores, 123' },
      { id: 2, nome: 'UBS Vila Madalena', endereco: 'Av. Paulista, 456' },
      { id: 3, nome: 'UBS Mooca', endereco: 'Rua da Mooca, 789' }
    ],
    'Imperatriz': [
      { id: 4, nome: 'UBS Copacabana', endereco: 'Av. Atlântica, 321' },
      { id: 5, nome: 'UBS Tijuca', endereco: 'Rua da Tijuca, 654' }
    ],
    'Balsas': [
      { id: 6, nome: 'UBS Centro BH', endereco: 'Av. Afonso Pena, 987' }
    ]
  }), []);

  const servicos = useMemo(() => [
    { id: 1, nome: 'Médico Clínico Geral', icon: '' },
    { id: 2, nome: 'Dentista', icon: '' },
    { id: 3, nome: 'Vacina', icon: '' },
    { id: 4, nome: 'Enfermagem', icon: '' },
    { id: 5, nome: 'Psicólogo', icon: '' }
  ], []);

  // Simular disponibilidade de horários
  const gerarDatasDisponiveis = useCallback(() => {
    const datas = [];
    const hoje = new Date();
    for (let i = 1; i <= 30; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      // Simular alguns dias com vagas disponíveis
      const temVagaManha = Math.random() > 0.3;
      const temVagaTarde = Math.random() > 0.3;
      
      if (temVagaManha || temVagaTarde) {
        datas.push({
          data: data.toISOString().split('T')[0],
          dataFormatada: data.toLocaleDateString('pt-BR'),
          vagasManha: temVagaManha ? Math.floor(Math.random() * 5) + 1 : 0,
          vagasTarde: temVagaTarde ? Math.floor(Math.random() * 5) + 1 : 0
        });
      }
    }
    return datas;
  }, []);

  const datasDisponiveis = useMemo(() => {
    return gerarDatasDisponiveis();
  }, [gerarDatasDisponiveis]);

  const handleUserDataChange = useCallback((field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    
    // Limpar documento quando mudar o tipo
    if (field === 'tipoDocumento') {
      setUserData(prev => ({ ...prev, documento: '' }));
    }
  }, []);

  const handleAgendamentoChange = useCallback((field, value) => {
    setAgendamento(prev => ({ ...prev, [field]: value }));
  }, []);

  const canProceedStep1 = userData.nomeCompleto && userData.celular && userData.documento && userData.cidade;
  const canProceedStep2 = agendamento.unidade && agendamento.servico && agendamento.data && agendamento.turno;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {currentStep === 1 && (
        <Step1
          userData={userData}
          handleUserDataChange={handleUserDataChange}
          setCurrentStep={setCurrentStep}
          canProceedStep1={canProceedStep1}
          cidades={cidades}
        />
      )}

      {currentStep === 2 && (
        <Step2
          userData={userData}
          agendamento={agendamento}
          handleAgendamentoChange={handleAgendamentoChange}
          setCurrentStep={setCurrentStep}
          canProceedStep2={canProceedStep2}
          unidadesPorCidade={unidadesPorCidade}
          servicos={servicos}
          datasDisponiveis={datasDisponiveis}
          setAgendamento={setAgendamento}
        />
      )}

      {currentStep === 3 && (
        <Step3
          userData={userData}
          agendamento={agendamento}
          setCurrentStep={setCurrentStep}
          datasDisponiveis={datasDisponiveis}
          confirmarAgendamento={confirmarAgendamento}
        />
      )}
    </div>
  );
};

export default AgendamentoConsultas;