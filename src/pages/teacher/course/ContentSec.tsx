import { useState, useEffect, useCallback } from 'react';
import { Box, Heading, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react';
import { debounce } from 'lodash';

interface ContentSecProps {
  contentData: { [submodule: string]: string }[]; // List of dictionaries
  selectedSubmodule: string; // Currently selected submodule
  onUpdateContent: (updatedContent: { [submodule: string]: string }[]) => void; // Handler for updating contentData
}

const ContentSec: React.FC<ContentSecProps> = ({ contentData, selectedSubmodule, onUpdateContent }) => {
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
    const renderedContent = lines.map((line, index) => {
      // Check for image markdown
      const imagePattern = /!\[(.*?)\]\((.*?)\)/; // Matches the markdown for images
      const imageMatch = line.match(imagePattern);

      if (imageMatch) {
        const altText = imageMatch[1];
        const imageUrl = imageMatch[2];
        return (
          <img key={index} src={imageUrl} alt={altText} style={{ maxWidth: '100%', height: 'auto' }} />
        );
      }

      // Headings
      if (line.startsWith('## ')) {
        return (
          <Heading as="h2" size="xl" key={index} fontWeight="bold">
            {line.slice(3)}
          </Heading>
        );
      } else if (line.startsWith('# ')) {
        return (
          <Heading as="h1" size="2xl" key={index}>
            {line.slice(2)}
          </Heading>
        );
      } else if (line.startsWith('### ')) {
        return (
          <Heading as="h3" size="lg" key={index} fontWeight="bold">
            {line.slice(4)}
          </Heading>
        );
      }

      // Bold text regex
      const boldPattern = /\*\*(.*?)\*\*/g;

      // Bullet points handling
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const formattedLine = line.slice(2).replace(boldPattern, (match, p1) => `<strong>${p1}</strong>`);
        return (
          <li key={index} style={{ marginLeft: '20px', listStyleType: 'disc' }} dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }

      // Bold text for non-bullet points
      const formattedLine = line.replace(boldPattern, (match, p1) => `<strong>${p1}</strong>`);

      // Ensure line breaks and empty lines are respected
      if (line.trim() === '') {
        return <br key={index} />; // Add line breaks for empty lines
      } else {
        return (
          <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine.replace(/\n/g, '<br />') }} />
        );
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
            _selected={{ bg: "purple.800", color: "white" }} // Change background and text color for selected tab
            color="white" // Set default text color
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
              id="markdown-textarea" // Add an ID to reference the textarea for cursor position
              value={markdownContent}
              bg={'white'}
              borderRadius={"30"}
              p={8}
              _focus={{ outline: 'none', boxShadow: 'none' }}
              onChange={handleContentChange}
              placeholder="Write your Markdown content here..."
              size="2xl"
              rows={20}
              style={{ whiteSpace: 'pre-wrap' }} // Ensures line breaks show in the textarea
            />
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </TabPanel>

          <TabPanel>
            <Box bg={'white'} p={8} borderRadius={"30"}>
              {renderMarkdown(markdownContent)}
            </Box>

            {/* <VStack mt={4} spacing={4}>
              {uploadedImages.map((image, idx) => (
                <img key={idx} src={image} alt={`Uploaded ${idx}`} width="100%" />
              ))}
            </VStack> */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ContentSec;
