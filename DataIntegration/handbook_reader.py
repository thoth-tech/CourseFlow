from typing import Tuple, List

from PyPDF2 import PdfReader, PageObject
import re

unit_listings = "handbooks/DeakinUniversity2019_Units-v4-accessible.pdf"
course_listings = "handbooks/DeakinUniversity2019_Courses-v4-accessible.pdf"
unit_details_first_page = 27
unit_details_last_page = 1210
units = []
def read_unit_details(page: PageObject, units: list):
    text = page.extract_text(orientations=(0,))

    # Replace newline characters with spaces
    text = text.replace("\n", " ")
    # Convert any double spaces to single spaces
    text = text.replace("  ", " ")
    print(text)


if __name__ == "__main__":
    reader = PdfReader(unit_listings)
    for page in reader.pages[unit_details_first_page - 1:unit_details_first_page]:
        read_unit_details(page, units)
    print()
