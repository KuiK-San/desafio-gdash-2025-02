from app.collector.main import ClimateClient
# TODO: importar bibliotecas

if __name__ == "__main__": 
    # TODO: pegar localização atual
    currentLocation: dict = {
        'lat': 0,
        'lon': 0
    } 
    
    # TODO: fazer requisição na API
    climate = ClimateClient(lat=currentLocation['lat'], lon=currentLocation['lon'])
    filtredClimate = climate.getCurrentFiltred()

    # TODO: enviar dados para o mensageBroken
    mensager = MensageSender()
    mensager.sendMensage(filtredClimate)