import xml.etree.ElementTree as ET
from typing import List, Dict, Any

class L5XParser:
    """Parser for Rockwell L5X (XML) PLC logic."""
    
    def __init__(self, content: str):
        self.content = content
        self.tags = []
        self.rungs = []

    def parse(self) -> Dict[str, Any]:
        try:
            root = ET.fromstring(self.content)
            self._extract_tags(root)
            self._extract_logic(root)
            return {
                "tags": self.tags,
                "rungs": self.rungs,
                "summary": f"Extracted {len(self.tags)} tags and {len(self.rungs)} rungs."
            }
        except Exception as e:
            return {"error": f"Failed to parse L5X: {str(e)}"}

    def _extract_tags(self, root):
        tags_elem = root.find(".//Tags")
        if tags_elem is not None:
            for tag in tags_elem.findall("Tag"):
                self.tags.append({
                    "name": tag.get("Name"),
                    "type": tag.get("DataType")
                })

    def _extract_logic(self, root):
        rungs_elem = root.findall(".//Rung")
        for rung in rungs_elem:
            text_elem = rung.find("Text")
            if text_elem is not None:
                self.rungs.append({
                    "number": rung.get("Number"),
                    "logic": text_elem.text
                })
