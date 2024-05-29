import os
import time
import datetime as dt

import requests
from selenium import webdriver
from selenium.common import TimeoutException
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.service import Service as ChromeService, Service

from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from webdriver_manager.chrome import ChromeDriverManager

from .models import *

ALL_STATISTICS = ["Броски в створ ворот", "Шайбы в большинстве",
                  "Выигр. вбрасывания", "Силовые приемы"]


class Parser():
    def __init__(self, url):
        chrome_path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

        # Установка переменной среды для отключения проверки SSL
        options = webdriver.ChromeOptions()
        options.binary_location = chrome_path

        # Создаем экземпляр WebDriver с указанием сервиса и опций
        self.__driver = webdriver.Chrome(options=options)

        # os.environ['WDM_SSL_VERIFY'] = '0'
        # service = Service()
        # options = webdriver.ChromeOptions()
        # self.__driver = webdriver.Chrome(service=service, options=options)

        # self.__driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.__url = url

    def parsing(self):

        # отдаем url парсеру
        print(self.__url)
        self.__driver.get(url=self.__url)

        # принимаем файлы куки
        accept_cookies = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "#onetrust-accept-btn-handler"))
        )
        accept_cookies.click()

        # расширяем окно
        self.__driver.maximize_window()

        # забираем название чемпионата
        championship = self.__driver.find_element(By.CLASS_NAME, "heading__name")

        # получаем название всех команд
        loading = WebDriverWait(self.__driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".ui-table__row"))
        )
        all_teams = self.__driver.find_elements(By.CSS_SELECTOR, ".ui-table__row")

        # сохраняем названия всех команд в бд
        # тут может быть исключение DoesNotExist
        championship_model = Championship.objects.get(championship=championship.text)

        for team in all_teams:
            if not (Teams.objects.filter(
                    team_name=team.text.splitlines()[1].replace(" ", "_").replace("-", "_"),
                    championship=championship_model)
            ):
                Teams.objects.create(
                    team_name=team.text.splitlines()[1].replace(" ", "_").replace("-", "_"),
                    championship=championship_model
                )

        # проверяем по какому чемпионату запущен парсер и делаем срез по командам
        if championship.text == "КХЛ":
            all_teams = all_teams[0:23]
        elif championship.text == "НХЛ":
            all_teams = all_teams[0:32]

        # скроллим вниз
        self.__driver.execute_script("window.scrollTo(0, 500)")

        # находим все селекторы в таблицу все команд для клика
        all_teams = [all_teams[i].find_elements(By.CLASS_NAME, "tableCellParticipant__image")[0]
                     for i in range(len(all_teams))]

        # цикл по всем командам
        start = 0
        for i in range(start, len(all_teams)):

            if i == 10:
                self.__driver.execute_script("window.scrollTo(0, 950)")

            # закрываем окно предыдущей команды
            # if i >= start + 1:
            #     self.__driver.close()
            #     self.__driver.switch_to.window(self.__driver.window_handles[len(self.__driver.window_handles) - 1])

            # Открываем ссылку в новой вкладке с помощью JavaScript (предыдущий код)
            self.__driver.execute_script("window.open('" + all_teams[i].get_attribute('href') + "', '_blank');")

            # тыкаем на команду и перекидываем парсер на новое окно
            # all_teams[i].click()
            self.__driver.switch_to.window(self.__driver.window_handles[len(self.__driver.window_handles) - 1])

            # запускаем метод сбора данных для определенной команды
            self.parsing_team(first_pass=False)

            # закрываем окно команды и возвращаемся в окно со всеми командами
            self.__driver.close()
            self.__driver.switch_to.window(self.__driver.window_handles[len(self.__driver.window_handles) - 1])

    def parsing_team(self, first_pass=False):

        # тыкаем на кнопку 'результаты'
        while True:
            try:
                self.__driver.refresh()
                results = WebDriverWait(self.__driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "#teamPage > div.tabs > div > a:nth-child(3)"))
                )
                results.click()
                break
            except:
                pass

        # берем название команды
        team_name = self.__driver.find_element(By.CSS_SELECTOR, ".heading__name").text
        team_name = team_name.replace(" ", "_")
        team_name = team_name.replace("-", "_")
        all_matches = []

        # закрываем ненужное окно
        try:
            loading = WebDriverWait(self.__driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".close.wizard__closeIcon"))
            )
            loading.click()
        except TimeoutException:
            pass

        # проверка запущен ли парсер впервые, если да, то собираем матчи за последние 3 страницы
        if first_pass:
            for i in range(1):
                self.__driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(5)
                self.__driver.execute_script("window.scrollBy(0, -400);")
                time.sleep(5)

                to_click_more_matches = self.__driver.find_element(By.CSS_SELECTOR,
                                                                   '.ui-show-more.ui-show-more--stretch')
                to_click_more_matches_xpath = self.__driver.find_element(By.XPATH,
                                                                   '//*[@id="teamPage"]/section/a')
                to_click_more_matches_full_xpath = self.__driver.find_element(By.XPATH,
                                                                         '//*[@id="teamPage"]/section/a')
                time.sleep(5)

                print(to_click_more_matches)
                print(to_click_more_matches_xpath)
                print(to_click_more_matches_full_xpath)
                to_click_more_matches.click()
                time.sleep(5)

            # поднимаемся
            self.__driver.find_element(By.CSS_SELECTOR, "#scroll-to-top").click()
            time.sleep(5)

        all_matches = self.__driver.find_elements(By.CSS_SELECTOR,
                                                  ".event__match.event__match--twoLine")
        print(len(all_matches))

        # цикл по всем матчам
        # for i in range(0, len(all_matches)):
        for i in range(0, len(all_matches)):
            # заходим на страницу матча и перекидываем драйвер на новое окно

            self.__driver.implicitly_wait(5)
            loading = WebDriverWait(self.__driver, 60).until(
                EC.element_to_be_clickable(
                    (all_matches[i].find_element(By.CSS_SELECTOR, ".event__logo.event__logo--home")))
            )
            print(loading)
            # Прокрутка страницы до элемента
            self.__driver.execute_script("arguments[0].scrollIntoView(true);", loading)

            loading.click()

            self.__driver.switch_to.window(self.__driver.window_handles[len(self.__driver.window_handles) - 1])

            # запускаем парсер и проверяем что возвращается
            statistical_data = self.parsing_match(team_name)

            if statistical_data == None:
                print("не перешли")
                break

            # сохраняем статистику в бд

            team_for_check = Teams.objects.get(team_name=statistical_data["team"])
            championship_model = Championship.objects.get(championship=statistical_data["championship"])

            check_match_in_table = Matches.objects.filter(
                team=team_for_check,
                match_name=statistical_data["match_name"],
                date=statistical_data["date"]
            )

            if len(check_match_in_table) == 0:
                Matches.objects.create(
                    team=team_for_check,
                    coach=statistical_data["coach"],
                    season=statistical_data["season"],
                    championship=championship_model,
                    date=statistical_data["date"],
                    match_name=statistical_data["match_name"],
                    odds=statistical_data["odds"],
                    first_period_score=statistical_data["first_period_score"],
                    second_period_score=statistical_data["second_period_score"],
                    third_period_score=statistical_data["third_period_score"],
                    score=statistical_data["score"],
                    moment_end_match=statistical_data["moment_end_match"],
                    first_period_shots_on_goal=statistical_data["first_period_shots_on_goal"],
                    second_period_shots_on_goal=statistical_data["second_period_shots_on_goal"],
                    third_period_shots_on_goal=statistical_data["third_period_shots_on_goal"],
                    shots_on_goal=statistical_data["shots_on_goal"],
                    first_period_power_play_goals=statistical_data["first_period_power_play_goals"],
                    second_period_power_play_goals=statistical_data["second_period_power_play_goals"],
                    third_period_power_play_goals=statistical_data["third_period_power_play_goals"],
                    power_play_goals=statistical_data["power_play_goals"],
                    first_period_faceoffs_won=statistical_data["first_period_faceoffs_won"],
                    second_period_faceoffs_won=statistical_data["second_period_faceoffs_won"],
                    third_period_faceoffs_won=statistical_data["third_period_faceoffs_won"],
                    faceoffs_won=statistical_data["faceoffs_won"],
                    first_period_penalties=statistical_data["first_period_penalties"],
                    second_period_penalties=statistical_data["second_period_penalties"],
                    third_period_penalties=statistical_data["third_period_penalties"],
                    penalties=statistical_data["penalties"],
                    first_period_hits=statistical_data["first_period_hits"],
                    second_period_hits=statistical_data["second_period_hits"],
                    third_period_hits=statistical_data["third_period_hits"],
                    hits=statistical_data["hits"]
                )
            else:
                break

            print(f'Сейчас i = {i}')

            # закрываем окно и возвращаемся к окну со всеми матчами команды
            self.__driver.close()
            self.__driver.switch_to.window(self.__driver.window_handles[len(self.__driver.window_handles) - 1])

        # закрываем окно команды
        self.__driver.close()
        self.__driver.switch_to.window(self.__driver.window_handles[len(self.__driver.window_handles) - 1])

    def parsing_match(self, team_name):
        # уже перешел на страницу матча, нужно только собрать данные

        # словарь с данными
        statistical_data = {
            "team": None,
            "coach": None,
            "season": None,
            "championship": None,
            "date": None,
            "match_name": None,
            "odds": None,
            "first_period_score": None,
            "second_period_score": None,
            "third_period_score": None,
            "score": None,
            "moment_end_match": None,
            "first_period_shots_on_goal": None,
            "second_period_shots_on_goal": None,
            "third_period_shots_on_goal": None,
            "shots_on_goal": None,
            "first_period_power_play_goals": None,
            "second_period_power_play_goals": None,
            "third_period_power_play_goals": None,
            "power_play_goals": None,
            "first_period_faceoffs_won": None,
            "second_period_faceoffs_won": None,
            "third_period_faceoffs_won": None,
            "faceoffs_won": None,
            "first_period_penalties": None,
            "second_period_penalties": None,
            "third_period_penalties": None,
            "penalties": None,
            "first_period_hits": None,
            "second_period_hits": None,
            "third_period_hits": None,
            "hits": None
        }

        # число в период(для словаря)
        number_to_period = {
            1: "first_period",
            2: "second_period",
            3: "third_period"
        }

        # переводчик для статистики(для словаря)
        name_statistical_data = {
            "Броски в створ ворот": "_shots_on_goal",
            "Шайбы в большинстве": "_power_play_goals",
            "Выигр. вбрасывания": "_faceoffs_won",
            "Силовые приемы": "_hits"
        }
        # сохраняем команду
        statistical_data["team"] = team_name


        # Сохраняем результат матча
        list_score = self.__driver.find_element(By.CSS_SELECTOR, ".detailScore__matchInfo").text.split()
        print(list_score)
        try:
            score = "".join(list_score[0:list_score.index("(")])

            moment_end_match = " ".join(list_score[list_score.index(")") + 1:])
            if moment_end_match == "ПОСЛЕ ОВЕРТАЙМА":
                moment_end_match = Matches.OVERTIME
            elif moment_end_match == "ПОСЛЕ БУЛЛИТОВ":
                moment_end_match = Matches.SHOOTOUT
        except:
            score = "".join(list_score[0:3])
            moment_end_match = Matches.MAIN_TIME

        loading = WebDriverWait(self.__driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".duelParticipant__startTime"))
        )
        date = self.__driver.find_element(By.CSS_SELECTOR, ".duelParticipant__startTime").text.split()[0]
        statistical_data["date"] = dt.datetime.strptime(date.split()[0], "%d.%m.%Y")
        print(date)

        # фильтруем и сохраняем сезон
        date_start = dt.datetime.strptime("15.08", "%d.%m")
        date_end = dt.datetime.strptime("31.12", "%d.%m")

        list_date = date.split(".")
        check_date = list_date[0] + "." + list_date[1]
        if check_date == "29.02":
            season = f"{int(list_date[2]) - 1}/{list_date[2]}"
        else:
            check_date_match = dt.datetime.strptime(check_date, "%d.%m")

            if date_start <= check_date_match <= date_end:
                season = f"{list_date[2]}/{int(list_date[2]) + 1}"
            else:
                season = f"{int(list_date[2]) - 1}/{list_date[2]}"

        statistical_data["season"] = season

        # сохраняем название матча
        home_team_name = self.__driver.find_element(By.CSS_SELECTOR, ".duelParticipant__home")
        home_team_name = home_team_name.find_element(By.CSS_SELECTOR,
                                                     ".participant__participantName.participant__overflow")
        home_team_name = home_team_name.text.replace(" ", "_").replace("-", "_")

        away_team_name = self.__driver.find_element(By.CSS_SELECTOR, ".duelParticipant__away")
        away_team_name = away_team_name.find_element(By.CSS_SELECTOR,
                                                     ".participant__participantName.participant__overflow")
        away_team_name = away_team_name.text.replace(" ", "_").replace("-", "_")

        match_name = home_team_name + "-" + away_team_name
        statistical_data["match_name"] = match_name

        print(match_name)
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

        statistical_data["championship"] = championship

        print(championship)

        ########################################################################################################
        # переходим на страницу коэффициентов
        try:
            click_odds = WebDriverWait(self.__driver, 60).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "#detail>div.detailOver>div>a:nth-child(2)"))
            )
            click_odds.click()

            # загружаем страницу коэффициентов и забираем коэффициенты
            loading = WebDriverWait(self.__driver, 60).until(
                EC.presence_of_element_located((By.CSS_SELECTOR,
                                                ".ui-table__row"))
            )
            odds_selector = self.__driver.find_elements(By.CSS_SELECTOR, ".ui-table__row")
            collect_odds = ""

            # сохраняем коэффициенты
            if len(odds_selector) == 1:
                odds_list = odds_selector[0].text.split()
                statistical_data["odds"] = " ".join(odds_list)
            else:
                raise ValueError("Коэффициенты не получены.")

        except:
            pass

        # возвращаемся на страницу матча
        click_match = WebDriverWait(self.__driver, 60).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, '#detail>div.detailOver>div>a:nth-child(1)>button'))
        )
        click_match.click()

        #############################################################################################################

        # парсим удаления
        collect_penalty = self.parsing_penalty_time()

        statistical_data["first_period_penalties"] = collect_penalty["first_period_penalties"]
        statistical_data["second_period_penalties"] = collect_penalty["second_period_penalties"]
        statistical_data["third_period_penalties"] = collect_penalty["third_period_penalties"]
        statistical_data["penalties"] = collect_penalty["penalties"]

        # переходим на статистику
        loading = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable(
                ((By.CSS_SELECTOR, '#detail>div.filterOver.filterOver--indent>div>a:nth-child(2)')))
        )
        loading.click()

        # информация по периодам

        periods = []

        # неявное ожиидание
        # self.__driver.implicitly_wait(5)
        loading = WebDriverWait(self.__driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//a[@title='1-й период']"))
        )

        # сохраняем кнопки периодов для кликов на каждый период
        periods.append(self.__driver.find_element(By.XPATH, "//a[@title='1-й период']"))
        periods.append(self.__driver.find_element(By.XPATH, "//a[@title='2-й период']"))
        periods.append(self.__driver.find_element(By.XPATH, "//a[@title='3-й период']"))

        for i in range(0, len(periods)):
            # ожидаем и кликаем на период
            self.__driver.implicitly_wait(5)
            periods[i].click()

            self.__driver.implicitly_wait(5)
            self.__driver.execute_script("window.scrollTo(0, 450);")

            # собираем статистику

            self.__driver.implicitly_wait(5)

            all_statistics = self.__driver.find_element(By.CLASS_NAME, "section").text.splitlines()

            # Голы для НХЛ
            if all_statistics[4] == 'Удары мимо':
                statistical_data[
                    f"{number_to_period[i + 1]}_score"] = f"{int(all_statistics[0]) - int(all_statistics[14])}" \
                                                          f" - {int(all_statistics[2]) - int(all_statistics[12])}"
            # Голы для КХЛ
            else:
                statistical_data[
                    f"{number_to_period[i + 1]}_score"] = f"{int(all_statistics[0]) - int(all_statistics[11])}" \
                                                          f" - {int(all_statistics[2]) - int(all_statistics[9])}"

            print(all_statistics)
            for j in range(1, len(all_statistics), 3):
                if all_statistics[j] in ALL_STATISTICS:
                    statistical_data[f"{number_to_period[i + 1]}{name_statistical_data[all_statistics[j]]}"] = \
                        f"{all_statistics[j - 1]} - {all_statistics[j + 1]}"

            # ожидаем и поднимаемся в начало страницы
            self.__driver.implicitly_wait(5)
            self.__driver.execute_script("window.scrollTo(document.body.scrollHeight, 0);")
        print(statistical_data)
        shots_on_goal = str(int(statistical_data["first_period_shots_on_goal"].split("-")[0]) \
                            + int(statistical_data["second_period_shots_on_goal"].split("-")[0]) \
                            + int(statistical_data["third_period_shots_on_goal"].split("-")[0])) + \
                        '-' \
                        + \
                        str(int(statistical_data["first_period_shots_on_goal"].split("-")[1]) \
                            + int(statistical_data["second_period_shots_on_goal"].split("-")[1]) \
                            + int(statistical_data["third_period_shots_on_goal"].split("-")[1]))

        power_play_goals = str(int(statistical_data["first_period_power_play_goals"].split("-")[0]) \
                               + int(statistical_data["second_period_power_play_goals"].split("-")[0]) \
                               + int(statistical_data["third_period_power_play_goals"].split("-")[0])) + \
                           '-' \
                           + \
                           str(int(statistical_data["first_period_power_play_goals"].split("-")[1]) \
                               + int(statistical_data["second_period_power_play_goals"].split("-")[1]) \
                               + int(statistical_data["third_period_power_play_goals"].split("-")[1]))

        faceoffs_won = str(int(statistical_data["first_period_faceoffs_won"].split("-")[0]) \
                           + int(statistical_data["second_period_faceoffs_won"].split("-")[0]) \
                           + int(statistical_data["third_period_faceoffs_won"].split("-")[0])) + \
                       '-' \
                       + \
                       str(int(statistical_data["first_period_faceoffs_won"].split("-")[1]) \
                           + int(statistical_data["second_period_faceoffs_won"].split("-")[1]) \
                           + int(statistical_data["third_period_faceoffs_won"].split("-")[1]))

        hits = str(int(statistical_data["first_period_hits"].split("-")[0]) \
                   + int(statistical_data["second_period_hits"].split("-")[0]) \
                   + int(statistical_data["third_period_hits"].split("-")[0])) + \
               '-' \
               + \
               str(int(statistical_data["first_period_hits"].split("-")[1]) \
                   + int(statistical_data["second_period_hits"].split("-")[1]) \
                   + int(statistical_data["third_period_hits"].split("-")[1]))

        statistical_data["score"] = score
        statistical_data["moment_end_match"] = moment_end_match
        statistical_data["shots_on_goal"] = shots_on_goal
        statistical_data["power_play_goals"] = power_play_goals
        statistical_data["faceoffs_won"] = faceoffs_won
        statistical_data["hits"] = hits

        # pабираем тренера команды в этом матче
        loading = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, '#detail>div.filterOver.filterOver--indent>div>a:nth-child(3)'))
        )
        loading.click()

        self.__driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        list_teams = match_name.split("-")

        loading = WebDriverWait(self.__driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".lf__sides"))
        )
        list_coaches = self.__driver.find_elements(By.CSS_SELECTOR,
                                                   ".lf__sides")[-1].text.split()

        if list_teams[0] == statistical_data["team"]:
            coach = list_coaches[0] + " " + list_coaches[1]
        elif list_teams[1] == statistical_data["team"]:
            coach = list_coaches[2] + " " + list_coaches[3]
        else:
            raise ValueError("Тренер не найден")

        statistical_data["coach"] = coach

        return statistical_data

    def parsing_penalty_time(self):

        dictionary_penalty_time = {"first_period_penalties": "", "second_period_penalties": "",
                                   "third_period_penalties": "", "penalties": ""}

        count_events_home_team = 0
        count_events_away_team = 0
        penalty_list_home_team = [0, 0, 0]
        penalty_list_away_team = [0, 0, 0]

        headers = self.__driver.find_elements(By.CSS_SELECTOR, '.smv__incidentsHeader.section__title')

        # если заголовки пусты, обновляем страницу и пытаемся их получить еще раз
        while len(headers) == 0:
            self.__driver.refresh()
            headers = self.__driver.find_elements(By.CSS_SELECTOR, '.smv__incidentsHeader.section__title')

        for i in range(2, -1, -1):
            events_home_team = headers[i].find_elements(By.XPATH,
                                                        'following-sibling::div[contains(@class, "homeParticipant")]')
            events_away_team = headers[i].find_elements(By.XPATH,
                                                        'following-sibling::div[contains(@class, "awayParticipant")]')

            events_home_team = events_home_team[0:len(events_home_team) - count_events_home_team]
            events_away_team = events_away_team[0:len(events_away_team) - count_events_away_team]

            count_events_home_team += len(events_home_team)
            count_events_away_team += len(events_away_team)

            for event_home_team in events_home_team:
                penalty_time = event_home_team.find_elements(By.CLASS_NAME, "penalty-2-min ")
                penalty_list_home_team[i] += len(penalty_time)

            for event_away_team in events_away_team:
                penalty_time = event_away_team.find_elements(By.CLASS_NAME, "penalty-2-min ")
                penalty_list_away_team[i] += len(penalty_time)

        penalties_home = penalty_list_home_team[0] + penalty_list_home_team[1] + penalty_list_home_team[2]
        penalties_away = penalty_list_away_team[0] + penalty_list_away_team[1] + penalty_list_away_team[2]

        dictionary_penalty_time["first_period_penalties"] = f"{penalty_list_home_team[0]} - {penalty_list_away_team[0]}"
        dictionary_penalty_time[
            "second_period_penalties"] = f"{penalty_list_home_team[1]} - {penalty_list_away_team[1]}"
        dictionary_penalty_time["third_period_penalties"] = f"{penalty_list_home_team[2]} - {penalty_list_away_team[2]}"
        dictionary_penalty_time["penalties"] = f"{penalties_home} - {penalties_away}"

        return dictionary_penalty_time

# p = Parser(url="https://www.flashscorekz.com/hockey/russia/khl/standings/#/r98K8eb7/table/overall")
# p.parsing()
# time.sleep(100)
