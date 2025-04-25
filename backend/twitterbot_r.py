from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
import time, os
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def remove_non_ascii(input_string):
    return ''.join(char if ord(char) < 128 else '' for char in input_string)

def remove_extra_spaces(text):
    cleaned_text = re.sub(r'\s+', ' ', text)
    cleaned_text = cleaned_text.strip()
    return cleaned_text

def keep_alphabets_and_spaces(input_string):
    cleaned_string = re.sub(r'[^a-zA-Z\s]', '', input_string)
    return cleaned_string

def remove_duplicates(input_list):
    seen = set()
    result = []
    for item in input_list:
        if item not in seen:
            result.append(item)
            seen.add(item)
    return result



#cred =pd.read_csv("cred_t.csv")
#k=3

def listToString(s):
    str1 = " "
    return (str1.join(map(str, s)))

class Twitterbot:
    
    def __init__(self):
       
        print("login")
        self.k=0
        edge_options = Options()  # Use EdgeOptions instead of ChromeOptions
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
        
        edge_options.add_argument(f'user-agent={user_agent}')
        #edge_options.add_argument("--headless=new")
        
        self.bot = webdriver.Edge( options=edge_options)  # Specify the path to msedgedriver
        
        

    
    
    def close(self):
        print("closed")
        self.bot.quit()

    def get_tweets(self, hashtag_list,l): 
        tweets=[]
        pure_tweets=[]
        username=[]
        bot=self.bot
        
        num=0
        i=0
        while i<len(hashtag_list):
            t=l
            p=0
            hashtag=hashtag_list[i]
            print(hashtag)

                    #https://twitter.com/search?q=hello&src=typed_query
                    #https://www.reddit.com/search/?q=gun&type=comments&cId=998593a8-6126-48b1-b24e-005a925d4a2d&iId=4f51f7c1-c2a0-4813-9c2a-507156689c91
            lin=f'https://www.reddit.com/search/?q={hashtag}&type=comments&cId=998593a8-6126-48b1-b24e-005a925d4a2d&iId=4f51f7c1-c2a0-4813-9c2a-507156689c91'
            bot.get(lin)
            time.sleep(5)
            if(hashtag==""):
                i+=1
                continue

            while(t>0):
                time.sleep(5)
                page_source = bot.page_source
                soup = BeautifulSoup(page_source,'html.parser')
                t-=1
                # q= soup.find('div',{'class':'css-1dbjc4n'})
                #q= soup.find('reddit-feed',{'label':'search-results-page-tab-comments'})
                
                #a=q.find_all('faceplate-tracker',{'data-testid':'search-comment'})
                a=soup.find_all('div',{'class':'p-md relative'})
                k=1 
                p=len(a)
                
                for b in a:
                    # u=b.find('div',{'class':'css-1dbjc4n r-zl2h9q'})
                    #b=b.find('div',{'class':'p-md relative'})
                    u=b.find('a')
                    if(u==None):
                        continue
                    
              
                    user=u.text.encode('utf-8').decode('utf-8')
                    user=remove_extra_spaces(user)
                    
                    #w=b.find_next_sibling("")
                    w=b
                    if w is None:
                        print("empty ->")
                        continue
                    #print("content: ",w.text)
                    w=w.find_all('p')
                    
                    twet=""
                    for p in w[:-1]:
                        twet+=p.text
                    twet1=twet.encode('utf-8').decode('utf-8')
                    
                    z=keep_alphabets_and_spaces(remove_extra_spaces(remove_non_ascii(twet1)))
                    if z is not None or z !=" " or z != "  " or z !="   ":
                        tweets.append(z)
                        username.append(user)
                        pure_tweets.append(twet)



                        """
                        m=z.find('span',{'class':'css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0'})
                        if m is not None:                
                            k+=1
                            pt=m.text.encode('utf-8')
                            z=keep_alphabets_and_spaces(remove_extra_spaces(remove_non_ascii(m.text)))
                            if z is not None or z !=" " or z != "  " or z !="   ":
                                tweets.append(z)
                                username.append(user)
                                pure_tweets.append(pt)
                                
                                
                                print(f"{user} : {z}")
                                #user=user.decode('utf-8')
                        """
                bot.execute_script('window.scrollTo(0,document.body.scrollHeight)')
                time.sleep(2)
            print(f"number of tweets fetched by {hashtag} = {p}")
            # if(p==0):
            #     self.k+=1
            #     cv=self.k
            #     i-=1
            #     self.login(cv)
            #     continue
            # i+=1
            # num+=p
            time.sleep(1)
            i+=1
        
        
        self.close()
        return tweets,username,pure_tweets


       

     

        



            
