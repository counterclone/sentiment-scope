import streamlit as st
# import twitterbot_q as tb
import pandas as pd
import time
import os
import random
from scipy.special import softmax

import sys
import os

# Set the path via environment variable


# Import the file
import twitterbot_q as tb



file_path = "C:/Users/devan/Desktop/work/sentiment_scope_react/backend/input.txt"
lst=0
# Open the file and read the content
with open(file_path, 'r') as file:
    lst = file.read() # Read and remove any extra whitespace

# Print the value
print(f"Variable value: {lst}")

rate=2
links=[]
file_path="C:/Users/devan/Desktop/work/sentiment_scope_react/backend/rate.txt"
with open(file_path, 'r') as file:
    rate = int(file.read())
lst=lst.replace(" ","%20")

l=[lst]


bot = tb.Twitterbot()
bot.login(0)


print("fetching data")
links = bot.get_tweets(l, rate)
df = pd.DataFrame({'links': links})
print("fetching complete, select a link ")
links=list(set(links))
df.to_csv('links_q.csv', index=False)



df=pd.read_csv("links_q.csv")
links = df["links"]
links =list(set(links))

links_selected = random.sample(links,rate)

tweets=[] 
usernames=[] 
pure_tweet=[]
for link in links_selected:
    time.sleep(5)
    twet, usr, pure_twet = bot.get_comments(link,2)
    tweets.extend(twet)
    usernames.extend(usr)
    pure_tweet.extend(twet)
# tweets, usernames, pure_tweet = bot.get_comments(link, rate)
    
    
    

    
    

# bot.close()
df = pd.DataFrame({'username': usernames, 'tweet': tweets})
df.dropna(subset=['tweet'], inplace=True)
df.to_csv('output_q.csv', index=False)
print(df)
print("file saved")
bot.close()

    