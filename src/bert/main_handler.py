'''
Created on 29 Sep 2013

@author: dash
'''
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    
    def initialize(self, page="index.html"):
        self.page = page
        
    def get(self):
        self.render(self.page, application=self.application)
