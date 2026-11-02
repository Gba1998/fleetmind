#!/bin/bash
# FleetMind - Déploiement Conteneurisé Production (Linux / Cloud)

echo "========================================================================="
echo "               FLEETMIND - DÉPLOIEMENT CONTENEURISÉ (DOCKER)"
echo "========================================================================="
echo ""

if ! command -v docker &> /dev/null
then
    echo "[ERREUR] Docker n'est pas installé sur ce système."
    exit 1
fi

echo "[OK] Docker détecté. Construction et lancement des conteneurs FleetMind..."
docker compose up -d --build

echo ""
echo "========================================================================="
echo "[SUCCÈS] FleetMind est opérationnel !"
echo ""
echo "- Frontend Web (Nginx) : http://localhost"
echo "- Backend API REST     : http://localhost:5000/api/health"
echo ""
echo "Commandes utiles :"
echo "- Voir les logs    : docker compose logs -f"
echo "- Arrêter          : docker compose down"
echo "========================================================================="
