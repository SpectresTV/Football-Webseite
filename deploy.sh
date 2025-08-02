#!/bin/bash

# Fehlerbehandlung: Bricht das Skript ab, wenn ein Befehl fehlschlägt
set -e

# Gehe in das Projektverzeichnis
cd /root/fussball-trainingsplaner

# Hole die neuesten Änderungen aus dem 'main'-Branch von GitHub
git pull origin main

# Installiere oder aktualisiere die Abhängigkeiten
npm install

# Baue die React-Anwendung
npm run build

# Lade den Nginx-Server neu, um die Änderungen zu übernehmen
# 'systemctl' benötigt möglicherweise sudo-Rechte.
# Wenn das Skript ohne sudo ausgeführt wird, musst du dem ausführenden Benutzer
# eventuell erlauben, diesen Befehl ohne Passwort auszuführen.
systemctl reload nginx

echo "Deployment erfolgreich abgeschlossen!"
