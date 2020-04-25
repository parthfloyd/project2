import os
import requests

from flask import Flask, render_template, request, session, jsonify
from flask_socketio import SocketIO, emit
from flask_session import Session #to store session on server side

#Global Variables
channelsList = list()

#Configuring app
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

Session(app)
socketio = SocketIO(app)


@app.route("/" ,methods=["get","post"])
def index():
	return render_template("index.html"	)

@app.route("/channels")
def channels():
	return render_template("channels.html")

#Username
@socketio.on('userCreated')
def addUser(data):
	pass
	#session['username'] = data['username']
	#emit('channelListSent',broadcast=True)

#Creating channel
@socketio.on('channelCreateRequest')
def createChannel(data):
	channelName = data['channelName']
	if(channelsList.count(channelName) != 0 ):
		emit('channelExists',{"channelName" : channelName},broadcast=True)
	else:
		channelsList.append(channelName)
		emit('channelCreated',{"channelName" : channelName},broadcast=True)
