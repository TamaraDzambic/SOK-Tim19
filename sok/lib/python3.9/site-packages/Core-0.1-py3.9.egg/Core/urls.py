from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('load_graph', views.load_graph, name='load_graph'),
    path('tree_view', views.tree_view, name='tree_view'),
    path('bird_view', views.bird_view, name='bird_view'),
    path('main_view/<str:id>', views.main_view, name='main_view'),
    path('search', views.search, name="search"),
    path('filter', views.filter, name="filter"),
    path('restart', views.restart, name="restart"),
    path('get_children', views.get_children, name="get_children"),
]