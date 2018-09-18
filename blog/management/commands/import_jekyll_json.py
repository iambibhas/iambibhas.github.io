from django.core.management.base import BaseCommand, CommandError
import json
from urllib import parse
from dateutil import parser

from blog.models import BlogPage


class Command(BaseCommand):
    help = 'Import JSON archive generated from jekyll'
    startpath = "5"

    def add_arguments(self, parser):
        parser.add_argument('json_file_location', nargs='?')

    def handle(self, *args, **options):
        archive_dict = {}
        json_file_location = options['json_file_location']

        try:
            with open(json_file_location, 'r', encoding='utf-8') as fp:
                archive_dict = json.loads(fp.read(), encoding='utf-8')
        except Exception as e:
            raise CommandError(e)

        if not archive_dict:
            raise CommandError("File has no content")

        for blogpost in archive_dict['items']:
            parsed_url = parse.urlparse(blogpost['url'])
            if not parsed_url.path.startswith('/blog/'):
                print("ignoring: ", parsed_url.path)
            else:
                print("keeping: ", parsed_url.path)
                self.import_blogpost(blogpost)
                # break

    def import_blogpost(self, blogpost):
        parsed_url = parse.urlparse(blogpost['url'])
        print(parsed_url.path)
        path_split = parsed_url.path.rstrip('/').split('/')
        dt = parser.parse(blogpost['date_modified'])

        page = BlogPage.objects.filter(slug=path_split[-1])
        if page.count() == 1:
            print("already exists")
            return

        page = BlogPage(
            title=blogpost['title'],
            seo_title=blogpost['title'],
            slug=path_split[-1],
            owner_id=1,
            first_published_at=dt,
            date=dt.date(),
            body=blogpost['content_html'],
            path="000100010001" + self.startpath.zfill(4),
            depth=4
        )
        page.save()
        print(page.id)

        self.startpath = str(int(self.startpath) + 1)
