import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from joblib import dump

data = pd.read_csv("coding_data.csv")

X = data.drop("label", axis=1)
y = data["label"]

model = RandomForestClassifier()
model.fit(X, y)

dump(model, "model.joblib")
print("Model trained")

