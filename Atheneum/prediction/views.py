from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from prediction.apps import PredictionConfig
import pandas as pd
import joblib

# Create your views here.
# Class based view to predict based on model


class BookRecommendationAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def PredictRatingForAllBooks(self, books, user_id, model):
        '''
        books: books dataFrame which contains book_id as index along with bookname,genre,summary and ratings
        user_id: id of user from trained data
        model:SVD Model for predicting ratings loaded from SVD.joblib
        '''
        Pred = []
        for book_id in books.index:
            predicted_res = model.predict(user_id, book_id, verbose=False)
            res = {"Predicted_Rating": predicted_res[3],
                   "Book_Id": predicted_res[1],
                   "Book_Name": books.loc[book_id, 'book_name'],
                   "Book_Genre": books.loc[book_id, 'genre'],
                   "Book_Summary":books.loc[book_id,'summary'],
                   "Book_Rating": books.loc[book_id, 'ratings']}
            Pred.append(res)
        return Pred

    def post(self, request, format=None):

        user_id = request.data['user_id']

        booksDataFrame = pd.read_csv(PredictionConfig.DATA_FILE, index_col='book_id')[
            ['book_name', 'genre', 'summary', 'ratings']]

        model = PredictionConfig.Recommendation_Engine

        Pred = self.PredictRatingForAllBooks(
            booksDataFrame, user_id,model)
        result = pd.DataFrame(Pred).sort_values(
            'Predicted_Rating', ascending=False).head().reset_index().T.to_dict()
        
        return Response(result, status=200)
