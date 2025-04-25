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



cred =pd.read_csv("cred_t.csv")
k=3

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
        
        

        

    def login(self,k):
        bot=self.bot
        time.sleep(2)
        self.email =cred['username'][k]
        self.password= cred['password'][k]
        print("login started")
        #bot.get('https://twitter.com/i/flow/login?input_flow_data=%7B"requested_variant"%3A"eyJsYW5nIjoiZW4ifQ%3D%3D"%7D')
        #bot.get('https://twitter.com/i/flow/login')
        bot.get('https://twitter.com/i/flow/login')
        time.sleep(5)
        
        page_source = bot.page_source
        soup = BeautifulSoup(page_source,'html.parser')
        #email=bot.find_element(By.NAME,'text')
        email=WebDriverWait(self.bot, 10).until(
            EC.element_to_be_clickable((By.NAME,'text'))
        )
        email.send_keys(self.email)
        time.sleep(2)
        button = WebDriverWait(self.bot, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="layers"]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2]'))
        )
        button.click()
        print("next clicked")
        time.sleep(2)
        page_source=bot.page_source
        soup = BeautifulSoup(page_source,'html.parser')
        #time.sleep(2)
        password = bot.find_element(By.NAME,'password')
        #password = bot.find_element(By.CSS_SELECTOR,'#react-root > div > div > div > main > div > div > div > div.css-175oi2r.r-1ny4l3l.r-6koalj.r-16y2uox > div.css-175oi2r.r-16y2uox.r-1jgb5lz.r-13qz1uu.r-1ye8kvj > div.css-175oi2r.r-1fq43b1.r-16y2uox.r-1wbh5a2.r-1dqxon3 > div > div > div > div.css-175oi2r.r-mk0yit.r-13qz1uu > div > label > div > div.css-175oi2r.r-18u37iz.r-16y2uox.r-1wbh5a2.r-1wzrnnt.r-1udh08x.r-xd6kpl.r-1pn2ns4.r-ttdzmv')
        password.send_keys(self.password)
        time.sleep(1)
        button = WebDriverWait(self.bot, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="layers"]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/button'))
        )
        button.click()
        
        print("login finished")
        time.sleep(5)
    
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
            lin=f'https://twitter.com/search?q={hashtag}&src=typed_query&f=live'
            print(lin)
            bot.get(lin)
            time.sleep(5)
            if(hashtag==""):
                i+=1
                continue

            while(t>0):
                page_source = bot.page_source
                soup = BeautifulSoup(page_source,'html.parser')
                t-=1
                # q= soup.find('div',{'class':'css-1dbjc4n'})
                q= soup.find('div',{'aria-label':'Timeline: Search timeline'})
                a=q.find_all('div',{'data-testid':'cellInnerDiv'})
                k=1 
                p=len(a)
                for b in a:
                    # u=b.find('div',{'class':'css-1dbjc4n r-zl2h9q'})
                    u=b.find('div',{'class':'css-175oi2r r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu'})
                    if(u==None):
                        continue
                    
                    c=u.find('span',{'class':'css-1jxf684 r-dnmrzs r-1udh08x r-1udbk01 r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3'})
                    
                    
                    c=c.find('span',{'class':'css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3'})
                    #user=remove_non_ascii(c.text)
                    user=c.text.encode('utf-8').decode('utf-8')


                    w=b.find_all('div',{'dir':'auto'})
                    for z in w:
                        
                        twet=""
                        m=z.find_all('span',{'class':'css-1jxf684'})
                        for g in m:
                            twet+=g.text
                        k+=1
                        
                        twet1=twet.encode('utf-8').decode('utf-8')
                        
                        z=keep_alphabets_and_spaces(remove_extra_spaces(remove_non_ascii(twet1)))
                        if z is not None or z !=" " or z != "  " or z !="   ":
                            tweets.append(z)
                            username.append(user)
                            pure_tweets.append(twet)    
                bot.execute_script('window.scrollTo(0,document.body.scrollHeight)')
                time.sleep(2)
            print(f"number of tweets fetched by {hashtag} = {p}")
            if(p==0):
                self.k+=1
                cv=self.k
                i-=1
                self.login(cv)
                continue
            i+=1
            num+=p
            time.sleep(1)
        
       
        self.close()
        return tweets,username,pure_tweets


       

     

        



            
