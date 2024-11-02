import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Input,
  Flex,
  Spinner,
  Button,
  FormControl,
  FormLabel,
  Center,
  Text,
  useToast,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/navbar';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema using Yup
const schema = yup.object().shape({
  CourseName: yup.string().required('lesson name is required'),
  NumLects: yup.string().required('lesson style is required'),
    
});

const CourseCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);



  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      CourseName: '',
      NumLects: '',
    },
  });


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: { [key: string]: any }) => {
    const formData = new FormData();
    formData.append('course_name', data.CourseName);
    formData.append('num_lectures', data.NumLects);


    if (pdfFile) {
      formData.append('syllabus', pdfFile);
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/teacher/generate-lesson', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.submodules) {
        
      } else {
        toast({
          title: 'Failed to create lesson',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {loading ? (
        <>
          <Navbar />
          <Flex justify="center" align="center" width="100vw" height="90vh" textAlign="center">
            <VStack>
              <Spinner size="xl" color="purple.500" />
              <Heading>Generating SubModules...</Heading>
            </VStack>
          </Flex>
        </>
      ) : (
        <Box bg="purple.200" minHeight={'100vh'} minWidth={'100vw'}>
          <Navbar />
          <Box display="flex" alignItems="center" justifyContent="center" p={10}>
            <Box maxWidth="5xl" bg="white" width="40%" p={10} borderWidth={1} borderRadius="xl" boxShadow="lg">
              <Center>
                <Text className='main-heading' fontSize={"5xl"} color={"purple.600"}>
                  <b>Generate Course</b>
                </Text>
              </Center>
              <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Left Section */}
                    <FormControl mb={"5"} mt={5} isInvalid={!!errors.CourseName} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Course Name:</b></FormLabel>
                      <Input
                        placeholder="Enter the course name"
                        {...register('CourseName')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      />
                      <FormErrorMessage>{errors.CourseName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl mb={"5"} isInvalid={!!errors.NumLects} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Minimum Number of Lectures:</b></FormLabel>
                      <Input
                        placeholder="Describe the lesson"
                        {...register('NumLects')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      />
                      <FormErrorMessage>{errors.NumLects?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl mb={"5"} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Upload Lesson Related PDFs</b></FormLabel>
                      <Input
                        type="file"
                        borderColor={'purple.600'}
                        p={1}
                        multiple={true}
                        _hover={{ borderColor: "purple.600" }}
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                    </FormControl>
                <Button colorScheme="purple" _hover={{ bg: useColorModeValue('purple.600', 'purple.800'), color: useColorModeValue('white', 'white') }} variant="outline" type="submit" width="full" mt={4}>
                  Generate Base lesson
                </Button>
              </form>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

export default CourseCreate;