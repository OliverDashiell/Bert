'''
Created on 29 Sep 2013

@author: dash
'''
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    ''' returns the index page by default or the specified page '''
    
    def initialize(self, page="index.html"):
        self.page = page
        
    def get(self):
        self.render(self.page, application=self.application)
