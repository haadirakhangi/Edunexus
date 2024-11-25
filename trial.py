import pypandoc

def convert_markdown_to_docx(input_file, output_file, reference_docx=None):
    # Extra Pandoc arguments
    extra_args = [
        '--standalone',
        '--from=markdown+hard_line_breaks+yaml_metadata_block+header_attributes'
    ]
    if reference_docx:
        extra_args.extend(['--reference-doc', reference_docx])

    # Convert Markdown to DOCX
    pypandoc.convert_file(
        input_file,
        'docx',
        format='markdown',
        outputfile=output_file,
        extra_args=extra_args
    )

    print(f"Conversion completed: {output_file}")

# Example usage
input_markdown = 'trial.md'
output_docx = 'output.docx'
reference_docx_template = 'LLM_Exp6.docx'  # Optional, path to your reference DOCX file

convert_markdown_to_docx(input_markdown, output_docx, reference_docx_template)
