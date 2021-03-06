from pkg_resources import resource_filename #@UnresolvedImport
import tornado.ioloop
import tornado.web
from upload_handler import UploadHandler
from bert.main_handler import MainHandler

    
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