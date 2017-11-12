import os
import tornado.ioloop
import tornado.web
import tornado.log
from datetime import datetime
from pytz import timezone
import pytz
import urllib.parse
import requests
import json
from rapidconnect import RapidConnect
from jinja2 import \
  Environment, PackageLoader, select_autoescape
ENV = Environment(
  loader=PackageLoader('myapp', 'templates'),
  autoescape=select_autoescape(['html', 'xml'])
)
PORT = int(os.environ.get('PORT', '8888'))

class TemplateHandler(tornado.web.RequestHandler):
  def render_template (self, tpl, context):
    template = ENV.get_template(tpl)
    self.write(template.render(**context))

class MainHandler(TemplateHandler):
  def get(self):
    self.set_header(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, max-age=0')
    self.render_template("index.html", {})
class MicrosoftAIHandler(TemplateHandler):
    def post(self):
        url = self.get_body_argument('url')
        rapid = RapidConnect("default-application_59dda5c4e4b04627fc65932d", "50647dfc-4872-43d2-a233-87ea46cc35e7")

        result = rapid.call('MicrosoftComputerVision', 'describeImage', {
        	'subscriptionKey': 'e67939b51a3f4cd3b11da510fbed6d0b',
        	'image': url,
        	'region': 'westcentralus'
        })
        data = json.loads(result) #it is a dictionary
        tags = data.get('description').get('tags') #iterate this
        caption = data.get('description').get('captions')[0].get('text')
        confidence = data.get('description').get('captions')[0].get('confidence')*100
        self.render_template("microsoft-recognition.html", {'tags':tags, 'caption':caption, 'confidence':confidence})
class FaceDetectAIHandler(TemplateHandler):
    def post(self):
        url = self.get_body_argument('url')
        clean_url = urllib.parse.quote_plus(url)

        r = requests.get("https://faceplusplus-faceplusplus.p.mashape.com/detection/detect?attribute=glass%2Cpose%2Cgender%2Cage%2Crace%2Csmiling&url=" + clean_url,
          headers={
            "X-Mashape-Key": "DHIgOSjvISmshwNj2QfspbJAfROxp1KQPe0jsnuoKKCaVA7y6J",
            "X-Mashape-Host": "faceplusplus-faceplusplus.p.mashape.com"
          }
        )
        data = r.json()
        age = data.get('face')[0].get('attribute').get('age').get('value')
        age_range = data.get('face')[0].get('attribute').get('age').get('range')
        gender = data.get('face')[0].get('attribute').get('gender').get('value')
        gender_confidence = data.get('face')[0].get('attribute').get('gender').get('confidence')
        race = data.get('face')[0].get('attribute').get('race').get('value')
        race_confidence = data.get('face')[0].get('attribute').get('race').get('confidence')
        glass = data.get('face')[0].get('attribute').get('glass').get('value')
        face_id = data.get('face')[0].get('face_id')
        smile_score = data.get('face')[0].get('attribute').get('smiling').get('value')
        if smile_score < 50:
            smile = 'Not smiling'
        url = data.get('url')
        self.render_template("microsoft-emotion.html", {'face_id':face_id, 'age': age, 'age_range':age_range, 'gender': gender, 'gender_confidence':gender_confidence, 'race':race, 'race_confidence': race_confidence, 'glass':glass, 'smile':smile, 'url':url})
class TimezoneHandler(TemplateHandler):
    def post(self):
        year = int(self.get_body_argument('year'))
        month = int(self.get_body_argument('month'))
        day = int(self.get_body_argument('day'))
        hour = int(self.get_body_argument('hour'))
        minute = int(self.get_body_argument('minute'))
        second = 0
        intz = self.get_body_argument('intz')
        outtz = self.get_body_argument('outtz')

        tzin = timezone(intz)
        tzout = timezone(outtz)

        dt = tzin.localize(datetime(year, month, day, hour, minute, second))

        time = dt.astimezone(tzout)

        self.render_template("result.html", {'time':time})

def make_app():
    return tornado.web.Application([
    (r"/", MainHandler),
    (r"/timezone", TimezoneHandler),
    (r"/see", MicrosoftAIHandler),
    (r"/feel", FaceDetectAIHandler),
    (
      r"/static/(.*)",
      tornado.web.StaticFileHandler,
      {'path': 'static'}
    ),
    ], autoreload=True)

if __name__ == "__main__":
    tornado.log.enable_pretty_logging()
    app = make_app()
    app.listen(PORT, print('Server started on localhost:' + str(PORT)))
    tornado.ioloop.IOLoop.current().start()
