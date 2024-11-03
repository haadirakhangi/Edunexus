import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  Flex,
  Spinner,
  Tabs,
  TabList,
  TabPanel,
  Tab,
  TabPanels,
  useColorModeValue,
} from '@chakra-ui/react';
import { Navbar } from '../../components/navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Lesson = {
  [key: string]: string;
};

type ButtonTextList = string[];

type LessionIds = Number[];

const LessonsGrid = () => {
  const [lessons, setLessons] = useState<Lesson>({});
  const [buttonTexts, setButtonTexts] = useState<ButtonTextList>([]);
  const [lessionIds, setLessionIds] = useState<LessionIds>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [maxHeight, setMaxHeight] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  localStorage.removeItem('lesson_id');
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const course_id = Number(localStorage.getItem('course_id'));
        const response = await axios.post('/api/teacher/get-lesson', { course_id: course_id });
        const lessonData = response.data.lessons || {};
        const buttonData: ButtonTextList = response.data.lesson_statuses || [];
        const lessonidData: LessionIds = response.data.lesson_ids || [];

        console.log(buttonData)
        setLessons(lessonData);
        setButtonTexts(buttonData);
        setLessionIds(lessonidData);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    if (Object.keys(lessons).length > 0) {
      setLoading(false);
      const heights = cardRefs.current.map((card) => card?.clientHeight || 0);
      setMaxHeight(Math.max(...heights));
    }
  }, [lessons]);

  const handleViewLesson = (buttonText: string, name: string,id: Number) => {
    if (buttonText === "Generate") {
      localStorage.setItem('lesson_name', name);
      navigate('/teacher/create-lesson');
    } else if (buttonText === "View") {
      localStorage.setItem('lesson_id', id.toString());
      navigate('/teacher/course');
    }
  };
  

  if (loading) {
    return (
      <Flex justify="center" align="center" height="90vh">
        <Spinner size="xl" color="purple.500" />
        <Heading ml={4}>Fetching Lessons...</Heading>
      </Flex>
    );
  }

  return (
    <div>
      <Navbar />
      <Tabs mt={3} isFitted variant="soft-rounded" colorScheme="purple">
        <TabList>
          <Tab>Lessons</Tab>
          <Tab>Lab Manuals</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box p={5}>
              <Heading textAlign="center" mb={6} color="purple.600">
                Lesson Modules
              </Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
                {Object.entries(lessons).map(([key, description], index) => (
                  <Flex
                    key={key}
                    direction="column"
                    p={5}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={useColorModeValue('gray.100', 'gray.700')}
                    color={useColorModeValue('gray.700', 'gray.100')}
                    boxShadow="lg"
                    ref={(el) => (cardRefs.current[index] = el)}
                    minHeight={`${maxHeight}px`}
                  >
                    <VStack align="start" spacing={3} flex="1">
                      <Text fontWeight="bold" fontSize="lg" color="purple.500">
                        {index + 1}. {key}
                      </Text>
                      <Text  fontSize="sm" justifyContent={"center"}>
                        {description}
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      width="100%"
                      bg={useColorModeValue('purple.600', 'purple.300')}
                      color="white"
                      onClick={() => handleViewLesson(buttonTexts[index],key,lessionIds[index])}
                      _hover={{ bg: 'purple.500' }}
                      mt={3}
                    >
                      {buttonTexts[index]}
                    </Button>
                  </Flex>
                ))}
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel>
            HELLO
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default LessonsGrid;
