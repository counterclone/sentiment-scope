
import pandas as pd
import time
import os
import matplotlib.pyplot as plt
import copy
import string
import sys
import sys
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')


import twitterbot_r as tb



hashtag=[""]




#============================================================================

#=================================================================================



lst= 0
rate=2

file_path = "C:/Users/devan/Desktop/work/sentiment_scope_react/backend/input.txt"
with open(file_path, 'r') as file:
    lst = file.read().strip()  # Read and remove any extra whitespace

file_path="C:/Users/devan/Desktop/work/sentiment_scope_react/backend/rate.txt"
with open(file_path, 'r') as file:
    rate = int(file.read())
print(f"Variable value: {lst}")

lst=lst.replace(" ","+")
print("new list",lst)
l=[lst]
#st.write(hashtag)

#st.write("login started")
bot = tb.Twitterbot( )
#bot.login(1)
        
#st.write("login finished")
#get clean-text tweets

tweets,usernames,pure_tweet =bot.get_tweets(l,rate)
print("done")

df=pd.DataFrame({'username':usernames,'tweet':tweets})
df.dropna(subset=['tweet'], inplace=True)

df.to_csv('output_r.csv', index=False)
print(df)
print("csv file saved")


        
                
