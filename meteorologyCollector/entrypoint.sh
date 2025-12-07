#!/bin/sh

echo "Executando coletor de dados meteorológicos..."
python main.py

while true; do
    echo "-------------------------------------------"
    echo "Aguardando 5 segundos até a próxima execução..."
    sleep 5
    echo "Executando coletor de dados meteorológicos..."
    echo "-------------------------------------------"
    python main.py
done

