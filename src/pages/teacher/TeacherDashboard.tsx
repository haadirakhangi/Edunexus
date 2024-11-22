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
  IconButton,
  Switch,
  useColorModeValue,
} from '@chakra-ui/react';
import { Navbar } from '../../components/navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DeleteIcon } from '@chakra-ui/icons';

type Course = {
  id: string;
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
    localStorage.setItem('course_id', course.id);
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
        <Grid
          gap={6}
          templateColumns="repeat(auto-fit, minmax(250px, 0.2fr))"
        >
          {courses.map((course) => (
            <Box
              key={course.id}
              position="relative"
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue('gray.100', 'gray.700')}
              color={useColorModeValue('gray.700', 'gray.100')}
              boxShadow="lg"
              maxWidth="350px"
            >
              {/* Header with Delete Button and Privacy Switch */}
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <IconButton
                  aria-label="Delete Course"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteCourse(course.id)}
                />

                <Flex alignItems="center">
                  <Text fontSize="sm" mr={2}>
                    Private
                  </Text>
                  <Switch
                    colorScheme="purple"
                    onChange={() => handlePrivacyToggle(course.id)}
                    isChecked={course.isPublic}
                  />
                  <Text fontSize="sm" ml={2}>
                    Public
                  </Text>
                </Flex>
              </Flex>

              {/* Course Information */}
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
                onClick={() => handleViewLessons(course)}
              >
                View Lessons
              </Button>
            </Box>
          ))}
        </Grid>
      </Box>

    </div>
  );
};

export default TeacherDashboard;
