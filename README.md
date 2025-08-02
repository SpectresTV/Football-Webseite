# Football-Webseite

Einfaches Beispiel einer Fußball-Planungs-Webseite mit Login und SQLite-Datenbank.

## Installation

```
npm install
```

## Starten

```
npm start
```

Die Seite ist danach unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Funktionen

- Registrierung und Login mit Passwort-Hashing.
- Planungsseite zum Hinzufügen von Terminen (Titel, Datum, Beschreibung).
- Speichern der Daten in einer SQLite-Datenbank `football.db`.

## Deployment

Um die Seite über einen öffentlichen Link erreichbar zu machen, kann z.B. [Render](https://render.com) verwendet werden:

1. Repo zu GitHub pushen.
2. In Render ein neues Web Service über das GitHub-Repository anlegen.
3. Das mitgelieferte `render.yaml` sorgt dafür, dass `npm install` und `npm start` ausgeführt werden.
4. Nach dem Deploy ist die Seite unter `https://<dein-service>.onrender.com` erreichbar.

GitHub Pages unterstützt keine Node.js-Backends.
