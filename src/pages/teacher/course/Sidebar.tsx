import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Heading,
    VStack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    SimpleGrid,
    Flex,
    Text,
    Image,
    Collapse,
} from '@chakra-ui/react';
import { AiOutlineFileText, AiOutlinePicture, AiOutlineAudio, AiOutlineExperiment } from 'react-icons/ai';

interface SidebarProps {
    contentData: { [submodule: string]: string }[]; // List of dictionaries, each with one submodule
    setSelectedSubmodule: (submodule: string) => void; // Function to set selected submodule
    isLoading: boolean;
    setCurrentIndex: (index: number) => void;
    relevant_images: (string[])[];
    onInsertImage: (imageUrl: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    contentData = [], // Default to an empty array if undefined
    setSelectedSubmodule,
    isLoading,
    setCurrentIndex,
    relevant_images,
    onInsertImage,
}) => {
    const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null); // Controls which tab is open
    const [activeContentIndex, setActiveContentIndex] = useState<number>(0); // Controls which topic is selected

    const submoduleKeys = contentData.map(submodule => Object.keys(submodule)[0]); // Get the submodule names

    const changeCon = (index: number) => {
        setActiveContentIndex(index); // Update when clicking inside the topics list
    };

    const categorizeImages = (images: string[]) => {
        const textbookImages = [];
        const googleImages = [];

        images.forEach((image) => {
            if (image.startsWith('https://')) {
                googleImages.push(image); // If it's an HTTPS link, go to Google tab
            } else {
                textbookImages.push(image); // Else go to Textbook/Links tab
            }
        });

        return { textbookImages, googleImages };
    };

    const allTextbookImages: string[] = [];
    const allGoogleImages: string[] = [];

    relevant_images.forEach((images) => {
        const { textbookImages, googleImages } = categorizeImages(images);
        allTextbookImages.push(...textbookImages);
        allGoogleImages.push(...googleImages);
    });


    useEffect(() => {
        localStorage.setItem('active_content_index', activeContentIndex.toString());
        setSelectedSubmodule(submoduleKeys[activeContentIndex]); // Set selected submodule by key
        setCurrentIndex(activeContentIndex); // Set current index
    }, [activeContentIndex, submoduleKeys, setSelectedSubmodule, setCurrentIndex]);

    if (isLoading) {
        return null;
    }

    const toggleTab = (tabIndex: number) => {
        setActiveTabIndex(prevIndex => (prevIndex === tabIndex ? null : tabIndex));
    };

    return (
        <Box height={"100vh"} bg={"#F8F6F4"}>
            <Tabs
                orientation="vertical"
                variant="unstyled"
                index={activeTabIndex ?? -1} // Show no tab panel if activeTabIndex is null
            >
                <TabList bg={'#D1D1D1'} height={"100vh"} p={"2"} borderTopRightRadius={20} borderBottomRightRadius={20}>
                    <Tab
                        _hover={{ transform: 'scale(1.05)', backgroundColor: 'gray.100', border: 'none' }}
                        _selected={{ bg: 'purple.500', color: 'white' }}
                        padding={1}
                        my={2}
                        _focus={{ outline: 'none', boxShadow: 'none' }}
                        width={["80px", "100px", "70px"]}
                        borderRadius="md"
                        onClick={() => toggleTab(0)}
                    >
                        <Flex direction="column" align="center">
                            <AiOutlineFileText style={{ marginBottom: '4px', fontSize: '24px' }} />
                            <Text fontSize="sm">Topics</Text>
                        </Flex>
                    </Tab>
                    <Tab
                        _hover={{ transform: 'scale(1.05)', backgroundColor: 'gray.100', border: 'none' }}
                        _selected={{ bg: 'purple.500', color: 'white' }}
                        padding={1}
                        my={2}
                        _focus={{ outline: 'none', boxShadow: 'none' }}
                        width={["80px", "100px", "70px"]}
                        borderRadius="md"
                        onClick={() => toggleTab(1)}
                    >
                        <Flex direction="column" align="center">
                            <AiOutlinePicture style={{ marginBottom: '4px', fontSize: '24px' }} />
                            <Text fontSize="sm">Images Section</Text>
                        </Flex>
                    </Tab>
                    <Tab
                        _hover={{ transform: 'scale(1.05)', backgroundColor: 'gray.100', border: 'none' }}
                        _selected={{ bg: 'purple.500', color: 'white' }}
                        padding={1}
                        my={2}
                        _focus={{ outline: 'none', boxShadow: 'none' }}
                        width={["80px", "100px", "70px"]}
                        borderRadius="md"
                        onClick={() => toggleTab(3)}
                    >
                        <Flex direction="column" align="center">
                            <AiOutlineExperiment style={{ marginBottom: '4px', fontSize: '24px' }} />
                            <Text fontSize="sm">Dynamic Labs</Text>
                        </Flex>
                    </Tab>
                </TabList>

                {activeTabIndex !== null && (
                    <TabPanels mt={2} bg={'#DFDFDF'} height={'100vh'} borderRadius={20} boxShadow={'10px 0 15px -5px rgba(0, 0, 0, 0.3)'}>
                        <Collapse in={activeTabIndex === 0} animate="slide" animateOpacity={true}>
                            <TabPanel width={["80px", "200px", "350px"]}>
                                <Heading as="h3" size="md" textAlign="center" mb={4}>
                                    Lessons
                                </Heading>
                                <VStack spacing={2} align="stretch">
                                    {submoduleKeys.map((submodule, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            p={"25"}
                                            onClick={() => changeCon(index)} // Update content when submodule is clicked
                                            justifyContent="flex-start"
                                            borderColor={'purple.300'}
                                            borderWidth={3}
                                            borderRadius={15}
                                            _focus={{ outline: 'none', boxShadow: 'none' }}
                                            bg={activeContentIndex === index ? 'purple.500' : 'white'}
                                            color={activeContentIndex === index ? 'white' : 'inherit'}
                                            className="roboto-bold"
                                            _hover={{ transform: 'scale(1.05)', textDecoration: 'none', borderColor: 'purple.200' }}
                                            style={{
                                                whiteSpace: 'normal',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: '1.5',
                                            }}
                                        >
                                            {index + 1}. {submodule}
                                        </Button>
                                    ))}
                                </VStack>
                            </TabPanel>
                        </Collapse>

                        <Collapse in={activeTabIndex === 1}>
                            <TabPanel width={["80px", "200px", "350px"]}>
                                <Heading as="h3" size="md" textAlign="center" mb={2}>
                                    Image Section
                                </Heading>
                                <Tabs variant="soft-rounded" colorScheme="purple">
                                    <TabList>
                                        <Tab>Textbook/Links</Tab>
                                        <Tab>Google</Tab>
                                        <Tab>Uploaded</Tab>
                                    </TabList>

                                    <TabPanels>
                                        <TabPanel>
                                            <Box height={"600px"} overflowY="auto">
                                                <SimpleGrid columns={[2, 2, 3]} spacing={4}>
                                                    {allTextbookImages.map((image, index) => (
                                                        <Box key={index} p={2} borderWidth={1} borderRadius="md">
                                                            <Image src={`data:image/png;base64,${image}`} onClick={() => onInsertImage(`data:image/png;base64,${image}`,index)} alt={`Textbook Link ${index}`} style={{ width: '100%', height: 'auto' }} />
                                                        </Box>
                                                    ))}
                                                </SimpleGrid>
                                            </Box>
                                        </TabPanel>

                                        <TabPanel>
                                            <Box maxHeight="400px" overflowY="auto">
                                                <SimpleGrid columns={[2, 2, 3]} spacing={4}>
                                                    {allGoogleImages.map((image, index) => (
                                                        <Box key={index} p={2} borderWidth={1} borderRadius="md">
                                                            <Image src={image} alt={`Google Link ${index}`} style={{ width: '100%', height: 'auto' }} />
                                                        </Box>
                                                    ))}
                                                </SimpleGrid>
                                            </Box>
                                        </TabPanel>

                                        <TabPanel>
                                            <Text textAlign="center">No uploaded images yet.</Text>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </TabPanel>

                        </Collapse>

                        <Collapse in={activeTabIndex === 2}>
                            <TabPanel width={["80px", "200px", "350px"]}>
                                <Heading as="h3" size="md" textAlign="center" mb={2}>
                                    Voice Cloning Section
                                </Heading>
                            </TabPanel>
                        </Collapse>

                        <Collapse in={activeTabIndex === 3}>
                            <TabPanel width={["80px", "200px", "350px"]}>
                                <Heading as="h3" size="md" textAlign="center" mb={2}>
                                    Dynamic Lab Section
                                </Heading>
                            </TabPanel>
                        </Collapse>
                    </TabPanels>
                )}
            </Tabs>
        </Box>
    );
};

export default Sidebar;
