from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import mysql.connector
from django.conf import settings
from django.db import IntegrityError



class UserLogin(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Fetch user data from MySQL DB
        try:
            cnx = mysql.connector.connect(
                host='f3ace87a80b1',
                user='root',
                password='2020',
                database='admin'
            )

            cursor = cnx.cursor()
            query = "SELECT id, username, email FROM registration_service_user WHERE email = %s AND password = %s"
            values = (email, password)
            cursor.execute(query, values)
            result = cursor.fetchall()
            cursor.close()
            cnx.close()

            if result:
                user_data = result[0]  # Assuming only one row is returned
                id, username, email = user_data
                return Response({
                    'message': 'Login successful',
                    'id': id,
                    'username': username,
                    'email': email
                }, status=status.HTTP_200_OK)
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class UserLogin(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         # Fetch user data from MySQL DB
#         try:
#             cnx = mysql.connector.connect(
#                 host='cdceed1884ab',
#                 user='root',
#                 password='2020',
#                 database='admin'
#             )

#             cursor = cnx.cursor()
#             query = "SELECT * FROM registration_service_user WHERE email = %s AND password = %s"
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
