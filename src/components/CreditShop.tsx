import React, { useState } from "react";
import { 
  Coins, 
  Check, 
  HelpCircle, 
  TrendingUp, 
  CreditCard,
  History,
  CheckCircle2,
  X,
  Zap,
  DollarSign
} from "lucide-react";
import { CreditPackage, UserProfile, CreditTransaction } from "../types";
import { getPackages, saveUserProfile, saveTransactions, getTransactions } from "../mockData";

interface CreditShopProps {
  user: UserProfile;
  packages: CreditPackage[];
  transactions: CreditTransaction[];
  onRefreshUser: (updatedUser: UserProfile) => void;
  onRefreshTransactions: () => void;
}

export default function CreditShop({ 
  user, 
  packages, 
  transactions, 
  onRefreshUser, 
  onRefreshTransactions 
}: CreditShopProps) {
  // Checkout simulator state
  const [activePackage, setActivePackage] = useState<CreditPackage | null>(null);
  const [cardNumber, setCardNumber] = useState("4444 5555 6666 7777");
  const [cardHolder, setCardHolder] = useState(user.fullName);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handleCheckout = (pack: CreditPackage) => {
    setActivePackage(pack);
    setPurchaseSuccess(false);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackage) return;

    setIsProcessing(true);

    setTimeout(() => {
      // Deduct/Add credits in user profile state
      const updatedUser = {
        ...user,
        availableCredits: user.availableCredits + activePackage.creditsAmount
      };
      saveUserProfile(updatedUser);
      onRefreshUser(updatedUser);

      // Create new Transaction log
      const txs = getTransactions();
      const newTx: CreditTransaction = {
        id: `tx-buy-${Date.now()}`,
        profileId: user.id,
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        amount: activePackage.creditsAmount,
        type: "purchase",
        description: `Compra de ${activePackage.name} (${activePackage.creditsAmount} créditos)`,
        pricePaid: activePackage.price
      };
      txs.push(newTx);
      saveTransactions(txs);
      onRefreshTransactions();

      setIsProcessing(false);
      setPurchaseSuccess(true);
      setTimeout(() => {
        setActivePackage(null);
        setPurchaseSuccess(false);
      }, 2000);
    }, 1800);
  };

  const userTransactions = transactions
    .filter(tx => tx.profileId === user.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-white flex items-center gap-2">
            <Coins className="w-8 h-8 text-yellow-500" />
            Adquirir Créditos de IA
          </h2>
          <p className="text-sm text-gray-400">
            Cada geração de conteúdo completo consome 1 crédito. Compre pacotes únicos conforme a sua demanda, sem mensalidades fixas.
          </p>
        </div>
        <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm font-bold flex items-center gap-2 self-start">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span>Saldo Atual: {user.availableCredits} crd</span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pack) => (
          <div
            key={pack.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between relative transition-all ${
              pack.popular
                ? "bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-950/40 border-brand-blue glow-blue"
                : "bg-white/5 border-white/5"
            }`}
          >
            {pack.popular && (
              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-brand-blue text-white text-[10px] uppercase font-bold tracking-widest">
                Recomendado
              </span>
            )}

            <div>
              <h3 className="text-lg font-bold text-white mb-1.5">{pack.name}</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-6">{pack.description}</p>

              <div className="flex items-baseline gap-1.5 mb-6 border-b border-white/5 pb-6">
                <span className="text-xs text-gray-500 font-bold">R$</span>
                <span className="text-3xl font-extrabold text-white">{pack.price.toFixed(2)}</span>
                <span className="text-[10px] text-gray-500 font-medium">pagamento único</span>
              </div>

              <ul className="space-y-3 mb-8 text-xs">
                <li className="flex items-center gap-2 text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>
                    <strong className="text-white">{pack.creditsAmount}</strong> créditos estratégicos
                  </span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Salvar na biblioteca ilimitado</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Gerações de roteiro e carrossel</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Créditos nunca expiram</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout(pack)}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                pack.popular
                  ? "bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-md shadow-brand-blue/10 hover:scale-101"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              Comprar Plano
            </button>
          </div>
        ))}
      </div>

      {/* Historical Transactions list */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-gray-400" />
          Histórico de Transações
        </h3>

        {userTransactions.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">Nenhuma transação financeira registrada neste perfil.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 font-mono">
                  <th className="py-3 px-4 font-bold">Data</th>
                  <th className="py-3 px-4 font-bold">Descrição</th>
                  <th className="py-3 px-4 font-bold text-center">Créditos</th>
                  <th className="py-3 px-4 font-bold text-right">Valor Pago</th>
                </tr>
              </thead>
              <tbody>
                {userTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 px-4 text-gray-400 font-mono">{tx.date}</td>
                    <td className="py-3 px-4 text-white font-medium">{tx.description}</td>
                    <td className={`py-3 px-4 text-center font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-gray-400"}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </td>
                    <td className="py-3 px-4 text-right text-white font-mono font-bold">
                      {tx.pricePaid ? `R$ ${tx.pricePaid.toFixed(2)}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkout Simulator Modal */}
      {activePackage && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0e19] border border-white/10 rounded-3xl p-6 relative">
            <button
              onClick={() => { if (!isProcessing) setActivePackage(null); }}
              className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>

            {!purchaseSuccess ? (
              <form onSubmit={handleProcessPayment} className="space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-blue uppercase font-bold font-mono tracking-widest block">Checkout Simulador</span>
                  <h4 className="font-display font-bold text-white text-lg">Adquirindo {activePackage.name}</h4>
                  <p className="text-xs text-gray-400">
                    Insira os dados do cartão simulado abaixo para testar a integração e creditar {activePackage.creditsAmount} gerações.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-400">Pacote de créditos:</span>
                    <p className="font-bold text-white mt-0.5">{activePackage.creditsAmount} gerações de IA</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400">Preço:</span>
                    <p className="font-bold text-brand-blue text-sm mt-0.5">R$ {activePackage.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase font-mono mb-2">Número do Cartão (Simulado)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase font-mono mb-2">Titular do Cartão</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  id="btn-process-payment"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando pagamento fictício...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Confirmar Compra (R$ {activePackage.price.toFixed(2)})
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-base">Pagamento Aprovado!</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    +{activePackage.creditsAmount} créditos adicionados à sua agência sem fronteiras!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
