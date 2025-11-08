import os
import time
import traceback
from livereload import Server

ROOT = os.path.dirname(os.path.abspath(__file__))

def start_once():
    print("==============================")
    print(" Avvio Livereload Server SI.MA")
    print(" Radice:", ROOT)
    print(" Porta HTTP: 5174  | Porta LiveReload: 35729")
    print("==============================")

    server = Server()
    # Watch common assets and content folders
    server.watch('*.html')
    server.watch('*.css')
    server.watch('*.js')
    server.watch('contenuti/**/*.*')

    # Serve on LAN and keep running; livereload injects reload script automatically
    server.serve(
        host='0.0.0.0',
        port=5174,
        root=ROOT,
        liveport=35729,  # default livereload port
        restart_delay=0.2,
        debug=True
    )

if __name__ == "__main__":
    # Loop di auto‑restart: se il server lancia eccezioni viene riavviato
    while True:
        try:
            start_once()
        except KeyboardInterrupt:
            print("Interruzione manuale. Chiusura server.")
            break
        except Exception as e:
            print("[ERRORE] Il server si è fermato per un'eccezione:")
            traceback.print_exc()
            print("Riavvio tra 3 secondi...")
            time.sleep(3)
        else:
            # Se server.serve() esce senza eccezioni (chiusura normale)
            print("Server terminato senza eccezioni. Riavvio tra 3 secondi (CTRL+C per uscire)...")
            time.sleep(3)
