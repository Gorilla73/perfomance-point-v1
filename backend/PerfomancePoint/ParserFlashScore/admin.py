from django.contrib import admin

from django.urls import path

from .models import *
from django.contrib import admin
from django.http import HttpResponseRedirect, request
from .parserMatches import *
from .parserShedule import *


#from .parserMatches import run_parser


# Register your models here.
@admin.register(Matches)
class MatchesAdmin(admin.ModelAdmin):

    change_list_template = "admin/model_matchesAdmin.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('parserKHL/', self.parserKHL),
            path('parserNHL/', self.parserNHL),
        ]
        return my_urls + urls

    def parserKHL(self, request):

        parser = Parser(url="https://www.flashscorekz.com/hockey/russia/khl/standings/#/r98K8eb7/table/overall")

        self.message_user(request, "Парсер КХЛ запущен...")
        parser.parsing()

        self.message_user(request, "Данные успешно загружены и сохранены")
        return HttpResponseRedirect("../")

    def parserNHL(self, request):

        parser = Parser(url="https://www.flashscorekz.com/hockey/usa/nhl/standings/#/jovutXrt/table/overall")
        self.message_user(request, "Парсер НХЛ запущен...")
        parser.parsing()

        self.message_user(request, "Данные успешно загружены и сохранены")
        return HttpResponseRedirect("../")


@admin.register(MatchesShedule)
class MatchesShedule(admin.ModelAdmin):

    change_list_template = "admin/model_matchesSheduleAdmin.html"
    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('parserSheduleKHL/', self.start_parser_sheduleKHL),
            path('parserSheduleNHL/', self.start_parser_sheduleNHL),
        ]
        return my_urls + urls

    def start_parser_sheduleKHL(self, request):

        parser = ParserShedule(url="https://www.flashscorekz.com/hockey/russia/khl/fixtures/")
        self.message_user(request, "Парсер расписания КХЛ запущен...")
        parser.parsing()

        self.message_user(request, "Данные успешно загружены и сохранены")
        return HttpResponseRedirect("../")

    def start_parser_sheduleNHL(self, request):

        parser = ParserShedule(url="https://www.flashscorekz.com/hockey/usa/nhl/fixtures/")
        self.message_user(request, "Парсер расписания НХЛ запущен...")
        parser.parsing()

        self.message_user(request, "Данные успешно загружены и сохранены")
        return HttpResponseRedirect("../")


admin.site.register(Championship)
admin.site.register(Teams)