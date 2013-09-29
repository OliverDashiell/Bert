

import tornado.web
import tornado.escape
import os


class UploadHandler(tornado.web.RequestHandler):
    """
        Get returns a list of files in a directory
        
        Post accepts files to upload to a directory
    
        directory is specified in initialization.
    """
    
    def initialize(self, directory):
        """initialized from the parameters passed to handlers"""
        self.directory = directory
        
        
    def list_directory(self):
        """returns a list of file names in directory"""
        return os.listdir(self.directory)
    
    
    def get(self):
        """returns list of filename as json list"""
        self.add_header("content-type","text/json")
        self.write(tornado.escape.json_encode(self.list_directory()))
        
        
    def post(self):
        if self.request.files.has_key("file1"):
            file1 = self.request.files['file1'][0]
            original_fname = file1['filename']
    
            output_file = open(os.path.join(self.directory,original_fname), 'wb')
            output_file.write(file1['body'])
        
        self.get()
        
        
    
