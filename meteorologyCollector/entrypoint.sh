#!/bin/sh

echo "Executando coletor de dados meteorológicos..."
python main.py

while true; do
    echo "-------------------------------------------"
    echo "Aguardando 1 hora até a próxima execução..."
    sleep 3600
    echo "Executando coletor de dados meteorológicos..."
    echo "-------------------------------------------"
    python main.py
done

