import { useState, useEffect } from 'react';
import axios from 'axios';
import {
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


import { contentData_textbook, relevant_images_textbook, contentData, relevant_images, content_testing, relevant_images_testing } from './tp';

const PerContent: React.FC = () => {
    const [data, setData] = useState<ContentDataItem[]>([]);
    const [selectedSubmodule, setSelectedSubmodule] = useState<string | null>(null);
    const [images, setImages] = useState<string[][]>([]);
    // const [videos, setVideos] = useState<string[][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasInsertedImages, setHasInsertedImages] = useState(false);
    const [apiCalled, setApiCalled] = useState(false);
    const lesson_id = Number(localStorage.getItem('lesson_id'));
    const handleSaveLesson = async () => {
        const lesson_name = localStorage.getItem('lesson_name');
        const course_id = Number(localStorage.getItem('course_id'));
        

        try {
            const response = await axios.post('/api/teacher/add-lesson', {
                title: lesson_name,
                markdown_content: data,
                relevant_images: images,
                uploaded_images: uploadedImages,
                lesson_id: lesson_id,
                course_id: course_id
            }, { withCredentials: true });

            alert(response.data.message);
            if(response.data.response){
                localStorage.setItem('lesson_id',response.data.lesson_id.toString())
            }
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert('Failed to save lesson.');
        }
    };

    const insertImagesForAllSubmodules = () => {
        const updatedData = data.map((item, index) => {
            const submoduleKey = Object.keys(item)[0];
            const content = item[submoduleKey];
            const imagesForSubmodule = images[index]?.slice(0, 2) || [];
            let updatedContent = content;
            imagesForSubmodule.forEach((imageLink, i) => {
                const isURL = imageLink.startsWith('http://') || imageLink.startsWith('https://');

                if (!isURL) {
                    imageLink = `data:image/png;base64,${imageLink}`;
                    const file = base64ToFile(imageLink, `image-${i + 1}.png`);
                    const fileUrl = URL.createObjectURL(file);
                    const insertionIndex = i === 0 ? 3 : 6;
                    updatedContent = insertImageAtIndex(updatedContent, fileUrl, file.name, insertionIndex);
                } else {
                    const insertionIndex = i === 0 ? 3 : 6;
                    updatedContent = insertImageAtIndex(updatedContent, imageLink, `image-${i + 1}`, insertionIndex);
                }
            });

            return { ...item, [submoduleKey]: updatedContent };
        });

        setData(updatedData);
    };

    const insertImageAtCursor = (imageUrl: string, i: number) => {
        let fileUrl: string;
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            fileUrl = imageUrl;
        } else if (/^data:image\/[a-zA-Z]+;base64,/.test(imageUrl)) {
            const file = base64ToFile(imageUrl, `image-${i + 1}.png`);
            fileUrl = URL.createObjectURL(file);
        } else {
            fileUrl = imageUrl;
        }
        setData((prevData) => {
            return prevData.map((item) => {
                if (selectedSubmodule && selectedSubmodule in item) {
                    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
                    const { selectionStart, selectionEnd } = textarea;

                    const newContent = `${item[selectedSubmodule].slice(0, selectionStart)}![Image](${fileUrl})${item[selectedSubmodule].slice(selectionEnd)}`;
                    return { ...item, [selectedSubmodule]: newContent };
                }
                return item;
            });
        });
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                if (lesson_id==0) {
                    const response = await axios.get('/api/teacher/multimodal-rag-content', { withCredentials: true });
                    setImages(response.data.relevant_images);
                    setData(response.data.content);
                    setApiCalled(true);
                    setSelectedSubmodule(Object.keys(response.data.content[0] || {})[0]);
                }else{
                    const response = await axios.post('/api/teacher/get-lesson',{
                        lesson_id: lesson_id
                    }, { withCredentials: true });
                    const mk = JSON.parse(response.data.markdown_content);
                    const rimg = JSON.parse(response.data.relevant_images);
                    const umg = JSON.parse(response.data.uploaded_images);
                    setImages(rimg);
                    setData(mk);
                    setUploadedImages(umg)
                    setApiCalled(true);
                    setHasInsertedImages(true);
                    setIsLoading(false);
                    setSelectedSubmodule(Object.keys(response.data.content[0] || {})[0]);
                }

                // setImages(relevant_images_testing);
                // setData(content_testing);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0 && images.length > 0 && !hasInsertedImages) {
            insertImagesForAllSubmodules();
            setHasInsertedImages(true);
            setIsLoading(false);
        }
    }, [data, images, hasInsertedImages]);

    const handleUpdateContent = (updatedContent: { [submodule: string]: string }[]) => {
        setData(updatedContent);
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
                    setUploadedImages={setUploadedImages}
                    handleSaveLesson={handleSaveLesson}
                />


                {selectedSubmodule && (
                    <ContentSec
                        contentData={data} // Pass the entire data
                        selectedSubmodule={selectedSubmodule}
                        onUpdateContent={handleUpdateContent}
                    // videos={videos}
                    />
                )}
            </HStack>
        </>
    );
};

export default PerContent;
