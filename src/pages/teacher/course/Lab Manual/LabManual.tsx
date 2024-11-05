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
    const lab_manual_id = Number(localStorage.getItem('lab_manual_id'));
    const handleSaveLabManual = async () => {
        const course_id = Number(localStorage.getItem('course_id'));
        const exp_num = Number(localStorage.getItem('exp_num'));
        const exp_aim = localStorage.getItem('exp_aim');

        try {
            const response = await axios.post('/api/teacher/add-lab-manual', {
                markdown_content: markdownContent,
                uploaded_images: uploadedImages,
                course_id: course_id,
                lab_manual_id: lab_manual_id,
                exp_aim: exp_aim,
                exp_num: exp_num,
            }, { withCredentials: true });

            alert("Lab Manual Saved Successfully!");
            if (response.data.response) {
                localStorage.setItem('lab_manual_id', response.data.lab_manual_id.toString())
            }
        } catch (error) {
            console.error('Error saving lab manual:', error);
            alert('Failed to save lab manual.');
        }
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
            const course_id = localStorage.getItem('course_id');
            const formData = storedData ? JSON.parse(storedData) : {};
            const course_name = formData.course_name;
            const exp_num = formData.exp_num;
            const response = await axios.post(
                '/api/teacher/create-lab-manual-docx',
                { markdown: markdownContent, course_id: course_id, course_name: course_name, exp_num: exp_num },
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
        // setValue("markdownContent", MarkdownContent_ex);
        // setContentReady(true);
        const fetchContent = async () => {
            setIsLoading(true);
            if (lab_manual_id == 0) {
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
            } else {
                const response = await axios.post('/api/teacher/fetch-lab-manual', {
                    lab_manual_id: lab_manual_id
                }, { withCredentials: true });
                const umg = JSON.parse(response.data.uploaded_images);
                setUploadedImages(umg);
                setValue("markdownContent", response.data.markdown_content);
                setIsLoading(false);

            }
        };

        fetchContent();
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
                    handleSaveLesson={handleSaveLabManual}
                    downloadDocxFile={downloadDocxFile}
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
