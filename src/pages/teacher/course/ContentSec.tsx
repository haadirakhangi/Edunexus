import { useState, useEffect, useCallback } from 'react';
import { Box, Heading, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react';
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
    const renderedContent = lines.map((line, index) => {
      const imagePattern = /!\[(.*?)\]\((.*?)\)/;
      const imageMatch = line.match(imagePattern);

      if (imageMatch) {
        const altText = imageMatch[1];
        const imageUrl = imageMatch[2];
        return (
          <img key={index} src={imageUrl} alt={altText} style={{ maxWidth: '100%', height: 'auto' }} />
        );
      }

      if (line.startsWith('## ')) {
        return <Heading as="h4" size={'lg'} key={index} fontWeight="bold">{line.slice(3)}</Heading>;
      } else if (line.startsWith('# ')) {
        return <Heading as="h2" key={index}>{line.slice(2)}</Heading>;
      } else if (line.startsWith('### ')) {
        return <Heading as="h4" size={"md"} key={index} fontWeight="bold">{line.slice(4)}</Heading>;
      }

      const boldPattern = /\*\*(.*?)\*\*/g;
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const formattedLine = line.slice(2).replace(boldPattern, (match, p1) => `<strong>${p1}</strong>`);
        return <li key={index} style={{ marginLeft: '20px', listStyleType: 'disc' }} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      }

      const formattedLine = line.replace(boldPattern, (match, p1) => `<strong>${p1}</strong>`);

      if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine.replace(/\n/g, '<br />') }} />;
      }
    });

    return renderedContent;
  };

  // const renderRelevantImages = () => {
  //   const index = contentData.findIndex((item) => selectedSubmodule in item);
  //   const imagesForSubmodule = relevant_images[index] || [];

  //   return imagesForSubmodule.map((image, idx) => {
  //     const isBase64 = image.startsWith('data:image');
  //     return (
  //       <img
  //         key={idx}
  //         src={isBase64 ? image : image}
  //         alt={`Relevant image ${idx + 1}`}
  //         style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
  //       />
  //     );
  //   });
  // };

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
              {/* <VStack mt={4} spacing={4}>
                {renderRelevantImages()}
              </VStack> */}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ContentSec;
