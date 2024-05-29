import time
import datetime as dt

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService

from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from .models import MatchesShedule, Teams, Championship


class ParserShedule():
    def __init__(self, url):
        self.__driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.__url = url

    def parsing(self):

        # отдаем url парсеру
        self.__driver.get(url=self.__url)

        # принимаем файлы куки
        accept_cookies = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "#onetrust-accept-btn-handler"))
        )
        accept_cookies.click()

        # загружаем все матчи расписания
        loading = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable((
                By.CSS_SELECTOR, ".event__match.event__match--static.event__match--scheduled.event__match--twoLine"))
        )
        all_matches = self.__driver.find_elements(
            By.CSS_SELECTOR, ".event__match.event__match--static.event__match--scheduled.event__match--twoLine"
        )

        # сохраняем окно со всеми матчами
        window_with_matches = self.__driver.window_handles[len(self.__driver.window_handles) - 1]
        try:
            # закрываем ненужное окно
            time.sleep(3)
            loading = WebDriverWait(self.__driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".close.wizard__closeIcon"))
            )
            loading.click()
        except:
            pass

        # расширяем экран
        self.__driver.set_window_size(1920, 1080)

        for i in range(len(all_matches)):

            # переходим на страницу матча и перекидываем драйвер на новое окно
            loading = WebDriverWait(self.__driver, 10).until(
                EC.element_to_be_clickable(
                    all_matches[i].find_element(By.CSS_SELECTOR, ".event__logo.event__logo--home"))
            )
            loading.click()

            self.__driver.switch_to.window(self.__driver.window_handles[len(self.__driver.window_handles) - 1])

            # забираем дату и команды
            loading = WebDriverWait(self.__driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".duelParticipant__startTime"))
            )
            date = self.__driver.find_element(By.CSS_SELECTOR, ".duelParticipant__startTime").text

            # забираем чемпионат
            loading = WebDriverWait(self.__driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".tournamentHeader__country"))
            )
            css_championship = self.__driver.find_element(By.CSS_SELECTOR, ".tournamentHeader__country")

            # проверяем, что это не товарищеский матч и не предсезонка
            if css_championship.text == "США: НХЛ - ПРЕДСЕЗОНКА":
                return

            if css_championship.text == "МИР: КЛУБНЫЕ ТОВАРИЩЕСКИЕ МАТЧИ":
                return

            # выделяем нужную строку и добавляем в словарь
            list_championship = css_championship.text.split()

            # проверяем, что матч КХЛ или НХЛ
            if ("КХЛ" not in list_championship) and ("НХЛ" not in list_championship):
                return

            championship = ""

            if "КХЛ" in list_championship:
                championship += "КХЛ"

            if "НХЛ" in list_championship:
                championship += "НХЛ"

            if "ПЛЕЙ-ОФФ" in list_championship:
                championship += "_ПЛЕЙ-ОФФ"

            # проверка на дату и +7 дней
            date = dt.datetime.strptime(date.split()[0], "%d.%m.%Y")
            final_date = dt.datetime.now() + dt.timedelta(days=7)

            if date > final_date:
                break

            # забираем домашнюю и гостевую команду
            team_home = self.__driver.find_element(By.CSS_SELECTOR,
                                                   ".participant__participantName.participant__overflow ").text
            team_home = team_home.replace(" ", "_").replace("-", "_")

            element_away = self.__driver.find_element(By.CSS_SELECTOR, ".duelParticipant__away ")
            team_away = element_away.find_element(By.CSS_SELECTOR,
                                                  ".participant__participantName.participant__overflow ").text
            team_away = team_away.replace(" ", "_").replace("-", "_")

            check_match_in_table = MatchesShedule.objects.filter(
                team_home=team_home,
                team_away=team_away,
                date=date
            )
            if len(check_match_in_table) == 0:
                MatchesShedule.objects.create(
                    championship=Championship.objects.get(championship=championship),
                    team_home=team_home,
                    team_away=team_away,
                    date=date,
                )

            # закрываем окно матча и возвращаемся к окну со всеми матчами команды
            self.__driver.close()
            self.__driver.switch_to.window(window_with_matches)

# ps = ParserShedule(url="https://www.flashscorekz.com/hockey/russia/khl/fixtures/")
# ps.parsing()
