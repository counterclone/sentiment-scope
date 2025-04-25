from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
import pandas as pd
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Set the path via environment variable


print("merging files")

# Define file names and their corresponding sources
files = {
    "output_q.csv": "quora",
    "output_t.csv": "twitter",
    "output_r.csv": "reddit"
}

# Initialize an empty list to store dataframes
dataframes = []

# Read each file, add the source column, and append to the list
for file, source in files.items():
    try:
        df = pd.read_csv(file)
        df['source'] = source
        dataframes.append(df)
    except FileNotFoundError:
        print(f"File not found: {file}")

# Concatenate all dataframes
merged_df = pd.concat(dataframes, ignore_index=True)

# Save the merged dataframe to output.csv
merged_df.to_csv("output.csv", index=False)
print("Merge complete")

# Start analysis
print("Starting analysis...")

# Initialize the model and tokenizer
roberta = "cardiffnlp/twitter-roberta-base-sentiment"
model = AutoModelForSequenceClassification.from_pretrained(roberta)
tokenizer = AutoTokenizer.from_pretrained(roberta)

labels = ['Negative', 'Neutral', 'Positive']

# Function to process text
def process(text):
    # Tokenize the text with padding and truncation
    return tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=512)

# Function to compute sentiment
def sentiment(text):
    try:
        enct = process(text)
        enct.pop("token_type_ids", None)  # Ensure compatibility with RoBERTa
        output = model(**enct)
        scores = output.logits[0].detach().numpy()
        scores = softmax(scores)
        dic = {scores[i]: labels[i] for i in range(len(scores))}
        return dic[max(dic.keys())]  # Return the label with the highest score
    except Exception as e:
        print(f"Error processing text: {text[:100]}...: {e}")
        return "Error"

# Prepare data for classification
if 'tweet' not in merged_df.columns:
    st.error("The 'tweet' column is missing in the merged dataframe.")
else:
    # Drop rows with missing tweets
    newdf = merged_df.dropna(subset=['tweet'])

    # Perform sentiment classification
    
    try:
        newdf['type'] = newdf['tweet'].apply(sentiment)
    except Exception as e:
        print(f"Error during sentiment classification: {e}")
    
    # Save results to a new CSV file
    output_path = 'results.csv'
    newdf.to_csv(output_path, index=False)
    print("Classification complete. Results saved to:", output_path)

    # Display the resulting dataframe in Streamlit
    print(newdf)

