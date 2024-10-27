// renderMarkdown.tsx

import { Box, Heading, Image } from '@chakra-ui/react';

export const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const renderedContent = [];
    const imagePattern = /!\[(.*?)\]\((.*?)\)/;

    lines.forEach((line, idx) => {
        const imageMatch = line.match(imagePattern);
        if (imageMatch) {
            const altText = imageMatch[1];
            const imageUrl = imageMatch[2];
            renderedContent.push(
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mx={4}
                    key={`rendered-img-${idx}`}
                >
                    <Image
                        src={imageUrl}
                        alt={altText}
                        fit="contain"
                        boxSize={{ base: '100px', md: '300px', lg: '500px' }}
                    />
                </Box>
            );
        } else if (line.startsWith('## ')) {
            renderedContent.push(<Heading size={'md'} key={idx} fontWeight="bold">{line.slice(3)}</Heading>);
        } else if (line.startsWith('# ')) {
            renderedContent.push(<Heading size={'lg'} key={idx}>{line.slice(2)}</Heading>);
        } else if (line.startsWith('### ')) {
            renderedContent.push(<Heading size={"sm"} key={idx} fontWeight="bold">{line.slice(4)}</Heading>);
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            const boldPattern = /\*\*(.*?)\*\*/g;
            const formattedLine = line.slice(2).replace(boldPattern, (match, p1) => `<strong>${p1}</strong>`);
            renderedContent.push(<li key={idx} style={{ marginLeft: '20px', listStyleType: 'disc' }} dangerouslySetInnerHTML={{ __html: formattedLine }} />);
        } else {
            const boldPattern = /\*\*(.*?)\*\*/g;
            const formattedLine = line.replace(boldPattern, (match, p1) => `<strong>${p1}</strong>`);
            if (line.trim() === '') {
                renderedContent.push(<br key={idx} />);
            } else {
                renderedContent.push(<p key={idx} dangerouslySetInnerHTML={{ __html: formattedLine.replace(/\n/g, '<br />') }} />);
            }
        }
    });

    return renderedContent;
};
