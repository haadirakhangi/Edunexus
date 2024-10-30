import { Box, useToast, Spinner, useColorModeValue, Text, VStack, Link, List, ListItem, Button, Center } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import Quiz from './Quiz';
import VoiceQuiz from './VoiceQuiz';
import Slideshow from '../course_overview/Slideshow';
interface Subsection {
    title: string;
    content: string;
}

interface Subject {
    subject_name: string;
    title_for_the_content: string;
    content: string;
    subsections: Subsection[];
    urls: string[];
}

interface TypingAnimationProps {
    text: string;
}

const TypingHeadingAnimation = ({ text }: TypingAnimationProps) => {
    const [typedText, setTypedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setTypedText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [text]);

    return <Text className='feature-heading' fontSize="3xl" textAlign="justify" overflowWrap="break-word"><b>{typedText}</b></Text>;
};

const TypingContentAnimation = ({ text }: TypingAnimationProps) => {
    const [typedText, setTypedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setTypedText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 10); // Adjust typing speed here

        return () => clearInterval(interval);
    }, [text]);

    return <Text className='content' fontSize={"lg"} textAlign="justify" overflowWrap="break-word">{typedText}</Text>;
};

export const ContentSec = ({ subject, isLoading, images, index, data_len, quiz, quiz2, quiz3, trans, videos }: { subject?: Subject; isLoading: boolean; images: string[]; index: number; data_len: number, quiz: any, quiz2: any, quiz3: any, trans: any, videos: string[]; }) => {
    const toast = useToast();
    const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);

    const firstHalf = images[index]?.slice(0, Math.ceil(images[index].length / 2)) || [];
    const secondHalf = images[index]?.slice(Math.ceil(images[index].length / 2)) || [];
    const subsectionfirstHalf = subject?.subsections.slice(0, Math.ceil(subject?.subsections?.length / 2)) || [];
    const subsectionsecondHalf = subject?.subsections.slice(Math.ceil(subject?.subsections?.length / 2)) || [];

    useEffect(() => {
        setAudioSrc(null);
    }, [subject]);
    if (isLoading) {
        // Handle the case when subject is not defined
        return (
            <Box textAlign="center" w="205vh" height={"60vh"}>
                <Spinner size="xl" mt={"140px"} color="purple.500" />
                <Text mt={4}>Generating Content...</Text>
            </Box>
        );
    }

    const fetchAudio = async (content: Subsection[]) => {
        if (!subject) return; // Ensure subject exists
        try {
            setIsSpinnerLoading(true);
            const source_lang = localStorage.getItem('source_lang') || undefined;

            const payload = {
                content,
                subject_title: subject.title_for_the_content,
                subject_content: subject.content,
                language: source_lang,
            };

            const response = await axios.post('/api/student/generate-audio', payload, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'audio/mpeg' });
            const url = window.URL.createObjectURL(blob);
            setIsSpinnerLoading(false);
            setAudioSrc(url);
        } catch (error) {
            console.error('Error fetching audio:', error);
        }
    };

    const handledownload = async () => {
        try {
            const moduleid = localStorage.getItem('moduleid') || undefined;
            const source_lang = localStorage.getItem('source_lang') || undefined;

            const response = await axios.get(`/api/student/query2/${moduleid}/${source_lang}/download`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'course.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: 'File downloaded.',
                description: 'Check your storage. Your course is downloaded.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            {index < data_len && (
                <Box px={5} mt={4} width={'full'} height={'100vh'} overflowY={"scroll"}>
                    <Text className='main-heading' mb={5} fontSize={"5xl"}><b>{subject?.title_for_the_content ?? ''}</b></Text>
                    <Text className='feature-heading' mb={5} fontSize={"3xl"}>{trans('Find it boring to read? Download and study through voice!')}</Text>
                    <Button
                        variant="outline"
                        mb={10}
                        colorScheme="purple" _hover={{ bg: useColorModeValue('purple.600', 'purple.800'), color: useColorModeValue('white', 'white') }}
                        onClick={() => subject?.subsections && fetchAudio(subject.subsections)}>
                        <FaFilePdf size={20} />
                        {trans('Generate Audio')}</Button>
                    {isSpinnerLoading ? (
                        <Box textAlign="center">
                            <Spinner size="sm" color="purple.500" />
                            <Text mt={2}>Loading...</Text>
                        </Box>
                    ) : audioSrc ? (
                        <audio controls>
                            <source src={audioSrc} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    ) : null}
                    {/* <Text textAlign="justify" className='content' mb={10} fontSize={"xl"} overflowWrap="break-word">{subject.content}</Text> */}
                    <TypingContentAnimation text={(subject?.content ?? '').replace(/\*/g, '')} />
                    <Center>
                        <Slideshow images={firstHalf} />
                    </Center>
                    <VStack spacing={8} mb={8}>
                        {subsectionfirstHalf.map((section, index) => (
                            <Box key={index} width={"100%"}>
                                <TypingHeadingAnimation text={section.title} />
                                {/* <Text fontSize="3xl" className='feature-heading' mb={2}><b>{section.title}</b></Text>
                  <Text className='content' fontSize={"lg"} textAlign="justify" overflowWrap="break-word">{section.content}</Text> */}
                                <TypingContentAnimation text={section.content.replace(/\*/g, '')} />
                            </Box>
                        ))}
                        <Center>
                            <Slideshow images={secondHalf} />
                        </Center>
                        {subsectionsecondHalf.map((section, index) => (
                            <Box key={index} width={"100%"}>
                                <TypingHeadingAnimation text={section.title} />
                                {/* <Text fontSize="3xl" className='feature-heading' mb={2}><b>{section.title}</b></Text>
                  <Text className='content' fontSize={"lg"} textAlign="justify" overflowWrap="break-word">{section.content}</Text> */}
                                <TypingContentAnimation text={section.content.replace(/\*/g, '')} />
                            </Box>
                        ))}
                    </VStack>



                    <Text fontSize="3xl" className='feature-heading'><b>{trans('Links of Resources:')}</b></Text>
                    <List mb={5}>
                        {Array.isArray(subject?.urls) ? (
                            subject?.urls.map((url, index) => (
                                <ListItem key={index}>
                                    <Link fontSize={20} href={url} isExternal color={useColorModeValue('purple.600', 'gray.500')}>
                                        {url}
                                    </Link>
                                </ListItem>
                            ))
                        ) : (
                            <Text>No Links available</Text>
                        )}
                    </List>

                    <Text fontSize="3xl" className='feature-heading'><b>{trans('Links of Videos:')}</b></Text>
                    {/* <iframe
              width="560"
              height="315"
              src='https://www.youtube.com/watch?v=olFxW7kdtP8'
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe> */}
                    <List mb={5}>
                        {Array.isArray(videos[index]) ? (
                            videos[index].map((url, index) => (
                                <ListItem key={index}>
                                    <Link fontSize={20} href={url} isExternal color={useColorModeValue('purple.600', 'gray.500')}>
                                        {url}
                                    </Link>
                                </ListItem>
                            ))
                        ) : (
                            <Text>No Links available</Text>
                        )}
                    </List>

                    <Text fontSize="3xl" className='feature-heading'>{trans('Want to Learn Offline? Download the whole Course here:')}</Text>
                    <Button
                        variant="outline"
                        mb={10}
                        onClick={handledownload}
                        colorScheme="purple" _hover={{ bg: useColorModeValue('purple.600', 'purple.800'), color: useColorModeValue('white', 'white') }}
                    >
                        <FaDownload size={20} />

                        {trans('Download Course')}</Button>
                </Box>
            )}
            {index === data_len && (
                quiz ? (
                    <Quiz data={quiz} trans={trans}></Quiz>
                ) : (
                    <Box textAlign="center" w="100%" mt={40}>
                        <Spinner size="xl" color="purple.500" />
                        <Text mt={4}>Generating Quiz...</Text>
                    </Box>

                )
            )}
            {index === data_len + 1 && (
                quiz2 ? (
                    <Quiz data={quiz2} trans={trans}></Quiz>
                ) : (
                    <Box textAlign="center" w="100%" mt={40}>
                        <Spinner size="xl" color="purple.500" />
                        <Text mt={4}>Generating Quiz...</Text>
                    </Box>

                )
            )}

            {index === data_len + 2 && (
                quiz3 ? (
                    <VoiceQuiz data={quiz3} trans={trans}></VoiceQuiz>
                ) : (
                    <Box textAlign="center" w="100%" mt={40}>
                        <Spinner size="xl" color="purple.500" />
                        <Text mt={4}>Generating Quiz...</Text>
                    </Box>

                )
            )}

        </>
    );
};