from django.db import models

class ChatPoint(models.Model):
    def __str__(self):
        return str(self.chat_name)

    chat_name = models.CharField(max_length=200)
    x = models.CharField(max_length=19)
    y = models.CharField(max_length=19)


class ChatMessage(models.Model):
    def __str__(self):
        return str(self.chat_id) + ' -> ' + str(self.message)

    chat_id = models.CharField(max_length=30)
    message = models.TextField()
    time = models.DateTimeField(auto_now=True)
    author = models.CharField(max_length=50)
