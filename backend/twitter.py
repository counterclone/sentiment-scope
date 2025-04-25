
import pandas as pd
import time
import os

from scipy.special import softmax
import matplotlib.pyplot as plt
import copy
import string
import sys
import sys
sys.stdout.reconfigure(encoding='utf-8')


import sys
import os

# Set the path via environment variable

# Import the file
import twitterbot_t as tb

# Use the imported file's content





os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

hashtag=[""]




#============================================================================
def process(text):
        encoded_tweet = tokenizer(text, return_tensors='pt')
        return encoded_tweet

def sentiment(text):
        enct=process(text)
        output=model(**enct)
        scores = output[0][0].detach().numpy()
        scores = softmax(scores)
        dic={}
        for i in range(len(scores)):
            dic[scores[i]]=labels[i]
        # return max(dic.keys())
        return dic[max(dic.keys())]
#=================================================================================

file_path = "C:/Users/devan/Desktop/work/sentiment_scope_react/backend/input.txt"
lst=0
# Open the file and read the content
with open(file_path, 'r') as file:
    lst = file.read()  # Read and remove any extra whitespace

# Print the value
print(f"Variable value: {lst}")

rate=2
file_path="C:/Users/devan/Desktop/work/sentiment_scope_react/backend/rate.txt"
with open(file_path, 'r') as file:
    rate = int(file.read())

lst=lst.replace(" ","%20")

l=[lst]
#st.write(hashtag)
k=0

bot = tb.Twitterbot( )
bot.login(3)
        

tweets,usernames,pure_tweet =bot.get_tweets(l,rate)
print("done")

df=pd.DataFrame({'username':usernames,'tweet':tweets})
df.dropna(subset=['tweet'], inplace=True)

df.to_csv('output_t.csv', index=False)
print(df)
print("csv file saved")

# print("started analysis" )
# st.write("analysis started")
# words=pd.read_csv("Hate speech words - Sheet1.csv")
# df=pd.read_csv("output_t.csv")
# newdf=df.dropna()

# roberta = "cardiffnlp/twitter-roberta-base-sentiment"

# model = AutoModelForSequenceClassification.from_pretrained(roberta)
# tokenizer = AutoTokenizer.from_pretrained(roberta)

# labels = ['Negative', 'Neutral', 'Positive']



# #classification of tweets

# newdf['type']=newdf['tweet'].apply(lambda text:sentiment(text))

# output_path='results_t.csv'
# newdf.to_csv(output_path,index=False)

# #read the classification file
# res=pd.read_csv("results_t.csv")
# output_path='results_t.csv'
# # st.write(newdf.to_markdown(index=False))
# st.dataframe(newdf,width=2000,height=700)
# res.to_csv(output_path,index=False)
# print("completed")
# st.write("switch to show tab")


        
                
