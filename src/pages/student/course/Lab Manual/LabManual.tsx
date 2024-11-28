import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Spinner,
    Heading,
    VStack,
    HStack,
    Flex,
} from '@chakra-ui/react';
import { Navbar } from '../../../../components/navbar';
import LabManualContent from './LabManualContent';
import LabManualSidebar from './LabManualSidebar';

const StudentLabManual: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [imageList, setImageList] = useState<string[]>([]);
    const lab_manual_id = localStorage.getItem('lab_manual_id');

    const downloadDocxFile = async () => {
        try {
            const storedData = localStorage.getItem('labManualData');
            const course_id = localStorage.getItem('course_id');
            const formData = storedData ? JSON.parse(storedData) : {};
            const course_name = formData.course_name;
            const exp_num = formData.exp_num;
            const response = await axios.post(
                '/api/teacher/create-lab-manual-docx',
                { markdown: markdownContent, markdown_images: imageList, course_id: course_id, course_name: course_name, exp_num: exp_num },
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
        const fetchContent = async () => {
            setIsLoading(true);
            const response = await axios.post('/api/teacher/fetch-lab-manual', {
                lab_manual_id: lab_manual_id
            }, { withCredentials: true });
            const umg = JSON.parse(response.data.uploaded_images);
            const mkmg = JSON.parse(response.data.markdown_images);

            setUploadedImages(umg);
            setMarkdownContent(response.data.markdown_content);
            setImageList(mkmg);
            setIsLoading(false);
        };

        fetchContent();
    }, []);

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
                    downloadDocxFile={downloadDocxFile}
                />
                <LabManualContent
                    markdownText={markdownContent}
                    imageList={imageList}
                />
            </HStack>
        </>
    );
};

export default StudentLabManual;
