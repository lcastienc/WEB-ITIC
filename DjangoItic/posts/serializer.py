from rest_framework import serializers
from .models import Post, PostImage

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']

class PostSerializer(serializers.ModelSerializer):
    featured_images = PostImageSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = ['id', 'title', 'main_content', 'author', 'created_date', 'updated_date', 'featured_images']
        read_only_fields = ['created_date', 'updated_date']

    def create(self, validated_data):
        images_data = self.context['request'].FILES.getlist('featured_images')
        post = Post.objects.create(**validated_data)
        for image_data in images_data:
            PostImage.objects.create(post=post, image=image_data)
        return post
