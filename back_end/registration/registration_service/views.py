from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
import pika
import json
import mysql.connector
from django.conf import settings
from django.db import IntegrityError

class UserRegistration(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Save user data to MySQL DB
                cnx = mysql.connector.connect(
                    host='f3ace87a80b1',
                    user='root',
                    password='2020',
                    database='admin'
                )

                cursor = cnx.cursor()
                query = "INSERT INTO registration_service_user (username, password, email) VALUES (%s, %s, %s)"
                values = (serializer.validated_data['username'], serializer.validated_data['password'], serializer.validated_data['email'])
                try:
                    cursor.execute(query, values)
                    cnx.commit()
                    cursor.close()
                    cnx.close()

                    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
                except IntegrityError:
                    return Response("Email already exists.", status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class UserRegistration(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             # Save user data to MySQL DB
#             try:
#                 cnx = mysql.connector.connect(
#                     host='e93e076e5f08',
#                     user='root',
#                     password='2020',
#                     database='admin'
#                 )

#                 cursor = cnx.cursor()
#                 query = "INSERT INTO authentication_user (username, password, email) VALUES (%s, %s, %s)"
#                 values = (serializer.data['username'], serializer.data['password'], serializer.data['email'])
#                 cursor.execute(query, values)
#                 cnx.commit()
#                 cursor.close()
#                 cnx.close()

#                 # Send message to RabbitMQ
#                 connection = pika.BlockingConnection(pika.URLParameters(settings.RABBITMQ_URL))
#                 channel = connection.channel()
#                 channel.queue_declare(queue='registration_queue')
#                 channel.basic_publish(exchange='', routing_key='registration_queue',
#                                       body=json.dumps({'email': serializer.data['email']}))
#                 connection.close()

#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#             except Exception as e:
#                 return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class UserLogin(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         # Fetch user data from MySQL DB
#         try:
#             cnx = mysql.connector.connect(
#                 host='e93e076e5f08',
#                 user='root',
#                 password='2020',
#                 database='admin'
#             )

#             cursor = cnx.cursor()
#             query = "SELECT * FROM authentication_user WHERE email = %s AND password = %s"
#             values = (email, password)
#             cursor.execute(query, values)
#             result = cursor.fetchall()
#             cursor.close()
#             cnx.close()

#             if result:
#                 print(True)
#                 return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
#             return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
#         except Exception as e:
#             return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
