#!/usr/bin/env python3
"""
Dharma Collection Search Tool
Search and query Subhuti's Dharma collection index

Usage:
    python dharma_search.py [command] [options]

Commands:
    search <query>     Search by keyword in titles, topics, descriptions
    module <id>        Show specific module details
    topic <name>       List all materials for a topic
    path <name>        Show study path details
    audio              List all audio files
    pdf                List all PDF documents
    stats              Show collection statistics

Examples:
    python dharma_search.py search emptiness
    python dharma_search.py module bp1-mod10
    python dharma_search.py topic tantra
    python dharma_search.py path beginner
    python dharma_search.py audio
"""

import json
import sys
import os
from pathlib import Path

# Load the index
INDEX_FILE = Path(__file__).parent / "DHARMA_INDEX.json"

def load_index():
    """Load the Dharma collection index."""
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {INDEX_FILE} not found!")
        print("Make sure DHARMA_INDEX.json is in the same directory.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        sys.exit(1)

def print_header(text):
    """Print a formatted header."""
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def print_item(title, details, indent=0):
    """Print an item with details."""
    prefix = "  " * indent
    print(f"{prefix}📌 {title}")
    if details:
        for key, value in details.items():
            if value:
                print(f"{prefix}   {key}: {value}")
        print()

def search_collection(index, query):
    """Search the collection by keyword."""
    query = query.lower()
    results = []
    
    # Search in categories
    for category in index.get('categories', []):
        cat_name = category.get('name', '').lower()
        cat_desc = category.get('description', '').lower()
        
        if query in cat_name or query in cat_desc:
            results.append({
                'type': 'category',
                'name': category.get('name'),
                'path': category.get('path'),
                'description': category.get('description')
            })
        
        # Search in modules
        for module in category.get('modules', []):
            mod_name = module.get('name', '').lower()
            mod_title = module.get('title', '').lower()
            mod_topics = [t.lower() for t in module.get('topics', [])]
            
            if (query in mod_name or query in mod_title or 
                any(query in t for t in mod_topics)):
                results.append({
                    'type': 'module',
                    'name': module.get('name'),
                    'title': module.get('title'),
                    'number': module.get('number'),
                    'path': module.get('path'),
                    'topics': module.get('topics')
                })
    
    # Search in topic index
    for topic_name, topic_data in index.get('topicIndex', {}).items():
        if query in topic_name.lower():
            results.append({
                'type': 'topic',
                'name': topic_name,
                'modules': topic_data.get('modules', []),
                'texts': topic_data.get('texts', [])
            })
    
    return results

def get_module(index, module_id):
    """Get specific module by ID."""
    for category in index.get('categories', []):
        for module in category.get('modules', []):
            if module.get('id') == module_id:
                return module, category.get('name')
    return None, None

def get_topic(index, topic_name):
    """Get topic by name."""
    topic_key = topic_name.lower().replace(' ', '')
    for key, data in index.get('topicIndex', {}).items():
        if key.lower() == topic_key or topic_key in key.lower():
            return key, data
    return None, None

def get_study_path(index, path_name):
    """Get study path by name."""
    path_key = path_name.lower()
    for path in index.get('studyPaths', []):
        if path.get('name', '').lower() == path_key:
            return path
    return None

def list_audio_files(index):
    """List all audio files in the collection."""
    audio_files = []
    
    # From notable files
    for file in index.get('notableFiles', []):
        if file.get('type') == 'audio':
            audio_files.append(file)
    
    # From modules
    for category in index.get('categories', []):
        for module in category.get('modules', []):
            for content in module.get('contents', []):
                if content.get('type') == 'audio':
                    audio_files.append({
                        'path': module.get('path'),
                        'title': content.get('description', module.get('title')),
                        'format': content.get('format', 'mp3')
                    })
    
    return audio_files

def list_pdfs(index):
    """List all PDF documents."""
    pdfs = []
    
    for category in index.get('categories', []):
        for module in category.get('modules', []):
            for content in module.get('contents', []):
                if content.get('format') == 'pdf' or content.get('type') == 'text':
                    pdfs.append({
                        'path': module.get('path'),
                        'title': content.get('title', module.get('title')),
                        'description': content.get('description', '')
                    })
    
    return pdfs

def show_stats(index):
    """Show collection statistics."""
    print_header("DHARMA COLLECTION STATISTICS")
    
    meta = index.get('metadata', {})
    print(f"Collection: {meta.get('title')}")
    print(f"Location: {meta.get('location')}")
    print(f"Total Files: {meta.get('totalFiles'):,}")
    print(f"Last Updated: {meta.get('created')}")
    print()
    
    # File type distribution
    print("File Type Distribution:")
    print("-" * 40)
    for file_type, data in index.get('fileTypeDistribution', {}).items():
        count = data.get('estimatedCount', 0)
        exts = ', '.join(data.get('extensions', []))
        print(f"  {file_type:15} {count:5,} files ({exts})")
    
    # Categories
    print(f"\nCategories: {len(index.get('categories', []))}")
    for cat in index.get('categories', []):
        module_count = len(cat.get('modules', []))
        print(f"  • {cat.get('name')} ({module_count} modules)")
    
    # Study paths
    print(f"\nStudy Paths: {len(index.get('studyPaths', []))}")
    for path in index.get('studyPaths', []):
        print(f"  • {path.get('name')}: {path.get('description')}")

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)
    
    command = sys.argv[1].lower()
    index = load_index()
    
    if command == 'search':
        if len(sys.argv) < 3:
            print("Usage: python dharma_search.py search <keyword>")
            sys.exit(1)
        
        query = ' '.join(sys.argv[2:])
        results = search_collection(index, query)
        
        print_header(f'SEARCH RESULTS FOR "{query}"')
        
        if not results:
            print(f"No results found for '{query}'")
            print("\nTry searching for:")
            print("  • Topics: emptiness, bodhicitta, tantra, lamrim")
            print("  • Module names: Heart Sutra, Lam Rim, etc.")
            print("  • Categories: FPMT, Masters, Tantric")
        else:
            print(f"Found {len(results)} result(s):\n")
            
            for result in results:
                if result['type'] == 'category':
                    print_item(result['name'], {
                        'Type': 'Category',
                        'Description': result.get('description'),
                        'Path': result.get('path')
                    })
                elif result['type'] == 'module':
                    print_item(f"{result.get('name')} ({result.get('title')})", {
                        'Type': 'Module',
                        'Number': result.get('number'),
                        'Path': result.get('path'),
                        'Topics': ', '.join(result.get('topics', []))
                    })
                elif result['type'] == 'topic':
                    print_item(result['name'].upper(), {
                        'Type': 'Topic',
                        'Modules': ', '.join(result.get('modules', [])),
                        'Texts': ', '.join(result.get('texts', []))
                    })
    
    elif command == 'module':
        if len(sys.argv) < 3:
            print("Usage: python dharma_search.py module <module-id>")
            print("\nExample module IDs:")
            print("  bp1-mod1    (Lam Rim)")
            print("  bp1-mod3    (Tenets & Heart Sutra)")
            print("  bp1-mod10   (Tathagata Essence)")
            print("  bp2-tantra  (Tantra)")
            sys.exit(1)
        
        module_id = sys.argv[2]
        module, category = get_module(index, module_id)
        
        if module:
            print_header(f"MODULE: {module.get('title', module_id)}")
            print(f"Category: {category}")
            print(f"Module ID: {module.get('id')}")
            print(f"Number: {module.get('number')}")
            print(f"Path: {module.get('path')}")
            print(f"\nTopics: {', '.join(module.get('topics', []))}")
            
            if module.get('contents'):
                print(f"\nContents ({len(module['contents'])} items):")
                for content in module['contents']:
                    c_type = content.get('type', 'unknown')
                    c_desc = content.get('description', '')
                    c_format = content.get('format', '')
                    print(f"  • {c_type}: {c_desc or '(no description)'} {f'({c_format})' if c_format else ''}")
        else:
            print(f"Module '{module_id}' not found!")
            print("\nAvailable modules:")
            for cat in index.get('categories', []):
                for mod in cat.get('modules', []):
                    print(f"  • {mod.get('id')} - {mod.get('title')}")
    
    elif command == 'topic':
        if len(sys.argv) < 3:
            print("Usage: python dharma_search.py topic <topic-name>")
            print("\nAvailable topics:")
            for topic in index.get('topicIndex', {}).keys():
                print(f"  • {topic}")
            sys.exit(1)
        
        topic_name = ' '.join(sys.argv[2:])
        topic_key, topic_data = get_topic(index, topic_name)
        
        if topic_data:
            print_header(f"TOPIC: {topic_key.upper()}")
            
            modules = topic_data.get('modules', [])
            if modules:
                print(f"\nModules ({len(modules)}):")
                for mod_id in modules:
                    mod, cat = get_module(index, mod_id)
                    if mod:
                        print(f"  • {mod.get('title')} ({cat})")
            
            texts = topic_data.get('texts', [])
            if texts:
                print(f"\nKey Texts:")
                for text in texts:
                    print(f"  • {text}")
            
            practices = topic_data.get('practices', [])
            if practices:
                print(f"\nPractices:")
                for practice in practices:
                    print(f"  • {practice}")
        else:
            print(f"Topic '{topic_name}' not found!")
    
    elif command == 'path':
        if len(sys.argv) < 3:
            print("Usage: python dharma_search.py path <path-name>")
            print("\nAvailable paths:")
            for path in index.get('studyPaths', []):
                print(f"  • {path.get('name')} - {path.get('description')}")
            sys.exit(1)
        
        path_name = ' '.join(sys.argv[2:])
        path = get_study_path(index, path_name)
        
        if path:
            print_header(f"STUDY PATH: {path.get('name').upper()}")
            print(f"Description: {path.get('description')}")
            print(f"\nModules in this path ({len(path.get('modules', []))}):")
            
            for i, mod_id in enumerate(path.get('modules', []), 1):
                mod, cat = get_module(index, mod_id)
                if mod:
                    print(f"\n  {i}. {mod.get('title')}")
                    print(f"     Category: {cat}")
                    print(f"     Topics: {', '.join(mod.get('topics', []))}")
                    print(f"     Location: {mod.get('path')}")
            
            print(f"\nKey Topics: {', '.join(path.get('topics', []))}")
        else:
            print(f"Study path '{path_name}' not found!")
    
    elif command == 'audio':
        audio_files = list_audio_files(index)
        print_header(f"AUDIO FILES ({len(audio_files)} found)")
        
        for audio in audio_files:
            title = audio.get('title', 'Unknown')
            path = audio.get('path', '')
            artist = audio.get('artist', '')
            
            print(f"🎵 {title}")
            if artist:
                print(f"   Artist: {artist}")
            if path:
                print(f"   Location: {path}")
            print()
    
    elif command == 'pdf':
        pdfs = list_pdfs(index)
        print_header(f"PDF DOCUMENTS ({len(pdfs)} found)")
        
        for pdf in pdfs:
            title = pdf.get('title', 'Unknown')
            desc = pdf.get('description', '')
            path = pdf.get('path', '')
            
            print(f"📄 {title}")
            if desc:
                print(f"   {desc}")
            print(f"   Location: {path}")
            print()
    
    elif command == 'stats':
        show_stats(index)
    
    else:
        print(f"Unknown command: {command}")
        print(__doc__)
        sys.exit(1)

if __name__ == '__main__':
    main()
