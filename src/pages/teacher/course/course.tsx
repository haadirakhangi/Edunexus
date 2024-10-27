import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Spinner,
    Heading,
    VStack,
    HStack,
    Flex,
} from '@chakra-ui/react';
import Sidebar from './Sidebar';
import ContentSec from './ContentSec';
import { Navbar } from '../../../components/navbar';
import { base64ToFile, insertImageAtIndex } from './utils';

interface ContentDataItem {
    [submoduleTitle: string]: string;
}
import { contentData_textbook, relevant_images_textbook, contentData, relevant_images } from './tp';

const PerContent: React.FC = () => {
    const [data, setData] = useState<ContentDataItem[]>([]);
    const [selectedSubmodule, setSelectedSubmodule] = useState<string | null>(null);
    const [images, setImages] = useState<string[][]>([]);
    // const [videos, setVideos] = useState<string[][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const insertImagesForAllSubmodules = () => {
        const updatedData = data.map((item, index) => {
            const submoduleKey = Object.keys(item)[0];
            const content = item[submoduleKey];
            const imagesForSubmodule = images[index]?.slice(0, 2) || [];

            let updatedContent = content; // Start with the original content

            imagesForSubmodule.forEach((imageLink, i) => {
                const isURL = imageLink.startsWith('http://') || imageLink.startsWith('https://');

                if (!isURL) {
                    // Prepend the data URI prefix for Base64
                    imageLink = `data:image/png;base64,${imageLink}`;

                    // Convert Base64 to File object
                    const file = base64ToFile(imageLink, `image-${i + 1}.png`);
                    const fileUrl = URL.createObjectURL(file);

                    // Insert image at specific line index (customize as needed)
                    const insertionIndex = i === 0 ? 3 : 6;
                    updatedContent = insertImageAtIndex(updatedContent, fileUrl, file.name, insertionIndex);
                } else {
                    const insertionIndex = i === 0 ? 3 : 6;
                    updatedContent = insertImageAtIndex(updatedContent, imageLink, `image-${i + 1}`, insertionIndex);
                }
            });

            return { ...item, [submoduleKey]: updatedContent }; // Return updated content
        });

        setData(updatedData); // Update state with new content including images
    };

    const insertImageAtCursor = (imageUrl: string, i: number) => {
        let fileUrl: string;

        // Check if the image URL is a valid internet link
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            fileUrl = imageUrl;
        } else {
            const file = base64ToFile(imageUrl, `image-${i + 1}.png`);
            fileUrl = URL.createObjectURL(file); // Create a blob URL if it's not a direct link
        }

        setData((prevData) => {
            return prevData.map((item) => {
                // Ensure selectedSubmodule is not null before checking
                if (selectedSubmodule && selectedSubmodule in item) {
                    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
                    const { selectionStart, selectionEnd } = textarea;

                    const newContent = `${item[selectedSubmodule].slice(0, selectionStart)}![Image](${fileUrl})${item[selectedSubmodule].slice(selectionEnd)}`;
                    return { ...item, [selectedSubmodule]: newContent }; // Use selectedSubmodule correctly
                }
                return item; // Return unchanged item
            });
        });
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get('/api/query2/multimodal-rag-content', { withCredentials: true });
                // Example static data for now
                // Replace with actual data fetching

                // setImages(response.data.relevant_images);
                // setVideos(videoUrls);
                // setData(response.data.content);
                setImages(relevant_images);
                setData(contentData);
                setSelectedSubmodule(Object.keys(contentData[0] || {})[0]); // Set the first submodule as default
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            insertImagesForAllSubmodules(); // Insert images into markdown after loading
        }
    }, [isLoading]);

    const handleUpdateContent = (updatedContent: { [submodule: string]: string }[]) => {
        setData(updatedContent); // Update the contentData state
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <Flex justify="center" align="center" width="100vw" height="90vh" textAlign="center">
                    <VStack>
                        <Spinner size="xl" color="purple.500" />
                        <Heading>Generating Content...</Heading>
                    </VStack>
                </Flex>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <HStack alignItems="flex-start" bg={"#F8F6F4"} width={'99vw'} overflow='hidden'>
                {/* Sidebar */}
                <Sidebar
                    contentData={data} // Pass the data
                    setSelectedSubmodule={(submodule) => {
                        setSelectedSubmodule(submodule);
                        setCurrentIndex(data.findIndex(item => Object.keys(item)[0] === submodule)); // Set the current index based on the submodule
                    }}
                    isLoading={isLoading}
                    setCurrentIndex={setCurrentIndex} // Update index if needed
                    relevant_images={images}
                    uploadedImages={uploadedImages}
                    onInsertImage={insertImageAtCursor}
                />


                {selectedSubmodule && (
                    <ContentSec
                        contentData={data} // Pass the entire data
                        selectedSubmodule={selectedSubmodule}
                        onUpdateContent={handleUpdateContent}
                        uploadedImages={uploadedImages}
                        setUploadedImages={setUploadedImages}
                    // videos={videos}
                    />
                )}
            </HStack>
        </>
    );
};

export default PerContent;
