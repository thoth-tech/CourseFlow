import requests
from bs4 import BeautifulSoup
import pathlib


def download_unit_lists():
    """Downloads and saves the unit list webpages for all known faculties"""
    prettify_documents = True
    base_url = "https://www.deakin.edu.au"
    resource = "/current-students-courses/unit-search.php"
    webpage_cache_filepath = pathlib.Path("webpage_cache")
    webpage_search_list_filepath = webpage_cache_filepath / "unit_search_lists"
    session = requests.Session()
    faculty_codes = ['E', 'A', 'H', 'S', 'M']

    for faculty_code in faculty_codes:
        # Search for all units with the matching faculty code and download the search webpage
        query_params = {
            "entunit": faculty_code,
            "entkeyword": None,
            "year": 2023
        }
        response = session.get(base_url + resource, params=query_params)

        # Parse document
        soup = BeautifulSoup(response.text, "html.parser")
        html_document = soup.prettify() if prettify_documents else response.text

        # Save document to cache
        webpage_file_name = f"faculty_{faculty_code}_unit_list.html"
        with open(webpage_search_list_filepath / webpage_file_name, "w") as fp:
            fp.write(html_document)


if __name__ == "__main__":
    download_unit_lists()
