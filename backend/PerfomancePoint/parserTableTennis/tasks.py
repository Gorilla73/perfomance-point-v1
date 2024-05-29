from celery import shared_task
from parserResultTableTennis import ParserResultTableTennis
from parserUpcomingTableTennis import ParserUpcomingTableTennis


@shared_task
def parse_results():
    parser = ParserResultTableTennis()
    parser.parsing("2024-05-16", "2024-05-17")


@shared_task
def parse_upcoming():
    parser = ParserUpcomingTableTennis()
    parser.parsing()
