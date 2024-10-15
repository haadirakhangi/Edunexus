import { useState, useEffect, useCallback } from 'react';
import { Box, Image, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react';
import { debounce } from 'lodash';

interface ContentSecProps {
  contentData: { [submodule: string]: string }[]; // List of dictionaries
  selectedSubmodule: string; // Currently selected submodule
  onUpdateContent: (updatedContent: { [submodule: string]: string }[]) => void; // Handler for updating contentData
  relevant_images: (string[])[]; // List of lists containing either base64 or image links for each submodule
}

const ContentSec: React.FC<ContentSecProps> = ({
  contentData,
  selectedSubmodule,
  onUpdateContent,
  relevant_images,
}) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    const selected = contentData.find((item) => selectedSubmodule in item);
    if (selected) {
      setMarkdownContent(selected[selectedSubmodule]);
    }
  }, [selectedSubmodule, contentData]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        setUploadedImages((prev) => [...prev, imageUrl]);

        // Insert image markdown at the cursor position
        const newMarkdownContent = insertImageAtCursor(markdownContent, imageUrl, file.name);
        setMarkdownContent(newMarkdownContent);
      });
    }
  };

  const insertImageAtCursor = (content: string, imageUrl: string, imageName: string) => {
    const newImageMarkdown = `\n![${imageName}](${imageUrl})\n`;
    const cursorIndex = document.getElementById('markdown-textarea')?.selectionStart || 0;
    return content.slice(0, cursorIndex) + newImageMarkdown + content.slice(cursorIndex);
  };

  // Debounced function to update content
  const debouncedUpdate = useCallback(
    debounce((updatedContent) => {
      onUpdateContent(updatedContent);
    }, 300), // Adjust the delay as needed
    [onUpdateContent]
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);

    // Update contentData with the modified markdown content for the selected submodule
    const updatedContent = contentData.map((item) =>
      selectedSubmodule in item
        ? { ...item, [selectedSubmodule]: newContent }
        : item
    );

    // Call the debounced update function
    debouncedUpdate(updatedContent);
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const renderedContent = [];
    const imagePattern = /!\[(.*?)\]\((.*?)\)/;

    const index = contentData.findIndex((item) => selectedSubmodule in item);
    const imagesForSubmodule = relevant_images[index]?.slice(0, 2) || [];

    let imageInserted = 0;

    lines.forEach((line, idx) => {
      // Insert the relevant images as markdown links at the appropriate positions
      if (imageInserted < imagesForSubmodule.length && idx === 3) {
        const imageLink = imagesForSubmodule[imageInserted];
        renderedContent.push(
          <Box display="flex" justifyContent="center" alignItems="center" mx={4} key={`img-link-${imageInserted}`}>
            <a href={`data:image/png;base64,${imageLink}`} target="_blank" rel="noopener noreferrer">
              <Image
                src={`data:image/png;base64,${imageLink}`}
                alt={`Relevant Image ${imageInserted + 1}`}
                objectFit="cover"
                boxSize={{ base: '100px', md: '300px', lg: '500px' }}
              />
            </a>
          </Box>
        );
        imageInserted++;
      }

      // Similar insertion for the second image
      if (imageInserted < imagesForSubmodule.length && idx === 6) {
        const imageLink = imagesForSubmodule[imageInserted];
        renderedContent.push(
          <Box display="flex" justifyContent="center" alignItems="center" mx={4} key={`img-link-${imageInserted}`}>
            <a href={`data:image/png;base64,${imageLink}`} target="_blank" rel="noopener noreferrer">
              <Image
                src={`data:image/png;base64,${imageLink}`}
                alt={`Relevant Image ${imageInserted + 1}`}
                objectFit="cover"
                boxSize={{ base: '100px', md: '300px', lg: '500px' }}
              />
            </a>
          </Box>
        );
        imageInserted++;
      }

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
              objectFit="cover"
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

  return (
    <Box p={8} width={'full'} height={'100vh'} display="flex">
      <Tabs isFitted variant="enclosed" width={["80px", "200px", "full"]} p={2} overflow={'auto'}>
        <TabList mb="1em" border="none">
          <Tab
            borderLeftRadius={20}
            borderRightRadius={0}
            bg="purple.500"
            _hover={{ border: 'none' }}
            _selected={{ bg: "purple.800", color: "white" }}
            color="white"
            className='roboto-bold'
            p={2}
            _focus={{ outline: 'none', boxShadow: 'none' }}
            fontSize={20}
          >
            Write
          </Tab>
          <Tab
            _selected={{ bg: "purple.700", color: "white" }}
            color="white"
            _hover={{ border: 'none' }}
            borderLeftRadius={0}
            borderRightRadius={20}
            bg="purple.500"
            className='roboto-bold'
            _focus={{ outline: 'none', boxShadow: 'none' }}
            p={2}
            fontSize={20}
          >
            Preview
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Textarea
              id="markdown-textarea"
              value={markdownContent}
              bg={'white'}
              borderRadius={"30"}
              p={8}
              _focus={{ outline: 'none', boxShadow: 'none' }}
              onChange={handleContentChange}
              placeholder="Write your Markdown content here..."
              size="2xl"
              rows={20}
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </TabPanel>

          <TabPanel>
            <Box bg={'white'} p={8} borderRadius={"30"}>
              {renderMarkdown(markdownContent)}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ContentSec;
