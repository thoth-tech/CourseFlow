import os

from PyPDF2 import PdfReader

import handbook_reader
import visualizer

unit_listings = "handbooks/DeakinUniversity2019_Units-v4-accessible.pdf"
unit_listings_text_cache = "handbooks/unit_listings_text_cache.txt"
course_listings = "handbooks/DeakinUniversity2019_Courses-v4-accessible.pdf"
unit_details_first_page = 27
unit_details_last_page = 1210
# A dictionary of all units from the handbook
units = {}

if __name__ == "__main__":
    # todo: Download handbook if it doesn't exist
    # Read the handbook text from the cache file if it exists, otherwise create the cache file
    if os.path.exists(unit_listings_text_cache):
        with open(unit_listings_text_cache, "r", encoding="utf-8") as file:
            text = " ".join(file.readlines())
    else:
        # Read all unit information text from the handbook PDF
        reader = PdfReader(unit_listings)
        text = []
        for page in reader.pages[unit_details_first_page - 1:]:
            text.append(page.extract_text(orientations=(0,)))
        text = " ".join(text)

        # Write the text to a cache which will be used in the future
        with open(unit_listings_text_cache, "w", encoding="utf-8") as file:
            file.write(text)

    units = handbook_reader.read_unit_details(text)

    # todo: Remove debug filter. The filter is here to speed up the graph creation progress while in development.
    units = {code: unit for code, unit in units.items() if code.startswith("SIT")}
    unit_network, visible_edges = visualizer.create_unit_network(units)
    visualizer.draw_unit_network(unit_network, visible_edges)