#!/usr/bin/env python3
"""
BP2 Content Extractor v2
Extracts text from PDF, DOC, DOCX files using antiword for legacy .doc files.
"""

import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime

try:
    import PyPDF2
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    print("Warning: PyPDF2 not available, skipping PDFs")

try:
    import docx
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False
    print("Warning: python-docx not available, skipping DOCX")

SOURCE_DIR = "/Volumes/Subhuti Main/Dharma/FPMT Basic Programs/bp2"
OUTPUT_DIR = "/Users/subhuti/.openclaw/workspace/bp2_extracted"

TOPICS = [
    "37 Aspects of Path to Enlightenment",
    "Engaging in the Deeds of a Bodhisattva",
    "HeartSutra",
    "Lamrim",
    "Lorig",
    "SixPerfections",
    "Tantra",
    "Tathagatas Essence",
    "Tenet",
    "WheelWeapon"
]

def extract_pdf(filepath):
    """Extract text from PDF file."""
    if not PDF_AVAILABLE:
        return None
    try:
        text = []
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text.append(page_text)
        return '\n'.join(text) if text else None
    except Exception as e:
        print(f"  Error reading PDF {filepath}: {e}")
        return None

def extract_docx(filepath):
    """Extract text from DOCX file."""
    if not DOCX_AVAILABLE:
        return None
    try:
        doc = docx.Document(filepath)
        text = []
        for para in doc.paragraphs:
            if para.text.strip():
                text.append(para.text)
        return '\n'.join(text) if text else None
    except Exception as e:
        print(f"  Error reading DOCX {filepath}: {e}")
        return None

def extract_doc_antiword(filepath):
    """Extract text from DOC file using antiword."""
    try:
        result = subprocess.run(
            ['antiword', filepath],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout
        return None
    except subprocess.TimeoutExpired:
        print(f"  Timeout reading DOC {filepath}")
        return None
    except Exception as e:
        print(f"  Error with antiword {filepath}: {e}")
        return None

def extract_txt(filepath):
    """Read plain text file."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except Exception as e:
        print(f"  Error reading TXT {filepath}: {e}")
        return None

def extract_file(filepath):
    """Extract text from a file based on extension."""
    ext = Path(filepath).suffix.lower()
    
    if ext == '.pdf':
        return extract_pdf(filepath)
    elif ext == '.docx':
        return extract_docx(filepath)
    elif ext == '.doc':
        return extract_doc_antiword(filepath)
    elif ext in ['.txt', '.md', '.rtf']:
        return extract_txt(filepath)
    else:
        return None

def process_directory():
    """Process all files in the BP2 directory."""
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    stats = {
        'total_files': 0,
        'extracted': 0,
        'failed': 0,
        'skipped': 0,
        'by_topic': {}
    }
    
    # Create topic subdirectories
    for topic in TOPICS:
        topic_dir = os.path.join(OUTPUT_DIR, topic)
        os.makedirs(topic_dir, exist_ok=True)
        stats['by_topic'][topic] = {'files': 0, 'extracted': 0}
    
    print(f"Starting extraction v2 from {SOURCE_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Time: {datetime.now().isoformat()}")
    print("-" * 60)
    
    for topic in TOPICS:
        topic_path = os.path.join(SOURCE_DIR, topic)
        if not os.path.exists(topic_path):
            print(f"Skipping {topic} - directory not found")
            continue
        
        print(f"\nProcessing: {topic}")
        
        for root, dirs, files in os.walk(topic_path):
            for filename in files:
                filepath = os.path.join(root, filename)
                ext = Path(filename).suffix.lower()
                
                # Only process supported formats
                if ext not in ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf']:
                    stats['skipped'] += 1
                    continue
                
                stats['total_files'] += 1
                stats['by_topic'][topic]['files'] += 1
                
                print(f"  [{stats['total_files']}] {filename}...", end=" ")
                
                text = extract_file(filepath)
                
                if text and len(text.strip()) > 50:  # Minimum meaningful content
                    # Create output filename
                    base_name = Path(filename).stem
                    output_file = os.path.join(OUTPUT_DIR, topic, f"{base_name}.txt")
                    
                    # Write extracted text
                    with open(output_file, 'w', encoding='utf-8') as f:
                        f.write(f"Source: {filepath}\n")
                        f.write(f"Extracted: {datetime.now().isoformat()}\n")
                        f.write("=" * 80 + "\n\n")
                        f.write(text)
                    
                    stats['extracted'] += 1
                    stats['by_topic'][topic]['extracted'] += 1
                    print(f"✓ ({len(text)} chars)")
                else:
                    stats['failed'] += 1
                    print(f"✗ (no text extracted)")
    
    # Write summary
    summary_file = os.path.join(OUTPUT_DIR, "extraction_summary_v2.txt")
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write(f"BP2 Content Extraction Summary v2\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n")
        f.write(f"Source: {SOURCE_DIR}\n\n")
        
        f.write(f"Total files processed: {stats['total_files']}\n")
        f.write(f"Successfully extracted: {stats['extracted']}\n")
        f.write(f"Failed to extract: {stats['failed']}\n")
        f.write(f"Skipped (unsupported): {stats['skipped']}\n\n")
        
        f.write("By Topic:\n")
        for topic, topic_stats in stats['by_topic'].items():
            f.write(f"  {topic}:\n")
            f.write(f"    Files: {topic_stats['files']}\n")
            f.write(f"    Extracted: {topic_stats['extracted']}\n")
    
    print("\n" + "=" * 60)
    print("EXTRACTION COMPLETE")
    print(f"Total files: {stats['total_files']}")
    print(f"Extracted: {stats['extracted']}")
    print(f"Failed: {stats['failed']}")
    print(f"Skipped: {stats['skipped']}")
    print(f"\nSummary written to: {summary_file}")
    
    return stats

if __name__ == "__main__":
    process_directory()
