from django.db import models

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=225)
    main_content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    author = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.title} {self.main_content} {self.created_date} {self.updated_date} {self.author}'

class PostImage(models.Model):
    post = models.ForeignKey(Post, related_name='featured_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/')

    def __str__(self):
        return f"Image for {self.post.title} {self.image}"