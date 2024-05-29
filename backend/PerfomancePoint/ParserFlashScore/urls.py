from django.urls import path

from .views import get_championships, get_match, get_matches_with_filter, get_csrf_token, \
    get_matches_head_to_head_with_filter, get_championship, table_championship, get_team, get_matches_team_with_filter

app_name = 'ParserFlashScore'


urlpatterns = [
    path('get_csrf_token/', get_csrf_token, name='get_csrf'),
    path('get_matches_by_date/', get_championships, name="championship-list"),
    path('get_match/<int:id_match>/', get_match, name='match'),
    path('get_match/get_matches_with_filter/<int:id_match>/', get_matches_with_filter, name='matches_with_filter'),
    path('get_match/get_matches_with_filter/head_to_head/<int:id_match>/', get_matches_head_to_head_with_filter, name='matches_head_to_head_with_filter'),
    path('get_championship/<int:id_championship>/', get_championship, name='championship'),
    path('get_championship/table_championship/<int:id_championship>/', table_championship, name='table_championship_with_filter'),
    path('get_team/<int:id_team>', get_team, name='team'),
    path('get_team/get_matches_team_with_filter/<int:id_team>/', get_matches_team_with_filter, name='matches_team_with_filter')
]