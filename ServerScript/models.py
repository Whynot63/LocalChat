from django.db import models

class ChatPoint(models.Model):
	chat_name = models.CharField(max_length=200)
	x = models.CharField(max_length=19)
	y = models.CharField(max_length=19)
	

class ChatMessage(models.Model):
	chat_id = models.CharField(max_length=30)
	message = models.TextField()
	time = models.DateTimeField(auto_now=True)
	author = models.CharField(max_length=50)