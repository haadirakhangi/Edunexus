import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  Flex,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { Navbar } from '../../components/navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Course = {
  id: number;
  course_name: string;
  num_of_lectures: number;
  course_code: string;
  lessons_data: any;
};

const TeacherDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/teacher/get-courses');
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewLessons = (course: Course) => {
    localStorage.setItem('course_name', course.course_name);
    localStorage.setItem('course_id', course.id.toString());
    navigate('/teacher/scheduler');
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="90vh">
        <Spinner size="xl" color="purple.500" />
        <Heading ml={4}>Fetching Courses...</Heading>
      </Flex>
    );
  }

  return (
    <div>
      <Navbar />
      <Box p={5}>
        <Heading textAlign="center" mb={6} color="purple.600">
          My Courses
        </Heading>
        <Grid gap={6}>
          {courses.map((course) => (
            <Flex
              key={course.id}
              direction="column"
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue('gray.100', 'gray.700')}
              color={useColorModeValue('gray.700', 'gray.100')}
              boxShadow="lg"
              maxWidth="350px"
            >
              <VStack align="start" spacing={3} flex="1">
                <Text fontWeight="bold" fontSize="lg" color="purple.500">
                  {course.course_name}
                </Text>
                <Text fontSize="sm">Course Code: {course.course_code}</Text>
                <Text fontSize="sm">Number of Lectures: {course.num_of_lectures}</Text>
              </VStack>
              <Button
                size="sm"
                width="100%"
                bg="purple.600"
                color="white"
                _hover={{ bg: 'purple.500' }}
                mt={3}
                onClick={() => handleViewLessons(course)}              >
                View Lessons
              </Button>
            </Flex>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default TeacherDashboard;
