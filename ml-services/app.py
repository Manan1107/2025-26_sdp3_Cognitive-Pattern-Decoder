from flask import Flask, request, jsonify
from joblib import load

model = load("model.joblib")
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    d = request.json
    result = model.predict([[
        d["typingCount"],
        d["backspaceCount"],
        d["pasteCount"],
        d["pasteChars"],
        d["avgPause"]
    ]])
    return jsonify({"style": result[0]})

app.run(port=8000)
#change