import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Spinner,
    Heading,
    VStack,
    HStack,
    Flex,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Navbar } from '../../../../components/navbar';
import LabManualContent from './LabManualContent';
import LabManualSidebar from './LabManualSidebar';
import { MarkdownContent_ex } from '../tp';


const LabManual: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [contentReady, setContentReady] = useState(false);
    const { register, setValue, watch } = useForm<{ markdownContent: string }>();
    const markdownContent = watch("markdownContent") || "";

    const handleSaveLesson = async () => {
        // try {
        //     const response = await axios.post('/api/teacher/add-lesson', {
        //         title: "lesson 1",
        //         markdown_content: data,
        //         relevant_images: images[currentIndex],
        //         uploaded_images: uploadedImages,
        //         course_id: 'HDSHB' // Replace with the actual course ID
        //     }, { withCredentials: true });

        //     alert(response.data.message); // Show success message
        // } catch (error) {
        //     console.error('Error saving lesson:', error);
        //     alert('Failed to save lesson.');
        // }
        console.log("i was called")
    };

    const insertImageAtCursor = (imageUrl: string) => {
        const textarea = document.getElementById("lab-markdown-textarea") as HTMLTextAreaElement;
        if (textarea) {
            const { selectionStart, selectionEnd, value } = textarea;
            const newContent = `${value.slice(0, selectionStart)}![Image](${imageUrl})${value.slice(selectionEnd)}`;
            setValue("markdownContent", newContent);
        }
    };

    const downloadDocxFile = async () => {
        try {
            const storedData = localStorage.getItem('labManualData');
            const formData = storedData ? JSON.parse(storedData) : {};
            const course_name = formData.course_name;
            const exp_num = formData.exp_num;
            const response = await axios.post(
                '/api/teacher/convert-docx',
                { markdown:markdownContent, course_name: course_name, exp_num: exp_num },
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${course_name}_${exp_num}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    };




    useEffect(() => {
        const fetchData = async () => {
            setValue("markdownContent", MarkdownContent_ex);
            setContentReady(true);
            const fetchContent = async () => {
                setIsLoading(true);
                try {
                    const storedData = localStorage.getItem('labManualData');
                    const formData = storedData ? JSON.parse(storedData) : {};
                    const course_name = formData.course_name;
                    const exp_aim = formData.exp_aim;
                    const include_videos = formData.include_videos;
                    const exp_num = formData.exp_num;
                    const lab_components = formData.lab_components;
                    const response = await axios.post('/api/teacher/generate-lab-manual', {
                        course_name,
                        exp_aim,
                        include_videos,
                        exp_num,
                        lab_components
                    });

                    setValue("markdownContent", response.data.MarkdownContent);
                    setContentReady(true);
                } catch (error) {
                    console.error("Error fetching content:", error);
                }
            };
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (contentReady) {
            console.log(markdownContent)
            setIsLoading(false);
        }
    }, [contentReady]);


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
                <LabManualSidebar
                    isLoading={isLoading}
                    uploadedImages={uploadedImages}
                    onInsertImage={insertImageAtCursor}
                    setUploadedImages={setUploadedImages}
                    handleSaveLesson={handleSaveLesson}
                    downloadDocxFile = {downloadDocxFile}
                />

                <LabManualContent
                    markdownText={markdownContent}
                    register={register}
                />

            </HStack>
        </>
    );
};

export default LabManual;
