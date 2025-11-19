#!/usr/bin/env python3
# Extract all questions from .docx files
# -*- coding: utf-8 -*-

import sys
import os
import codecs
from docx import Document

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def extract_questions_from_docx(file_path):
    """Extract questions from a .docx file"""
    try:
        doc = Document(file_path)
        questions = []
        current_section = None
        
        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue
            
            # Check if it's a section header
            if 'SECTION' in text.upper() or text.upper().startswith('SECTION'):
                current_section = text
                questions.append(f"\n=== {text} ===\n")
            # Check if it's a question (usually numbered or has question mark)
            elif '?' in text or (text and (text[0].isdigit() or text.startswith('Q') or text.startswith('Question'))):
                questions.append(f"Q: {text}\n")
            # Check for Arabic text
            elif any('\u0600' <= char <= '\u06FF' for char in text) and len(text) > 10:
                questions.append(f"A: {text}\n")
        
        return questions
    except Exception as e:
        return [f"Error reading {file_path}: {str(e)}"]

def main():
    base_dir = os.path.join(os.path.dirname(__file__), 'Attach')
    output_file = 'extracted-questions.txt'
    
    files = [
        'STAFF-EMPLOYEE survey VERSION.docx',
        'Managers survey.docx',
        'HR EMPLOYEE survey.docx'
    ]
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for filename in files:
            file_path = os.path.join(base_dir, filename)
            if os.path.exists(file_path):
                f.write(f"\n{'='*70}\n")
                f.write(f"EXTRACTING FROM: {filename}\n")
                f.write('='*70 + '\n')
                questions = extract_questions_from_docx(file_path)
                for q in questions:
                    f.write(q)
                    print(q, end='')
            else:
                msg = f"File not found: {file_path}\n"
                f.write(msg)
                print(msg, end='')
    
    print(f"\n\n✅ Extracted questions saved to: {output_file}")

if __name__ == '__main__':
    main()

