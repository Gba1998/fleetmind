import React from 'react';
import { Sparkles, CheckCircle, Send, Radio, Activity, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface AnalyticsAiViewProps {
  telemetryData: any[];
  aiValidated: boolean;
  onValidateAi: () => void;
  chatMessages: { id: number; sender: string; text: string }[];
  inputChat: string;
  onSetInputChat: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export const AnalyticsAiView: React.FC<AnalyticsAiViewProps> = ({
  telemetryData,
  aiValidated,
  onValidateAi,
  chatMessages,
  inputChat,
  onSetInputChat,
  onSendMessage,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* 2 Cols : Charts & Operational Score */}
      <div className="lg:col-span-2 space-y-6">
        {/* Telemetry Kilometers / Hours Area Chart */}
        <div className="bg-[#111820] p-5 rounded-xl border border-[#8995A3]/20 space-y-4">
          <div className="flex items-center justify-between border-b border-[#8995A3]/15 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F6F8] font-mono">
                Kilomètres Parcourus & Heures Moteur Flotte
              </h3>
              <p className="text-[11px] text-[#8995A3] mt-0.5">
                Données d'exploitation consolidées sur l'ensemble des balises matérielles.
              </p>
            </div>
            <span className="text-[10px] bg-[#172231] px-2.5 py-1 rounded text-[#FF8A00] font-mono font-bold border border-[#FF8A00]/25">
              Norme H10 Active
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FF8A00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#8995A3" strokeOpacity={0.15} />
                <XAxis dataKey="month" stroke="#8995A3" fontSize={11} />
                <YAxis stroke="#8995A3" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111820',
                    borderColor: '#8995A3',
                    borderRadius: '8px',
                    color: '#F4F6F8',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="km"
                  stroke="#FF8A00"
                  fillOpacity={1}
                  fill="url(#colorKm)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Score & Human Validation Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#111820] border border-[#8995A3]/20 space-y-2">
            <span className="text-[11px] text-[#8995A3] font-bold uppercase font-mono tracking-wider">
              Score d'Éco-Conduite & Sécurité
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#10B981]">
              86 / 100
            </div>
            <p className="text-[11px] text-[#8995A3] leading-relaxed">
              Calculé à partir des régimes moteurs anormaux, accélérations brusques et arrêts prolongés avec contact allumé.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111820] border border-[#8995A3]/20 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#8995A3] font-bold uppercase font-mono tracking-wider">
                Validation Décisionnelle (Niveau 2)
              </span>
              <p className="text-[11px] text-[#8995A3] mt-1">
                Contrôle par le responsable de parc des recommandations analytiques de la période.
              </p>
            </div>

            <div className="pt-2">
              {aiValidated ? (
                <span className="bg-[#10B981]/15 text-[#10B981] text-xs px-3 py-2 rounded-lg font-bold border border-[#10B981]/30 flex items-center gap-1.5 w-max">
                  <CheckCircle className="w-4 h-4" />
                  Recommandations Validées & Archivées
                </span>
              ) : (
                <button
                  onClick={onValidateAi}
                  className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-bold text-xs px-3.5 py-2 rounded-lg shadow cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Valider les Recommandations
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1 Col : AI Assistant Chat Drawer */}
      <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 flex flex-col justify-between h-[600px]">
        <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#8995A3]/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8A00]" />
              <span className="font-extrabold text-xs text-[#F4F6F8]">
                Assistant Flotte FleetMind (Aimy)
              </span>
            </div>
            <span className="bg-[#10B981]/15 text-[#10B981] text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border border-[#10B981]/30">
              En Ligne
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl whitespace-pre-line leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#172231] text-[#F4F6F8] border border-[#FF8A00]/30 ml-6 font-semibold'
                    : 'bg-[#08111F] text-[#8995A3] border border-[#8995A3]/20 mr-4'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={onSendMessage} className="pt-3 border-t border-[#8995A3]/20 flex gap-2">
          <input
            type="text"
            placeholder="Posez une question sur le parc matériel..."
            value={inputChat}
            onChange={(e) => onSetInputChat(e.target.value)}
            className="flex-1 bg-[#08111F] border border-[#8995A3]/25 rounded-lg px-3 py-2 text-xs text-[#F4F6F8] placeholder-[#8995A3]/50 focus:outline-none focus:border-[#FF8A00]"
          />
          <button
            type="submit"
            className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] p-2 rounded-lg font-bold cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default AnalyticsAiView;
