import React from 'react';
import { Plus, ShieldCheck, UserCheck, Shield } from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  site: string;
  active: boolean;
}

interface AdminRbacViewProps {
  users: UserItem[];
  onAddUser: () => void;
  onToggleUser: (id: string) => void;
  onTriggerSupportMode: () => void;
}

export const AdminRbacView: React.FC<AdminRbacViewProps> = ({
  users,
  onAddUser,
  onToggleUser,
  onTriggerSupportMode,
}) => {
  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-[#111820] p-5 rounded-xl border border-[#8995A3]/20 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#F4F6F8]">
              Matrice de Contrôle d'Accès RBAC & Cloisonnement Multi-Tenant
            </h3>
            <p className="text-xs text-[#8995A3]">
              Gestion des collaborateurs, des autorisations strictes par profil et de l'isolation hermétique des données.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerSupportMode}
              className="bg-[#172231] hover:bg-[#172231]/80 text-[#8995A3] hover:text-[#F4F6F8] text-xs font-bold px-3 py-2 rounded-lg border border-[#8995A3]/25 flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF8A00]" />
              Mode Support Tracé
            </button>

            <button
              onClick={onAddUser}
              className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nouvel Utilisateur</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#08111F] rounded-lg p-3 border border-[#8995A3]/15 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#8995A3]/20 text-[#8995A3] font-bold uppercase text-[10px] font-mono">
              <tr>
                <th className="pb-2.5">Collaborateur</th>
                <th className="pb-2.5">Adresse E-mail</th>
                <th className="pb-2.5">Rôle & Niveau</th>
                <th className="pb-2.5">Chantier / Base Affectée</th>
                <th className="pb-2.5 text-right">Statut du Compte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8995A3]/15 font-medium text-[#F4F6F8]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#172231]/30 transition-colors">
                  <td className="py-3 font-bold">{u.name}</td>
                  <td className="py-3 font-mono text-[#8995A3]">{u.email}</td>
                  <td className="py-3">
                    <span className="font-mono text-[#FF8A00] bg-[#FF8A00]/10 px-2 py-0.5 rounded text-[10px] font-bold border border-[#FF8A00]/25">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-[#8995A3]">{u.site}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onToggleUser(u.id)}
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded cursor-pointer transition-colors border ${
                        u.active
                          ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/25'
                          : 'bg-[#172231] text-[#8995A3] border-[#8995A3]/25 hover:bg-[#172231]/80'
                      }`}
                    >
                      {u.active ? '● Actif' : '○ Suspendu'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Rules Matrix Card */}
      <div className="bg-[#111820] p-5 rounded-xl border border-[#8995A3]/20 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4F6F8] font-mono flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#FF8A00]" />
          Spécification des Privilèges Industriels (RG-ACC)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#172231] border border-[#8995A3]/15 space-y-1">
            <strong className="text-[#FF8A00] font-mono block">ADM-E (Admin Entreprise)</strong>
            <p className="text-[11px] text-[#8995A3]">Contrôle total sur les engins, les utilisateurs, les budgets et les exports.</p>
          </div>
          <div className="p-3 rounded-lg bg-[#172231] border border-[#8995A3]/15 space-y-1">
            <strong className="text-[#F4F6F8] font-mono block">GP (Gestionnaire de Parc)</strong>
            <p className="text-[11px] text-[#8995A3]">Affectation des conducteurs, suivi télématique GPS et planification des missions.</p>
          </div>
          <div className="p-3 rounded-lg bg-[#172231] border border-[#8995A3]/15 space-y-1">
            <strong className="text-[#10B981] font-mono block">RM / RC (Atelier & Carburant)</strong>
            <p className="text-[11px] text-[#8995A3]">Gestion des bons de réparation, pièces détachées et audit des consommations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminRbacView;
