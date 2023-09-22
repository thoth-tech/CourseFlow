import requests
from bs4 import BeautifulSoup
import pathlib
import datetime


def save_webpage(webpage_contents: str, cache_filepath: pathlib.Path, filename: pathlib.Path):
    """Saves webpage to cache directory as a new file"""
    with open(cache_filepath / filename, "w") as fp:
        fp.write(webpage_contents)


def search_and_download_faculty_list(faculty_code: str, year: int=datetime.date.today().year, session: requests.Session=None) -> str:
    """
    Downloads the resulting webpage when searching for all units with the faculty code.

    :param faculty_code: Single character representing a faculty. At Deakin University this is the first letter of a unit code.
    :param year: The year to search the faculty in
    :param session: An existing Session to Deakin University's website. If None, creates a new Session.
    :returns: Contents of the downloaded webpage
    """

    base_url = "https://www.deakin.edu.au"
    resource = "/current-students-courses/unit-search.php"

    # Download unit list from university website
    if session is None:
        session = requests.Session()
    response = session.get(base_url + resource, params={
        "entunit": faculty_code,
        "year": year
    })

    # Parse webpage document
    soup = BeautifulSoup(response.text, "html.parser")
    webpage_contents = soup.prettify()

    return webpage_contents


def search_and_download_unit(unit_code: str, year: int=datetime.date.today().year, session: requests.Session=None) -> str:
    """
    Downloads the handbook webpage for the specified unit

    :param unit_code: The full unit code of the unit to search for
    :param year: The year to search the unit in
    :param session: An existing Session to Deakin University's website. If None, creates a new Session.
    :return: Contents of the downloaded webpage
    """

    base_url = "https://www.deakin.edu.au"
    resource = "/courses-search/unit.php"

    # Download unit from university website
    if session is None:
        session = requests.Session()
    response = session.get(base_url + resource, params={
        "unit": unit_code,
        "year": year
    })

    # Parse webpage document
    soup = BeautifulSoup(response.text, "html.parser")
    webpage_contents = soup.prettify()

    return webpage_contents


def download_unit_lists():
    """Downloads and saves the unit list webpages for all known faculties"""
    session = requests.Session()
    faculty_codes = ['E', 'A', 'H', 'S', 'M']

    for faculty_code in faculty_codes:
        # Search for all units with the matching faculty code and download the search webpage
        webpage_contents = search_and_download_faculty_list(faculty_code, session=session)

        # Saves the downloaded unit list webpage to the cache
        webpage_file_name = pathlib.Path(f"faculty_{faculty_code}_unit_list.html")
        webpage_cache_filepath = pathlib.Path("webpage_cache")
        webpage_search_list_filepath = webpage_cache_filepath / "unit_search_lists"
        save_webpage(webpage_contents, webpage_search_list_filepath, webpage_file_name)


if __name__ == "__main__":
    download_unit_lists()
