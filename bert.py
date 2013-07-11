from pkg_resources import resource_filename
import tornado.ioloop
import tornado.web
from spritesheet_handler import SpriteSheetHandler


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

        
def main():
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/spritesheets", SpriteSheetHandler, {'directory':resource_filename('bert',"www/static/images")})
    ],
    static_path=resource_filename('bert',"www/static"),
    template_path=resource_filename('bert',"www"),
    debug=True)

    application.listen(8080)
    print "listening on port 8080"
    tornado.ioloop.IOLoop.instance().start()
    
    
if __name__ == "__main__":
    main()