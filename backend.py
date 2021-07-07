from __future__ import print_function
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy
from sqlalchemy import func

import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///profDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] =  False

db = sqlalchemy.SQLAlchemy(app)


class Professor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    lastname = db.Column(db.String(30))
    affiliate = db.Column(db.String(100))
    school = db.Column(db.String(100))
    overall_rating = db.Column(db.Float,default = -1.0)

    def __init__(self,name,lastname,affiliate,school):
        self.name = name
        self.lastname = lastname
        self.affiliate = affiliate
        self.school = school
    # FINISH ME (TASK 2): add all of the columns for the other table attributes



class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prof_id = db.Column(db.String(10))
    review_text = db.Column(db.String(500))
    rating = db.Column(db.Float)
    created_at = db.Column(db.DateTime,default = datetime.datetime.utcnow)    
    # FINISH ME (TASK 2): add all of the columns for the other table attributes
    def __init__(self,prof_id,review_text,rating):
        self.prof_id = prof_id
        self.review_text = review_text
        self.rating = rating



base_url = '/api/'

# loads all professors
# route parameters:
#     (optional) count : if count parameter is specified, limits the number of professorrs by count
#     (optional) order_by : if order_by is specified, orders the results by order_by
# Response format is JSON
@app.route(base_url + 'allprofs', methods=['GET'])
def getAllProfs():
    count = request.args.get('count', None)
    order_by = request.args.get('order_by', None)

    order = None # store the results of your query here 
    
    # FINISH ME (Task 3) : set the column which you are ordering on (if order_by parameter provided)
    if order_by == "lastname":
        order = Professor.lastname
    elif order_by == "name":
        order = Professor.name
    elif order_by == "overall_rating":
        order = Professor.overall_rating.desc()
    elif order_by == "school":
        order = Professor.school
    
    if order is not None:
        query = Professor.query.order_by(order)
    else:
        query = Professor.query.all()

    # FINISH ME (Task 3) : limit the number of profesoors based on the count (if count parameter is provided)
    if count is not None:
        query = query.limit(count).all()

    result = []
    for row in query:
        result.append(
            row_to_obj_prof(row)
        )

    return jsonify({"status": 1, "professors": result})

# createProf
# creates a professor 
# The routes response includes  the information of the new professor in the response
# Response format is JSON
# FINISH ME (Task 4) : Create the route for POST newprofessor
@app.route(base_url + 'newprofessor', methods=['POST'])
def createProf():

    data = request.get_json()
    newprof = Professor(data["name"],data["lastname"],data["affiliate"],data["school"])
    db.session.add(newprof)
    db.session.commit()

    db.session.refresh(newprof)

    return jsonify({"status": 1, "professor" : row_to_obj_prof(newprof)}),200


# addReview
# creates a review for the professor with the given id
# calculates and updates the new avarage rating for the professor after the new review is posted
# The route response includes both the review info and the updated professor info. 
# Response format is JSON
# FINISH ME (Task 5) : Create the route for POST addreview
@app.route(base_url + 'addreview', methods=['POST'])
def createReview():


    data = request.get_json()
    newReview = Reviews(data["prof_id"],data["review_text"],data["rating"])

    if newReview.prof_id is None:
        return {"status" : -1, "error": "Professor ID Invalid"}, 500

    prof = Professor.query.filter_by(id = newReview.prof_id).first()

    query = Reviews.query.filter_by(prof_id = newReview.prof_id).all()


    x = 0.0
    y = 0.0
    for row in query:
        x = x + row.rating
        y = y + 1

    x = x + float(newReview.rating)
    y = y + 1

    prof.overall_rating = x / y

    db.session.add(newReview)
    db.session.commit()
    db.session.refresh(newReview)


    return jsonify({"status": 1,"review" : row_to_obj_review(newReview), "professor" : row_to_obj_prof(prof)}),200



# getreviews
# gets all reviews for the given professor
# route parameters:
#     profID :  filters the reviews based on the profID. If profID is not specified, the response will be empty. 
#     (optional) count : if count parameter is specified, limits the number of professorrs by count
#     (optional) order_by : if order_by is specified, orders the results by order_by
# Response format is JSON

# FINISH ME (Task 6) : Create the route for GET getreviews
@app.route(base_url + 'getreviews', methods=['GET'])
def getProf():

    proid = request.args.get('profID',None)
    if proid is None:
        return({"status" : -1, "error" : "Professor ID Invalid"}),500

    count = request.args.get('count', None)
    order_by = request.args.get('order_by', None)

    order = None # store the results of your query here 
    
    # FINISH ME (Task 3) : set the column which you are ordering on (if order_by parameter provided)
    if order_by == "rating":
        order = Revies.rating.desc()
    elif order_by == "review_text":
        order = Reviews.review_text
    elif order_by == "created_at":
        order = Reviews.created_at.desc()
    
    if order is not None:
        query = Reviews.query.filter_by(prof_id = proid).order_by(order)
    else:
        query = Reviews.query.filter_by(prof_id = proid).all()

    # FINISH ME (Task 3) : limit the number of profesoors based on the count (if count parameter is provided)
    if count is not None:
        query = query.limit(count).all()

    result = []
    for row in query:
        result.append(
            row_to_obj_review(row)
        )

    return jsonify({"status": 1, "reviews": result}),200





# delete_professors
# delete given an id
@app.route(base_url + 'remove', methods=['DELETE'])
def delete_professors():
    myid = request.args.get('id', None)
    if myid is None:
        return({"status" : -1, "error" : "Professor ID Invalid"}),500
    # FINISH ME (Task 7) : Complete the route for DELETE professor;
    # should first delete the reviews provided for the professor then the professor him/herself
    delRev = Reviews.query.filter_by(prof_id = myid).delete()
    delProf = Professor.query.filter_by(id = myid).delete()
    db.session.commit()
    return({"status" : 1}),200




    

def row_to_obj_prof(row):
    myrow = {
            "id": row.id,
            "name": row.name,
            "lastname": row.lastname,
            "affiliate": row.affiliate,
            "school": row.school,
            "overall_rating": row.overall_rating
        }
    return myrow

def row_to_obj_review(row):
    myrow = {
            "id": row.id,
            "prof_id": row.prof_id,
            "review_text": row.review_text,
            "rating": row.rating,
            "created_at": row.created_at
        }
    return myrow

def main():
    db.create_all()  # creates the tables you've provided
    app.run()        # runs the Flask application  

if __name__ == '__main__':
    app.debug = True
    main()
