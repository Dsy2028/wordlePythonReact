from flask import Flask, request, jsonify
import os
import random
import json
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key for the session
CORS(app)

current_word = None

@app.route('/api/start', methods=['POST'])
def start():
    global current_word
    with open('api/words.json', 'r') as f:
        data = json.load(f)
    current_word = random.choice(data)
    return jsonify({ 'message': 'Game started', 'target_word': current_word })

@app.route('/api/submit', methods=['POST'])
@cross_origin()
def submit():
    global current_word
    data = request.get_json()
    guess = data['guess']

    statuses = []
    print(guess, statuses)
    for i, char in enumerate(guess):
        if char == current_word[i]:
            statuses.append('correct')
        elif char in current_word:
            statuses.append('yellow')
        else:
            statuses.append('incorrect')

    if guess == current_word:
        result = 'Correct'
    else:
        result = 'Incorrect'
    return jsonify({ 'result': result, 'statuses': statuses })
if __name__ == '__main__':
    app.run(debug=True)