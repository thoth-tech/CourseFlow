import requests
from bs4 import BeautifulSoup
import pathlib
import datetime


class UnitSearchQuery:
    def __init__(self, unit_code: str=None, keyword: str=None, year: int=datetime.date.today().year):
        self.entunit = unit_code
        self.entkeyword = keyword
        self.year = year


def download_and_cache_unit_list_webpage(faculty_code: str, session: requests.Session=None):
    """
    Downloads the resulting webpage when searching for all units with the faculty code.

    :param faculty_code: Single character representing a faculty. At Deakin University this is the first letter of a unit code.
    :param session: An existing Session to Deakin University's website. If None, creates a new Session.
    """

    base_url = "https://www.deakin.edu.au"
    resource = "/current-students-courses/unit-search.php"
    webpage_cache_filepath = pathlib.Path("webpage_cache")
    webpage_search_list_filepath = webpage_cache_filepath / "unit_search_lists"
    webpage_file_name = f"faculty_{faculty_code}_unit_list.html"

    # Download unit list from university website
    if session is None:
        session = requests.Session()
    response = session.get(base_url + resource, params=UnitSearchQuery(unit_code=faculty_code).__dict__)

    # Parse webpage document
    soup = BeautifulSoup(response.text, "html.parser")
    html_document = soup.prettify()

    # Save document to cache
    with open(webpage_search_list_filepath / webpage_file_name, "w") as fp:
        fp.write(html_document)


def download_unit_lists():
    """Downloads and saves the unit list webpages for all known faculties"""
    session = requests.Session()
    faculty_codes = ['E', 'A', 'H', 'S', 'M']

    for faculty_code in faculty_codes:
        # Search for all units with the matching faculty code and download the search webpage
        download_and_cache_unit_list_webpage(faculty_code, session)


if __name__ == "__main__":
    download_unit_lists()
