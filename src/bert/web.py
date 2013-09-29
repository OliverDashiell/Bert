from pkg_resources import resource_filename
import tornado.ioloop
import tornado.web
from upload_handler import UploadHandler


class MainHandler(tornado.web.RequestHandler):
    
    def initialize(self, page="index.html"):
        self.page = page
        
    def get(self):
        self.render(self.page, application=self.application)

        
def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/bert", MainHandler,{"page":"bert.html"}),
        (r"/maps", UploadHandler, {'directory':resource_filename('bert',"www/static/maps")}),
        (r"/spritesheets", UploadHandler, {'directory':resource_filename('bert',"www/static/images/spritesheets")})
    ],
    static_path=resource_filename('bert',"www/static"),
    template_path=resource_filename('bert',"www"),
    debug=True)

    application.listen(8080)
    print "listening on port 8080"
    tornado.ioloop.IOLoop.instance().start()
    
    
if __name__ == "__main__":
    main()