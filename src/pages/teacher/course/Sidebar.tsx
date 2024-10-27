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
import { AiOutlineFileText, AiOutlinePicture } from 'react-icons/ai';

interface SidebarProps {
    contentData: { [submodule: string]: string }[];
    setSelectedSubmodule: (submodule: string) => void;
    isLoading: boolean;
    setCurrentIndex: (index: number) => void;
    relevant_images: (string[])[];
    uploadedImages: string[];
    onInsertImage: (imageUrl: string, index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    contentData = [],
    setSelectedSubmodule,
    isLoading,
    setCurrentIndex,
    relevant_images,
    uploadedImages,
    onInsertImage,
}) => {
    const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null);
    const [activeContentIndex, setActiveContentIndex] = useState<number>(0);
    const submoduleKeys = contentData.map(submodule => Object.keys(submodule)[0]);

    const changeCon = (index: number) => {
        setActiveContentIndex(index);
    };

    const categorizeImages = (images: string[]) => {
        const textbookImages = new Set<string>();
        const googleImages = new Set<string>();
        images.forEach((image) => {
            if (image.startsWith('https://')) {
                googleImages.add(image);
            } else {
                textbookImages.add(image);
            }
        });
        return { textbookImages: Array.from(textbookImages), googleImages: Array.from(googleImages) };
    };

    const allTextbookImagesSet = new Set<string>();
    const allGoogleImagesSet = new Set<string>();

    relevant_images.forEach((images) => {
        const { textbookImages, googleImages } = categorizeImages(images);
        textbookImages.forEach(image => allTextbookImagesSet.add(image));
        googleImages.forEach(image => allGoogleImagesSet.add(image));
    });


    const allTextbookImages = Array.from(allTextbookImagesSet);
    const allGoogleImages = Array.from(allGoogleImagesSet);


    useEffect(() => {
        localStorage.setItem('active_content_index', activeContentIndex.toString());
        setSelectedSubmodule(submoduleKeys[activeContentIndex]);
        setCurrentIndex(activeContentIndex);
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
                index={activeTabIndex ?? -1}
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
                </TabList>

                {activeTabIndex !== null && (
                    <TabPanels mt={2} bg={'#DFDFDF'} height={'100vh'} borderRadius={20} boxShadow={'10px 0 15px -5px rgba(0, 0, 0, 0.3)'}>
                        <Collapse in={activeTabIndex === 0} transition={{ enter: { duration: 0.1 }, exit: { duration: 0.1 } }}>
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
                                            onClick={() => changeCon(index)}
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

                        <Collapse in={activeTabIndex === 1} transition={{ enter: { duration: 0.1 }, exit: { duration: 0.1 } }}>
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
                                                {allTextbookImages.length === 0 ? (
                                                    <Box textAlign="center" p={4}>
                                                        No images available.
                                                    </Box>
                                                ) : (
                                                    <SimpleGrid columns={[2, 2, 2]}>
                                                        {allTextbookImages.map((image, index) => (
                                                            <Box
                                                                key={index}
                                                                p={2}
                                                                transition="transform 0.2s ease-in-out"
                                                                _hover={{ transform: 'scale(1.3)' }}
                                                            >
                                                                <Image
                                                                    src={`data:image/png;base64,${image}`}
                                                                    onClick={() => onInsertImage(`data:image/png;base64,${image}`, index)}
                                                                    alt={`Textbook Link ${index}`}
                                                                    style={{ width: '100%', height: 'auto' }}
                                                                />
                                                            </Box>
                                                        ))}
                                                    </SimpleGrid>
                                                )}
                                            </Box>
                                        </TabPanel>

                                        <TabPanel>
                                            <Box maxHeight="600px" overflowY="auto">
                                                {allGoogleImages.length === 0 ? (
                                                    <Box textAlign="center" p={4}>
                                                        No images available.
                                                    </Box>
                                                ) : (
                                                    <SimpleGrid columns={[2, 2, 2]}>
                                                        {allGoogleImages.map((image, index) => (
                                                            <Box
                                                                key={index}
                                                                p={2}
                                                                transition="transform 0.2s ease-in-out"
                                                                _hover={{ transform: 'scale(1.3)' }}
                                                            >
                                                                <Image
                                                                    src={image}
                                                                    onClick={() => onInsertImage(image, index)}
                                                                    alt={`Google Link ${index}`}
                                                                    style={{ width: '100%', height: 'auto' }}
                                                                />
                                                            </Box>
                                                        ))}
                                                    </SimpleGrid>
                                                )}
                                            </Box>
                                        </TabPanel>


                                        <TabPanel>
                                            <Box height={"600px"} overflowY="auto">
                                                {uploadedImages.length === 0 ? (
                                                    <Box textAlign="center" p={4}>
                                                        No images available.
                                                    </Box>
                                                ) : (
                                                    <SimpleGrid columns={[2, 2, 2]}>
                                                        {uploadedImages.map((image, index) => (
                                                            <Box
                                                                key={index}
                                                                p={2}
                                                                transition="transform 0.2s ease-in-out"
                                                                _hover={{ transform: 'scale(1.3)' }}
                                                            >
                                                                <Image
                                                                    src={image}
                                                                    // onClick={() => onInsertImage(`data:image/png;base64,${image}`, index)}
                                                                    alt={`Uploaded Link ${index}`}
                                                                    style={{ width: '100%', height: 'auto' }}
                                                                />
                                                            </Box>
                                                        ))}
                                                    </SimpleGrid>
                                                )}
                                            </Box>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </TabPanel>

                        </Collapse>

                    </TabPanels>
                )}
            </Tabs>
        </Box>
    );
};

export default Sidebar;
