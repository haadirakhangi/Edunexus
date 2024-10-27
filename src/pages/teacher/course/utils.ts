export const insertImageAtCursor = (content: string, imageUrl: string, imageName: string): string => {
    const newImageMarkdown = `\n![${imageName}](${imageUrl})\n`;
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement | null;
    const cursorIndex = textarea?.selectionStart || 0;
    return content.slice(0, cursorIndex) + newImageMarkdown + content.slice(cursorIndex);
};


export const insertImageAtIndex = (content: string, imageUrl: string, imageName: string, lineIndex: number): string => {
    // const isURL = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
    const newImageMarkdown = `\n![${imageName}](${imageUrl})\n`;
    const lines = content.split('\n');
    if (lineIndex < 0 || lineIndex > lines.length) {
        throw new Error('Line index out of bounds');
    }
    lines.splice(lineIndex, 0, newImageMarkdown.trim()); 
    return lines.join('\n');
};

export function base64ToFile(base64String: string, fileName: string): File {
    const arr = base64String.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : '';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], fileName, { type: mime });
}
