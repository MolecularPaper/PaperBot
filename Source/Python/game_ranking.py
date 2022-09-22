from bs4 import BeautifulSoup  # HTML을 파싱하는 모듈
import requests
import sys, io

site_link = 'https://www.gamemeca.com/ranking.php'

def get_game_ranking():
    response = requests.get(site_link)
    soup = BeautifulSoup(response.content, 'html.parser')
    div = soup.select('table.ranking-table tbody > tr')
    description = ""

    for index, element in enumerate(div, 1):
        name = element.select_one('div.game-name a').get_text()
        description += f'{index}. {name}\n'
        if index >= 10: break

    description += f'\n 출처 : {site_link}'
    
    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')

    print(description)

if __name__ == '__main__':
    get_game_ranking()