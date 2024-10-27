import { useState, useEffect, useRef, useCallback } from 'react';
import { Box,Input, Tabs, TabList, TabPanels, Tab, TabPanel, Textarea } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { handleImageUpload, base64ToFile, insertImageAtIndex } from "./utils";
import { renderMarkdown } from './renderMarkdown';

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
  const hasCalledInitialImages = useRef(false);

  useEffect(() => {
    const selected = contentData.find((item) => selectedSubmodule in item);
    if (selected) {
      setMarkdownContent(selected[selectedSubmodule]);
    }
  }, [selectedSubmodule, contentData]);

  // This useEffect will only call initalImges once after markdownContent has been set
  useEffect(() => {
    if (markdownContent && !hasCalledInitialImages.current) {
      initalImges(markdownContent);
      hasCalledInitialImages.current = true;
    }
  }, [markdownContent]);

  // Debounced function to update content
  const debouncedUpdate = useCallback(
    debounce((updatedContent) => {
      onUpdateContent(updatedContent);
    }, 300), // Adjust the delay as needed
    [onUpdateContent]
  );

  const initalImges = (content: string) => {
    const index = contentData.findIndex((item) => selectedSubmodule in item);
    const imagesForSubmodule = relevant_images[index]?.slice(0, 2) || [];
    let updatedContent = content; // Start with the original content

    imagesForSubmodule.forEach((imageLink, i) => {
      const isURL = imageLink.startsWith('http://') || imageLink.startsWith('https://');

      if (!isURL) {
        // Prepend the data URI prefix for Base64
        imageLink = `data:image/png;base64,${imageLink}`;

        // Convert Base64 to File object
        const file = base64ToFile(imageLink, `image-${i + 1}.png`);
        const fileUrl = URL.createObjectURL(file);

        // Insert image at specific line index
        const insertionIndex = i === 0 ? 3 : 6; // Insert first image at line 3 and second at line 6
        updatedContent = insertImageAtIndex(updatedContent, fileUrl, file.name, insertionIndex);
      }
    });

    // Update markdown content state with all images inserted
    setMarkdownContent(updatedContent);
  };


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
              rows={18}
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <Box width={'50%'} mt={2}>
            <Input
              type="file"
              borderColor={'purple.600'}
              p={1}
              multiple={true}
              _hover={{ borderColor: "purple.600" }}
              accept="image/*"
              onChange={(e) => handleImageUpload(e, markdownContent, setMarkdownContent, setUploadedImages)}
            />
            </Box>
            
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
