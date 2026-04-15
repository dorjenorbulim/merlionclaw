#!/usr/bin/env python3
"""
BP2 Book Builder
Organizes extracted content into a cohesive book structure.
"""

import os
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple

EXTRACTED_DIR = "/Users/subhuti/.openclaw/workspace/bp2_extracted"
OUTPUT_FILE = "/Users/subhuti/.openclaw/workspace/BP2_Complete_Book.md"

# Topic order matching the book outline
TOPIC_ORDER = [
    "Tenet",
    "Lorig", 
    "Lamrim",
    "37 Aspects of Path to Enlightenment",
    "SixPerfections",
    "Engaging in the Deeds of a Bodhisattva",
    "HeartSutra",
    "Tathagatas Essence",
    "Tantra",
    "WheelWeapon"
]

def clean_text(text: str) -> str:
    """Clean and normalize text - fix common issues."""
    if not text:
        return ""
    
    # Remove extraction headers
    lines = text.split('\n')
    cleaned_lines = []
    skip_until_separator = False
    
    for line in lines:
        # Skip extraction metadata
        if line.startswith('Source:'):
            continue
        if line.startswith('Extracted:'):
            continue
        if line.startswith('=' * 80):
            skip_until_separator = False
            continue
        
        cleaned_lines.append(line)
    
    text = '\n'.join(cleaned_lines)
    
    # Fix common spacing issues
    text = re.sub(r'  +', ' ', text)  # Multiple spaces to single
    text = re.sub(r'\n{3,}', '\n\n', text)  # Multiple blank lines to double
    
    # Fix common punctuation issues
    text = re.sub(r' ?\. ', '. ', text)  # Space before period
    text = re.sub(r' ?, ', ', ', text)  # Space before comma
    
    return text.strip()

def read_topic_files(topic: str) -> List[Tuple[str, str]]:
    """Read all files for a topic, return list of (filename, content) tuples."""
    topic_dir = os.path.join(EXTRACTED_DIR, topic)
    if not os.path.exists(topic_dir):
        return []
    
    files_data = []
    
    for filename in sorted(os.listdir(topic_dir)):
        if not filename.endswith('.txt'):
            continue
        
        filepath = os.path.join(topic_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                cleaned = clean_text(content)
                if cleaned and len(cleaned) > 100:  # Minimum meaningful content
                    files_data.append((filename, cleaned))
        except Exception as e:
            print(f"  Error reading {filepath}: {e}")
    
    return files_data

def organize_by_lesson(files_data: List[Tuple[str, str]]) -> Dict[str, List[Tuple[str, str]]]:
    """Group files by lesson number or logical grouping."""
    groups = {}
    
    for filename, content in files_data:
        # Try to extract lesson number
        match = re.search(r'[Ll](?:esson)?[\s_-]?(\d+)|L(\d+)', filename)
        if match:
            lesson_num = match.group(1) or match.group(2)
            key = f"Lesson {lesson_num.zfill(2)}"
        else:
            # Group by other patterns
            if 'BP2' in filename or 'Module' in filename:
                match = re.search(r'L(\d+)', filename)
                if match:
                    key = f"Lesson {match.group(1).zfill(2)}"
                else:
                    key = "Supplementary"
            else:
                key = "Supplementary"
        
        if key not in groups:
            groups[key] = []
        groups[key].append((filename, content))
    
    return groups

def create_chapter_content(topic: str, files_data: List[Tuple[str, str]]) -> str:
    """Create formatted chapter content from files."""
    
    if not files_data:
        return ""
    
    # Organize by lesson
    groups = organize_by_lesson(files_data)
    
    chapter = []
    
    # Sort groups (lessons first, then supplementary)
    sorted_keys = sorted([k for k in groups.keys() if k.startswith('Lesson')])
    supplementary_keys = sorted([k for k in groups.keys() if not k.startswith('Lesson')])
    sorted_keys.extend(supplementary_keys)
    
    for key in sorted_keys:
        group_files = groups[key]
        
        chapter.append(f"\n## {key}\n")
        
        for filename, content in sorted(group_files, key=lambda x: x[0]):
            # Use filename as subheading (cleaned up)
            clean_name = Path(filename).stem.replace('_', ' ').replace('-', ' ')
            clean_name = re.sub(r'\s+', ' ', clean_name).title()
            
            # Only add subheading if it's not just a lesson number repeat
            if not re.match(r'^Lesson \d+', clean_name):
                chapter.append(f"\n### {clean_name}\n")
            
            chapter.append(content)
            chapter.append("\n")
    
    return '\n'.join(chapter)

def write_book():
    """Assemble and write the complete book."""
    
    print(f"Starting book assembly at {datetime.now().isoformat()}")
    print(f"Output: {OUTPUT_FILE}")
    print("-" * 60)
    
    book_parts = []
    
    # Title page
    book_parts.append("""# The Complete FPMT Basic Program Level 2

## A Comprehensive Study of Mahayana Buddhist Philosophy and Practice

---

*Compiled from the FPMT Basic Program Level 2 Curriculum*

*This book presents the complete curriculum of Basic Program Level 2, organized into a coherent study guide for serious Dharma students.*

---

**Generated:** """ + datetime.now().strftime("%B %Y") + """

**Source:** FPMT Basic Program Level 2 Materials

---

## Table of Contents

1. [Tenet Systems](#part-i-tenet-systems)
2. [Lorig - Mind and Cognition](#part-ii-lorig---mind-and-cognition)
3. [Lamrim Chenmo - Stages of the Path](#part-iii-lamrim-chenmo---stages-of-the-path)
4. [37 Aspects of Path to Enlightenment](#part-iv-37-aspects-of-path-to-enlightenment)
5. [Six Perfections](#part-v-six-perfections)
6. [Engaging in the Deeds of a Bodhisattva](#part-vi-engaging-in-the-deeds-of-a-bodhisattva)
7. [Heart Sutra](#part-vii-heart-sutra)
8. [Tathagata Essence - Buddha Nature](#part-viii-tathagata-essence---buddha-nature)
9. [Tantra](#part-ix-tantra)
10. [Wheel Weapon - Mind Training](#part-x-wheel-weapon---mind-training)

---

""")
    
    # Process each topic
    total_chars = 0
    topic_stats = {}
    
    for topic in TOPIC_ORDER:
        print(f"\nProcessing: {topic}")
        
        files_data = read_topic_files(topic)
        print(f"  Found {len(files_data)} files")
        
        if not files_data:
            print(f"  Warning: No content found for {topic}")
            continue
        
        # Create chapter title
        chapter_titles = {
            "Tenet": "Part I: Tenet Systems",
            "Lorig": "Part II: Lorig - Mind and Cognition", 
            "Lamrim": "Part III: Lamrim Chenmo - Stages of the Path",
            "37 Aspects of Path to Enlightenment": "Part IV: 37 Aspects of Path to Enlightenment",
            "SixPerfections": "Part V: Six Perfections",
            "Engaging in the Deeds of a Bodhisattva": "Part VI: Engaging in the Deeds of a Bodhisattva",
            "HeartSutra": "Part VII: Heart Sutra",
            "Tathagatas Essence": "Part VIII: Tathagata Essence - Buddha Nature",
            "Tantra": "Part IX: Tantra",
            "WheelWeapon": "Part X: Wheel Weapon - Mind Training"
        }
        
        chapter_title = chapter_titles.get(topic, topic)
        
        # Create content
        content = create_chapter_content(topic, files_data)
        
        if content:
            book_parts.append(f"\n# {chapter_title}\n")
            book_parts.append(content)
            
            chars = len(content)
            total_chars += chars
            topic_stats[topic] = chars
            print(f"  Added {chars:,} characters")
    
    # Write the book
    print("\n" + "=" * 60)
    print("Writing book...")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(book_parts))
    
    # Write stats
    stats_file = OUTPUT_FILE.replace('.md', '_stats.txt')
    with open(stats_file, 'w', encoding='utf-8') as f:
        f.write(f"BP2 Book Assembly Statistics\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n\n")
        f.write(f"Total characters: {total_chars:,}\n")
        f.write(f"Total words (approx): {total_chars // 5:,}\n\n")
        f.write("By Topic:\n")
        for topic, chars in sorted(topic_stats.items(), key=lambda x: x[1], reverse=True):
            f.write(f"  {topic}: {chars:,} chars\n")
    
    print(f"\nBook written to: {OUTPUT_FILE}")
    print(f"Total characters: {total_chars:,}")
    print(f"Estimated words: {total_chars // 5:,}")
    print(f"\nStatistics written to: {stats_file}")
    
    return total_chars

if __name__ == "__main__":
    write_book()
