from django.shortcuts import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.core import serializers
from ServerScript.models import ChatPoint
from ServerScript.models import ChatMessage
import datetime
import json

# Create your views here.
def set_chatpoint(request):
	x_ = request.GET['x']
	y_ = request.GET['y']
	chat_name_ = request.GET['chat_name']
	query = ChatPoint(chat_name = chat_name_, x=x_, y=y_)
	query.save()
	return HttpResponse(query.pk)

def print_chatpoint_array(request):
	return HttpResponse(serializers.serialize("json", ChatPoint.objects.all()))

def create_message(request):
	chat_id_ = request.GET['chat_id']
	time_ = datetime.datetime.now()
	message_ = request.GET['message']
	author_ = request.GET['author']
	query = ChatMessage(chat_id = chat_id_, time=time_, message=message_, author=author_)
	query.save()
	return HttpResponse(chat_id_)

def print_chatmessages_array(request):
	if 'chat_id' in request.GET:
		return HttpResponse(serializers.serialize("json", ChatMessage.objects.filter(chat_id=request.GET['chat_id'])))
	else:
		return HttpResponse(serializers.serialize("json", ChatMessage.objects.all()))

def map_with_points(request):
	if 'username' in request.COOKIES:	
		return render(request, 'map.html')
	else:
		return render(request, 'first_visit.html')

def page404(request):
	return render(request, '404.html')

def not_found(request):
        return HttpResponseRedirect('/404')
