#!/usr/bin/env python3
"""
BP2 Book Refiner
Corrects grammar, spelling, punctuation, and standardizes Buddhist terminology.
Processes the book in chunks to handle large file size.
"""

import re
from datetime import datetime
from typing import Tuple

INPUT_FILE = "/Users/subhuti/.openclaw/workspace/BP2_Complete_Book.md"
OUTPUT_FILE = "/Users/subhuti/.openclaw/workspace/BP2_Complete_Book_Refined.md"

# Buddhist terminology standardization (FPMT style)
BUDDHIST_TERMS = {
    # Common misspellings/variants
    'lam-rim': 'Lamrim',
    'lamrim chen-mo': 'Lamrim Chenmo',
    'lamrim chenmo': 'Lamrim Chenmo',
    'lo-rig': 'Lorig',
    'tathagata essence': 'Tathagata Essence',
    'tathagatagarbha': 'Tathagata Essence',
    'bodhi-citta': 'bodhicitta',
    'bodhicitta': 'bodhicitta',
    'Bodhicitta': 'bodhicitta',  # lowercase unless start of sentence
    'shamatha': 'calm abiding',
    'vipashyana': 'special insight',
    'vipasyana': 'special insight',
    'sunyata': 'emptiness',
    'śūnyatā': 'emptiness',
    'prajnaparamita': 'Perfection of Wisdom',
    'prajñāpāramitā': 'Perfection of Wisdom',
    'madhyamaka': 'Middle Way',
    'madhyamika': 'Middle Way',
    'svatantrika': 'Autonomous',
    'prasangika': 'Consequence',
    'vaibhashika': 'Great Exposition',
    'sautrantika': 'Sutra Followers',
    'cittamatra': 'Mind Only',
    'yogacara': 'Mind Only',
    'tantra': 'tantra',  # lowercase unless start
    'Tantra': 'tantra',
    'vajrayana': 'Vajrayana',
    'mahayana': 'Mahayana',
    'Mahayana': 'Mahayana',
    'hinayana': 'Foundation Vehicle',
    'theravada': 'Theravada',
    'khen rinpoche': 'Khen Rinpoche',
    'geshe': 'Geshe',
    'rinpoche': 'Rinpoche',
    'lama': 'lama',
    'guru': 'guru',
    'dharma': 'Dharma',
    'Dharma': 'Dharma',
    'sangha': 'Sangha',
    'buddha': 'buddha',  # lowercase when referring to the state
    'Buddha': 'Buddha',  # capitalized when referring to the Buddha
    'bodhisattva': 'bodhisattva',
    'Bodhisattva': 'bodhisattva',
    'arhat': 'arhat',
    'pratyekabuddha': 'solitary realizer',
    'shravaka': 'listener',
    'sutra': 'sutra',
    'Sutra': 'sutra',
    'shastra': 'shastra',
    'abhidharma': 'Abhidharma',
    'vinaya': 'Vinaya',
    'ngondro': 'preliminary practices',
    'guru yoga': 'guru yoga',
    'deity yoga': 'deity yoga',
    'dzogchen': 'Dzogchen',
    'mahamudra': 'Mahamudra',
    'tummo': 'inner heat',
    'phowa': 'transference',
    'bardo': 'intermediate state',
    'karma': 'karma',
    'Karma': 'karma',
    'samsara': 'samsara',
    'nirvana': 'nirvana',
    'emptiness': 'emptiness',
    'Emptiness': 'emptiness',  # lowercase unless start of sentence
    'voidness': 'emptiness',
    'suchness': 'suchness',
    'thusness': 'suchness',
    'dependent arising': 'dependent arising',
    'dependent-arising': 'dependent arising',
    'dependently arisen': 'dependently arisen',
    'pratityasamutpada': 'dependent arising',
    'two truths': 'two truths',
    'ultimate truth': 'ultimate truth',
    'conventional truth': 'conventional truth',
    'truth body': 'Truth Body',
    'form body': 'Form Body',
    'dharmakaya': 'Truth Body',
    'rupakaya': 'Form Body',
    'sambhogakaya': 'Enjoyment Body',
    'nirmanakaya': 'Emanation Body',
    'three kayas': 'three kayas',
    'five paths': 'five paths',
    'ten grounds': 'ten grounds',
    'ten bhumis': 'ten grounds',
    'six perfections': 'six perfections',
    'six paramitas': 'six perfections',
    'paramita': 'perfection',
    'paramitas': 'perfections',
    'four noble truths': 'four noble truths',
    'eightfold path': 'eightfold noble path',
    'three principal aspects of the path': 'three principal aspects of the path',
    'precious human rebirth': 'precious human rebirth',
    'human life of leisure and opportunity': 'human life of leisure and opportunity',
    'eight freedoms and ten endowments': 'eight freedoms and ten endowments',
    'refuge': 'refuge',
    'taking refuge': 'taking refuge',
    'three jewels': 'Three Jewels',
    'three rotten gods': 'Three Jewels',  # obvious OCR error
    'four seals': 'four seals',
    'three marks of existence': 'three marks of existence',
    'impermanence': 'impermanence',
    'death and impermanence': 'death and impermanence',
    'six realms': 'six realms',
    'three lower realms': 'three lower realms',
    'hell beings': 'hell beings',
    'hungry ghosts': 'hungry ghosts',
    'pretas': 'hungry ghosts',
    'animals': 'animals',
    'humans': 'humans',
    'demigods': 'demigods',
    'asuras': 'demigods',
    'gods': 'gods',
    'devas': 'gods',
    'afflictions': 'afflictions',
    'kleshas': 'afflictions',
    'delusions': 'afflictions',
    'ignorance': 'ignorance',
    'attachment': 'attachment',
    'anger': 'anger',
    'hatred': 'anger',
    'pride': 'pride',
    'jealousy': 'jealousy',
    'envy': 'jealousy',
    'stinginess': 'stinginess',
    'miserliness': 'stinginess',
    'wisdom': 'wisdom',
    'compassion': 'compassion',
    'love': 'love',
    'loving kindness': 'love',
    'great compassion': 'great compassion',
    'altruistic intention': 'altruistic intention',
    'renunciation': 'renunciation',
    'determination to be free': 'renunciation',
    'merit': 'merit',
    'positive potential': 'merit',
    'purification': 'purification',
    'obscurations': 'obscurations',
    'veils': 'obscurations',
    'afflictive obscurations': 'afflictive obscurations',
    'cognitive obscurations': 'cognitive obscurations',
    'habitual tendencies': 'habitual tendencies',
    'imprints': 'imprints',
    'vows': 'vows',
    'pratimoksha vows': 'pratimoksha vows',
    'bodhisattva vows': 'bodhisattva vows',
    'tantric vows': 'tantric vows',
    'samaya': 'tantric commitments',
    'commitments': 'tantric commitments',
    'generation stage': 'generation stage',
    'completion stage': 'completion stage',
    'mandala': 'mandala',
    'mantra': 'mantra',
    'sadana': 'practice text',
    'sadhana': 'practice text',
    'empowerment': 'empowerment',
    'initiation': 'empowerment',
    'wang': 'empowerment',
    'lung': 'oral transmission',
    'tri': 'oral transmission',
    'commentary': 'commentary',
    'root text': 'root text',
    'commentary text': 'commentary',
}

def fix_common_errors(text: str) -> str:
    """Fix common grammar, spelling, and punctuation errors."""
    
    # Remove double spaces
    text = re.sub(r'  +', ' ', text)
    
    # Fix space before punctuation
    text = re.sub(r' +\.', '.', text)
    text = re.sub(r' +,', ',', text)
    text = re.sub(r' +;', ';', text)
    text = re.sub(r' +:', ':', text)
    text = re.sub(r' +\?', '?', text)
    text = re.sub(r' +!', '!', text)
    
    # Fix missing space after punctuation
    text = re.sub(r'\.([A-Z])', r'. \1', text)
    text = re.sub(r',([A-Z])', r', \1', text)
    text = re.sub(r';([A-Z])', r'; \1', text)
    
    # Fix repeated words
    text = re.sub(r'\b(\w+)\s+\1\b', r'\1', text, flags=re.IGNORECASE)
    
    # Common word fixes
    text = re.sub(r'\brealiszation\b', 'realization', text, flags=re.IGNORECASE)
    text = re.sub(r'\brealiszations\b', 'realizations', text, flags=re.IGNORECASE)
    text = re.sub(r'\bpractise\b', 'practice', text, flags=re.IGNORECASE)  # UK to US
    text = re.sub(r'\bhonour\b', 'honor', text, flags=re.IGNORECASE)
    text = re.sub(r'\bfavour\b', 'favor', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcolour\b', 'color', text, flags=re.IGNORECASE)
    text = re.sub(r'\bbehaviour\b', 'behavior', text, flags=re.IGNORECASE)
    text = re.sub(r'\blabour\b', 'labor', text, flags=re.IGNORECASE)
    text = re.sub(r'\bneighbour\b', 'neighbor', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcentre\b', 'center', text, flags=re.IGNORECASE)
    text = re.sub(r'\bmetre\b', 'meter', text, flags=re.IGNORECASE)
    
    # Fix "the the" and similar
    text = re.sub(r'\bthe the\b', 'the', text, flags=re.IGNORECASE)
    text = re.sub(r'\ba a\b', 'a', text, flags=re.IGNORECASE)
    text = re.sub(r'\ban an\b', 'an', text, flags=re.IGNORECASE)
    
    # Fix "is are" errors
    text = re.sub(r'\bis are\b', 'are', text, flags=re.IGNORECASE)
    text = re.sub(r'\bare is\b', 'is', text, flags=re.IGNORECASE)
    
    # Fix "have has" errors
    text = re.sub(r'\bhave has\b', 'has', text, flags=re.IGNORECASE)
    text = re.sub(r'\bhas have\b', 'have', text, flags=re.IGNORECASE)
    
    # Fix common grammatical errors
    text = re.sub(r'\bin order for any composed phenomena to arise\b', 'In order for any composed phenomenon to arise', text)
    text = re.sub(r'\bphenomena is\b', 'phenomenon is', text)
    text = re.sub(r'\bphenomena are\b', 'phenomena are', text)  # This is correct
    text = re.sub(r'\ba phenomena\b', 'a phenomenon', text)
    text = re.sub(r'\bthe phenomena\b', 'the phenomenon', text)
    
    # Fix "it it" constructions
    text = re.sub(r'\bit it\b', 'it', text)
    
    # Fix "that that"
    text = re.sub(r'\bthat that\b', 'that', text)
    
    # Fix "which which"
    text = re.sub(r'\bwhich which\b', 'which', text)
    
    # Fix run-on punctuation
    text = re.sub(r'\.\.\.+', '.', text)
    text = re.sub(r',,+', ',', text)
    text = re.sub(r';;+', ';', text)
    
    # Fix bullet point formatting
    text = re.sub(r'• +', '• ', text)
    text = re.sub(r'- +', '- ', text)
    
    return text

def standardize_buddhist_terms(text: str) -> str:
    """Standardize Buddhist terminology according to FPMT conventions."""
    
    # Sort by length (longest first) to avoid partial replacements
    sorted_terms = sorted(BUDDHIST_TERMS.items(), key=lambda x: len(x[0]), reverse=True)
    
    for wrong, right in sorted_terms:
        # Use word boundaries where appropriate
        if wrong[0].isalpha() and wrong[-1].isalpha():
            # Case-insensitive replacement for full words
            pattern = r'\b' + re.escape(wrong) + r'\b'
            text = re.sub(pattern, right, text, flags=re.IGNORECASE)
        else:
            text = text.replace(wrong, right)
    
    return text

def fix_capitalization(text: str) -> str:
    """Fix capitalization issues."""
    
    # Fix sentence capitalization (after period, capitalize next word)
    # Simple approach: just capitalize first letter after ". "
    def capitalize_match(match):
        return match.group(0).upper()
    text = re.sub(r'(?<=\.\s)[a-z]', capitalize_match, text)
    
    # Ensure proper nouns are capitalized
    proper_nouns = [
        'nagarjuna', 'asanga', 'vasubandhu', 'chandrakirti', 'shantideva',
        'tsongkhapa', 'je tsongkhapa', 'longchenpa', 'mipham', 'jamgong kongtrul',
        'dalai lama', 'hh dalai lama', 'his holiness', 'khen rinpoche',
        'geshe chonyi', 'je tsongkhapa', 'lama tsong khapa', 'fpmt',
        'tibet', 'tibetan', 'india', 'china', 'nepal', 'mongolia',
        'sera je', 'drepung', 'ganden', 'nalanda', 'vikramashila',
        'uttaratantra', 'ratnagotravibhaga', 'maitreya', 'asanga',
        'abhisamayalamkara', 'ornament of clear realization',
        'madhyamakavatara', 'entering the middle way',
        'bodhicaryavatara', 'engaging in the deeds of a bodhisattva',
        'mulamadhyamakakarika', 'fundamental wisdom of the middle way',
        'yogacarabhumi', 'stages of the yogic paths',
        'pramanavarttika', 'commentary on valid cognition',
        'dharmakirti', 'dignaga',
    ]
    
    for noun in proper_nouns:
        # Capitalize proper nouns
        words = noun.split()
        capitalized = ' '.join(word.capitalize() for word in words)
        text = re.sub(r'\b' + re.escape(noun) + r'\b', capitalized, text, flags=re.IGNORECASE)
    
    return text

def process_chunk(chunk: str) -> str:
    """Process a chunk of text through all refinements."""
    
    # Apply fixes in order
    text = fix_common_errors(chunk)
    text = standardize_buddhist_terms(text)
    text = fix_capitalization(text)
    
    return text

def refine_book():
    """Read, refine, and write the book in chunks."""
    
    print(f"Starting refinement at {datetime.now().isoformat()}")
    print(f"Input: {INPUT_FILE}")
    print(f"Output: {OUTPUT_FILE}")
    print("-" * 60)
    
    # Read file in chunks to handle large size
    chunk_size = 10 * 1024 * 1024  # 10 MB chunks
    total_chars = 0
    chunks_processed = 0
    
    with open(INPUT_FILE, 'r', encoding='utf-8') as infile, \
         open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        
        while True:
            chunk = infile.read(chunk_size)
            if not chunk:
                break
            
            chunks_processed += 1
            total_chars += len(chunk)
            
            print(f"Processing chunk {chunks_processed} ({len(chunk):,} chars)...", end=" ")
            
            refined = process_chunk(chunk)
            
            outfile.write(refined)
            
            print(f"done ({len(refined):,} chars)")
    
    print("\n" + "=" * 60)
    print("REFINEMENT COMPLETE")
    print(f"Chunks processed: {chunks_processed}")
    print(f"Total characters: {total_chars:,}")
    print(f"\nRefined book written to: {OUTPUT_FILE}")
    
    # Write stats
    stats_file = OUTPUT_FILE.replace('.md', '_stats.txt')
    with open(stats_file, 'w', encoding='utf-8') as f:
        f.write(f"BP2 Book Refinement Statistics\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n\n")
        f.write(f"Input file: {INPUT_FILE}\n")
        f.write(f"Output file: {OUTPUT_FILE}\n")
        f.write(f"Total characters: {total_chars:,}\n")
        f.write(f"Chunks processed: {chunks_processed}\n\n")
        f.write("Refinements applied:\n")
        f.write("- Common grammar and spelling errors corrected\n")
        f.write("- Buddhist terminology standardized (FPMT style)\n")
        f.write("- Punctuation normalized\n")
        f.write("- Proper nouns capitalized\n")
        f.write("- UK spelling converted to US (where appropriate)\n")
        f.write("- Repeated words removed\n")
        f.write("- Sentence capitalization fixed\n")

if __name__ == "__main__":
    refine_book()
