import re
from typing import List, Dict, Any

class STParser:
    """Parser for Structured Text (ST) PLC logic."""
    
    def __init__(self, content: str):
        self.content = content
        self.tags = []
        self.logic_blocks = []

    def parse(self) -> Dict[str, Any]:
        self._extract_tags()
        self._extract_logic()
        return {
            "tags": self.tags,
            "logic": self.logic_blocks,
            "summary": self._generate_summary()
        }

    def _extract_tags(self):
        # Very basic tag extraction for VAR ... END_VAR
        var_blocks = re.findall(r'VAR(.*?)END_VAR', self.content, re.DOTALL | re.IGNORECASE)
        for block in var_blocks:
            lines = block.strip().split(';')
            for line in lines:
                if ':' in line:
                    parts = line.split(':')
                    name = parts[0].strip()
                    dtype = parts[1].strip()
                    self.tags.append({"name": name, "type": dtype})

    def _extract_logic(self):
        # Extract basic assignments and IF statements
        lines = self.content.split('\n')
        for line in lines:
            line = line.strip()
            if ':=' in line:
                self.logic_blocks.append({"type": "assignment", "content": line})
            elif 'IF' in line and 'THEN' in line:
                self.logic_blocks.append({"type": "conditional", "content": line})

    def _generate_summary(self) -> str:
        return f"Parsed {len(self.tags)} tags and {len(self.logic_blocks)} logic blocks."

# Example usage:
# parser = STParser("VAR\n  Pump_Start : BOOL;\n  Level : INT;\nEND_VAR\nIF Level > 80 THEN\n  Pump_Start := TRUE;\nEND_IF;")
# print(parser.parse())
